# Background: 기존 레퍼런스 구현 범위 분석 (2026-02-28)

## 분석 대상
- `A2UI-Original`
- `A2UI-add-react-renderer`

## 분석 방식
- 코드/문서/디렉터리 정적 분석
- 파일 목록 비교(`comm`, `rg --files`) + 핵심 엔트리 파일 확인
- 참고: 테스트 실행은 이번 단계에서 수행하지 않음

## 1) 전체 현황 요약

| 항목 | A2UI-Original | A2UI-add-react-renderer | 관찰 |
|---|---:|---:|---|
| 전체 파일 수 | 818 | 921 | `add-react-renderer`가 더 큼 |
| `renderers` 전체 파일 수 | 133 | 230 | React 추가 영향 |
| `renderers/react` | 없음 | 117 | React 렌더러 실구현 존재 |
| `renderers/web_core` 파일 수 | 48 | 28 | `add-react-renderer`가 더 작음 |
| `renderers/web_core/src/v0_9` 파일 수 | 22 | 2 | `add-react-renderer` 쪽 v0.9 코어 축소 |
| 렌더러 테스트성 파일 수 | lit 1, web_core 8 | lit 1, react 30, web_core 1 | React 테스트는 풍부, web_core v0.9 테스트는 축소 |
| `samples/client/react` | 없음 | 17 | React 샘플 셸 존재 |

## 2) A2UI-Original 구현 상태

### 2.1 프로토콜/스펙
- `specification/v0_8`(28 files), `v0_9`(56 files), `v0_10`(51 files) 보유.
- 문서상 상태:
  - `v0_8`: closed
  - `v0_9`: closed(현재 published)
  - `v0_10`: under development

### 2.2 렌더러
- 공식 코드 기준으로 `Angular`, `Lit`, `Flutter(README)` 제공.
- `React` 렌더러 코드는 없음.
- `web_core`는 `v0_8` + `v0_9` 계층 모두 비교적 완전하게 존재:
  - 메시지 처리기(`processing/message-processor.ts`)
  - surface/component/data model 계층
  - schema/common/event/context 계층
  - 테스트 7개

### 2.3 샘플/에이전트
- 클라이언트 샘플: Angular, Lit.
- 에이전트 샘플/파이썬 에이전트 확장 코드 풍부.

## 3) A2UI-add-react-renderer 구현 상태

### 3.1 React 렌더러 (핵심 추가분)
- `renderers/react` 전체 구현 존재:
  - Provider/Renderer/Viewer/Hooks (`A2UIProvider`, `A2UIRenderer`, `A2UIViewer`, `useA2UI`)
  - 표준 카탈로그 컴포넌트 등록(`defaultCatalog`)
  - 컴포넌트 레지스트리 + lazy loading
  - 스타일 주입/테마 컨텍스트
- 테스트:
  - Unit(컴포넌트) 16
  - Integration 8
  - Visual parity 인프라 및 픽스처(컴포넌트 픽스처 19)
- 샘플:
  - `samples/client/react/shell` 존재(로컬 `@a2ui/react` 패키지 참조)

### 3.2 React 구현의 기술적 특징
- React 타입/코어가 `@a2ui/lit/0.8`에 의존:
  - 타입 재수출, 메시지 처리(`Data.createSignalA2uiMessageProcessor`)를 Lit 경유로 사용
- 즉, 현재 React 경로는 독립 `web_core v0.9` 기반이라기보다 **v0.8/Lit 코어 재사용형 구현**에 가깝다.

### 3.3 동시 존재하는 공백/불일치
- `renderers/web_core/src/v0_9`가 2파일(`state/data-model.ts`, test)만 존재.
- 그럼에도 `renderers/web_core/package.json`에는 `./v0_9` export가 선언되어 있어, 원본 대비 완결성이 낮음.
- 문서는 여전히 React를 “Coming Q1 2026 / In Progress”로 표시(`docs/renderers.md`, `docs/introduction/how-to-use.md`)하나, 코드베이스에는 React 구현/테스트가 실제로 존재.

## 4) 두 레퍼런스 차이(핵심)

### 4.1 `add-react-renderer`에 추가된 것
- `renderers/react/**` 전체
- `samples/client/react/shell/**`
- React visual parity 테스트 체계

### 4.2 `add-react-renderer`에서 빠진 것(Original 대비)
- `renderers/web_core/src/v0_9`의 다수 계층:
  - `catalog/`, `common/`, `processing/`, `rendering/`, `schema/`, `state` 다수 파일
- 스펙 일부 파일:
  - `specification/v0_9/docs/renderer_guide.md`
  - `specification/v0_9/json/server_capabilities.json`
  - `specification/v0_9/json/catalogs/minimal/**`
  - `specification/v0_10/json/server_capabilities.json`
- 기타:
  - `a2a_agents/python/a2ui_agent/agent_development.md`

## 5) 현재 기준 구현 범위 결론

- **프로토콜 기준점**: 문서/스펙 축은 `Original`이 더 완전하고 최신 분화(v0_9/v0_10 관련 파일)가 잘 남아 있음.
- **React 렌더러 기준점**: `add-react-renderer`가 실질적 구현/테스트/샘플을 이미 보유.
- **주의점**: `add-react-renderer`는 React를 추가한 대신, `web_core v0_9`와 일부 스펙 파일이 `Original` 대비 축소되어 있어, “React 추가 + 코어 최신성”을 동시에 만족하려면 병합 전략이 필요.

## 6) 이후 Background 관점에서 사용할 기준(초안)

- 프로토콜/스키마/코어 레퍼런스 우선순위: `A2UI-Original`
- React 렌더링 구현 레퍼런스 우선순위: `A2UI-add-react-renderer`
- 향후 목표(Shadcn 계열 A2UI) 준비를 위해, 다음 단계에서
  - React 렌더러의 카탈로그 확장 포인트(Registry/Theme/Component contracts)
  - 프로토콜 버전 선택(v0.8 유지 vs v0.9/v0.10 상향)
  를 분리해서 설계하는 것이 합리적이다.
