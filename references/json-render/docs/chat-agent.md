# Chat Agent 정리

이 문서는 [`examples/chat/lib/agent.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/agent.ts) 기준으로, 예제 chat agent의 프롬프트와 tool 구성을 빠르게 파악할 수 있도록 정리한 메모다.

## 개요

- 에이전트 구현체는 `ToolLoopAgent`를 사용한다.
- 기본 모델은 `anthropic/claude-haiku-4.5`이고, 실제 실행 시에는 `process.env.AI_GATEWAY_MODEL`이 있으면 그 값을 우선 사용한다.
- 모델 생성은 `gateway(...)`를 통해 AI Gateway에 연결한다.
- 최대 tool-loop 단계는 `stepCountIs(5)`로 제한한다.
- `temperature`는 `0.7`이다.

```ts
export const agent = new ToolLoopAgent({
  model: gateway(process.env.AI_GATEWAY_MODEL || DEFAULT_MODEL),
  instructions: AGENT_INSTRUCTIONS,
  tools: {
    getWeather,
    getGitHubRepo,
    getGitHubPullRequests,
    getCryptoPrice,
    getCryptoPriceHistory,
    getHackerNewsTop,
    webSearch,
  },
  stopWhen: stepCountIs(5),
  temperature: 0.7,
});
```

## Agent 역할

시스템 프롬프트는 이 agent를 다음처럼 규정한다.

- 실시간 정보를 찾는 지식형 assistant
- 데이터를 조회한 뒤 시각적 대시보드를 만드는 assistant
- 설명형 답변과 JSONL UI spec을 함께 생성하는 assistant

핵심 워크플로는 3단계다.

1. 적절한 tool을 먼저 호출해 실제 데이터를 수집한다.
2. 찾은 내용을 짧고 자연스럽게 요약한다.
3. 그 다음 렌더러가 소비할 JSONL UI spec을 ````spec` fence 안에 출력한다.

즉, 이 agent는 "텍스트 답변만 하는 모델"이 아니라 "요약 + spec 생성기"다.

## 프롬프트 핵심 규칙

[`examples/chat/lib/agent.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/agent.ts)에 들어 있는 `AGENT_INSTRUCTIONS`는 크게 6개 영역으로 나뉜다.

### 1. 데이터 우선

- 항상 tool을 먼저 호출해야 한다.
- 실데이터를 `/state`에 넣고 UI는 그 값을 참조해야 한다.
- 데이터를 만들거나 추정해서는 안 된다.
- `$state` 바인딩은 항상 객체 문법을 사용한다.
  - 예: `{ "$state": "/weather/current" }`

### 2. 2D UI 구성 규칙

- `Card`로 관련 정보를 묶는다.
- `Card` 안에 또 다른 `Card`를 중첩하면 안 된다.
- 다열 레이아웃은 `Grid`를 우선 사용한다.
- 핵심 수치는 `Metric`
- 목록 데이터는 `Table`
- 시계열/추세는 `BarChart`, `LineChart`
- 비율/구성은 `PieChart`
- 카테고리 분리는 `Tabs`
- 상태 표시는 `Badge`
- 핵심 포인트는 `Callout`
- 자세한 설명은 `Accordion`
- 순서/히스토리는 `Timeline`

추가로 [`examples/chat/lib/render/catalog.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/render/catalog.ts)에서 `explorerCatalog.prompt(...)`를 통해 다음 제약도 주입된다.

- `min-h-screen`, `h-screen` 같은 viewport height 클래스 금지
- `Grid columns='2'` 또는 `columns='3'` 선호
- 숫자는 가능하면 `Text`보다 `Metric`
- 차트 데이터는 `/state` 배열로 두고 `data` prop에서 참조
- 과한 여백 없이 정보 밀도를 높일 것
- 교육형 응답은 `Callout`, `Accordion`, `Timeline`, 차트를 섞을 것

### 3. 3D Scene 규칙

프롬프트는 3D 시각화까지 다룬다.

- `Scene3D`가 항상 루트
- 모든 3D primitive는 `Scene3D` 하위에 있어야 함
- `Group3D`의 `animation.rotate`는 프레임당 회전량이라 아주 작은 값만 사용
- 조명은 최소 `AmbientLight` 포함
- 공간형 주제에는 `Sphere`, `Box`, `Ring`, `Stars`, `Label3D` 등을 조합
- 태양계 예시는 "반드시 8개 행성 전체"를 포함해야 함

즉, 프롬프트 수준에서 "설명형 2D UI"뿐 아니라 "교육용 3D scene"도 생성 대상으로 보고 있다.

### 4. 상태 바인딩 규칙

- 상태 모델이 single source of truth
- `/state` patch를 먼저 내보낸 뒤 그 상태를 참조하는 element를 출력
- scalar, array, chart data 모두 `$state`로 바인딩
- 어떤 prop에서도 `$state` 사용 가능

### 5. 인터랙션 규칙

프롬프트에서 허용하는 주요 동작은 다음과 같다.

- `visible`
- `repeat`
- `on.press`
- `$cond / $then / $else`

내장 action도 명시돼 있다.

- `setState`
- `pushState`
- `removeState`

입력 컴포넌트도 프롬프트에 직접 포함돼 있다.

- `RadioGroup`
- `SelectInput`
- `TextInput`
- `Button`

### 6. Quiz 패턴

퀴즈, 테스트, Q&A 요청이 오면 아래 패턴을 따르도록 지시한다.

- 각 질문의 답과 제출 여부를 `/state/q1`, `/state/q1_submitted` 식으로 초기화
- 각 질문은 `Card` 단위로 렌더링
- `RadioGroup`으로 답 선택
- `Button`의 `on.press`로 제출 상태 변경
- `visible` 조건으로 정답/오답 피드백 표시
- 모든 문항 제출 후 최종 점수 섹션도 노출 가능

즉, prompt가 단순 자유 생성이 아니라 "상태 기반 interactive quiz 빌더" 역할까지 미리 정의하고 있다.

## Tools 목록

등록된 tool은 총 7개다.

| Tool | 파일 | 용도 |
| --- | --- | --- |
| `getWeather` | [`examples/chat/lib/tools/weather.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/weather.ts) | 도시 기준 현재 날씨 + 7일 예보 |
| `getGitHubRepo` | [`examples/chat/lib/tools/github.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/github.ts) | 공개 GitHub 저장소 메타데이터 |
| `getGitHubPullRequests` | [`examples/chat/lib/tools/github.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/github.ts) | 공개 GitHub 저장소 PR 목록 |
| `getCryptoPrice` | [`examples/chat/lib/tools/crypto.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/crypto.ts) | 코인 현재 시세 + 7일 sparkline |
| `getCryptoPriceHistory` | [`examples/chat/lib/tools/crypto.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/crypto.ts) | 코인 기간별 가격 히스토리 |
| `getHackerNewsTop` | [`examples/chat/lib/tools/hackernews.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/hackernews.ts) | Hacker News top stories |
| `webSearch` | [`examples/chat/lib/tools/search.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/search.ts) | 일반 주제용 웹 검색 |

## Tool 상세

### `getWeather`

파일: [`examples/chat/lib/tools/weather.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/weather.ts)

- 입력
  - `city: string`
- 데이터 소스
  - Open-Meteo geocoding API
  - Open-Meteo forecast API
- 반환 요약
  - 도시명, 국가
  - 현재 온도, 체감온도, 습도, 풍속, 날씨 상태
  - 7일 예보 배열
- 특징
  - API key 불필요
  - 도시를 먼저 좌표로 변환한 뒤 날씨 조회
  - 단위는 화씨, mph, inch 고정

### `getGitHubRepo`

파일: [`examples/chat/lib/tools/github.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/github.ts)

- 입력
  - `owner: string`
  - `repo: string`
- 데이터 소스
  - GitHub REST API
- 반환 요약
  - 저장소 이름, 설명, URL
  - stars, forks, issues, watchers
  - primary language, license
  - 생성일, 업데이트일, 마지막 push 시점
  - topics
  - 언어별 비중 배열
- 특징
  - `/languages` endpoint를 같이 호출해 language breakdown 생성
  - 비인증 public API라 rate limit 영향을 받을 수 있음

### `getGitHubPullRequests`

파일: [`examples/chat/lib/tools/github.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/github.ts)

- 입력
  - `owner: string`
  - `repo: string`
  - `state: "open" | "closed" | "all" | null`
  - `sort: "created" | "updated" | "popularity" | "long-running" | null`
  - `perPage: number | null`
- 데이터 소스
  - GitHub REST API pulls endpoint
  - 리뷰, reaction endpoint 추가 조회
- 반환 요약
  - 저장소명, 상태, 개수
  - PR 번호, 제목, 상태, 작성자, URL
  - comments, reviews, reactions, labels, draft 여부
- 특징
  - PR마다 review count와 reaction count를 추가로 enrich
  - `sort="popularity"` 같은 탐색형 UI에 적합

### `getCryptoPrice`

파일: [`examples/chat/lib/tools/crypto.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/crypto.ts)

- 입력
  - `coinId: string`
- 데이터 소스
  - CoinGecko `/coins/{id}`
- 반환 요약
  - 현재 가격, 시총, 24h 거래량
  - 24h / 7d / 30d 변화율
  - 24h 고가/저가
  - ATH 및 날짜
  - 유통량, 총발행량
  - 7일 sparkline
- 특징
  - sparkline을 차트용 데이터 배열로 샘플링
  - `bitcoin`, `ethereum` 같은 CoinGecko ID가 필요

### `getCryptoPriceHistory`

파일: [`examples/chat/lib/tools/crypto.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/crypto.ts)

- 입력
  - `coinId: string`
  - `days: number` (`1`~`365`)
- 데이터 소스
  - CoinGecko `/market_chart`
- 반환 요약
  - `coinId`
  - `days`
  - 차트용 `priceHistory`
- 특징
  - 최대 20포인트로 샘플링해서 바로 `LineChart`에 쓰기 좋음

### `getHackerNewsTop`

파일: [`examples/chat/lib/tools/hackernews.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/hackernews.ts)

- 입력
  - `count: number` (`1`~`30`)
- 데이터 소스
  - Hacker News Firebase API
- 반환 요약
  - story id, title, url
  - score, author, comments
  - postedAt, hnUrl
- 특징
  - top story id 목록을 가져온 뒤 각 item을 병렬 조회

### `webSearch`

파일: [`examples/chat/lib/tools/search.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/json-render/examples/chat/lib/tools/search.ts)

- 입력
  - `query: string`
- 데이터 소스
  - `generateText({ model: gateway("perplexity/sonar") })`
- 반환 요약
  - `content: string`
- 특징
  - specialized tool이 없는 일반 주제 검색용 fallback
  - ToolLoopAgent 안에서도 일반 tool처럼 호출되도록 래핑돼 있음
  - 실패 시 `error` 문자열 반환

## 이 agent가 잘하는 요청 유형

- "서울 날씨 보여줘"
- "vercel/next.js 저장소 요약해줘"
- "최근 인기 있는 Next.js PR 보여줘"
- "비트코인 최근 90일 가격 추이"
- "오늘 해커뉴스 톱 10"
- "양자컴퓨팅 설명해줘" 같은 일반 주제 + 시각적 교육 UI
- "태양계 설명해줘" 같은 3D 시각화 포함 교육형 응답

## 응답 형식 기대치

이 agent의 출력은 보통 두 덩어리다.

1. 사람에게 읽히는 짧은 요약
2. ````spec` fenced block 안의 JSONL spec

따라서 소비자 UI는 "텍스트 + streamed spec" 패턴을 전제로 구현하는 편이 맞다.

## 구현 포인트 메모

- 프롬프트가 매우 강하게 UI 구성 가이드를 준다.
- tool 결과는 `/state`에 넣고 그 위에 컴포넌트를 얹는 구조가 핵심이다.
- 이 예제의 차별점은 단순 Q&A가 아니라 "tool 호출 + structured UI generation + optional 3D scene"의 결합이다.
- 일반 지식 검색은 별도 검색 API wrapper가 아니라 `perplexity/sonar` 모델 호출로 처리한다.
