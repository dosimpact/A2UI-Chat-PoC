# A2UI-add-react-renderer 온보딩 문서

## 1. 목적

이 문서는 `A2UI-add-react-renderer`(참조 소스: `references/A2UI-add-react-renderer`) 기준으로
프로젝트를 처음 접할 때 필요한 실행 흐름을 정리합니다.

핵심 초점:

- A2UI 에이전트 확장 모듈(`a2a_agents/python/a2ui_agent`)의 실행/검증
- React 렌더러를 활용한 데모 실행 흐름 파악
- 실행 전 사전 조건

## 2. 사전 조건

필수:

- Python 3.10 이상
- uv
- Node.js 18 이상

권장:

- LLM 호출용 키 발급: `GEMINI_API_KEY` (또는 Vertex AI 사용 시 `GOOGLE_GENAI_USE_VERTEXAI=TRUE`)

## 3. 폴더 핵심 구조 (요약)

- `references/A2UI-add-react-renderer/a2a_agents/python/a2ui_agent/`  
  - 에이전트 확장 기능 라이브러리(파이썬 패키지)
  - `README.md`에서 테스트/빌드 방법이 정의됨
- `references/A2UI-add-react-renderer/samples/agent/adk/restaurant_finder/`  
  - A2UI 에이전트 샘플 서버(ADK + A2A)
  - 실제로 `uv run .`로 실행해 동작 확인
- `references/A2UI-add-react-renderer/renderers/react/`  
  - React 렌더러 패키지
- `references/A2UI-add-react-renderer/samples/client/react/shell/`  
  - React 샘플 클라이언트

## 4. 프로젝트 온보딩 순서

### 4.1 공통 저장소 진입

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer
```

### 4.2 a2ui_agent 모듈 상태 점검

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/a2a_agents/python/a2ui_agent
uv sync
uv run --with pytest pytest tests/
uv build .
```

- `uv sync`  
  - 로컬 개발 의존성을 맞춤
- `uv run --with pytest pytest tests/`  
  - 단위/통합 테스트 실행
- `uv build .`  
  - 패키지 빌드 (wheel/sdist 생성)

### 4.3 a2ui_agent 실행 가이드 (핵심)

`a2ui_agent`는 별도의 실행 엔트리포인트가 없는 **라이브러리 패키지**입니다.  
즉, 아래 명령으로 단독 실행은 되지 않습니다.

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/a2a_agents/python/a2ui_agent
uv run python -m a2ui  # 예: 단독 실행 시도 (권장되지 않음/예상 실패)
```

대신 `a2ui_agent`는 샘플 에이전트에서 import해서 사용해야 합니다.

샘플 에이전트 연동 실행:

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/samples/agent/adk/restaurant_finder
cp .env.example .env   # API 키 입력
uv run .
```

실행 시 동작 포인트:

- 기본 호스트/포트는 `localhost:10002`
- 에이전트 카드에 `a2ui` 확장이 붙어있는지 확인하여 클라이언트와 메시지 교환

## 5. API 키 환경 변수

```bash
export GEMINI_API_KEY=...
# 또는
export GOOGLE_GENAI_USE_VERTEXAI=TRUE
# (선택) LLM 모델 커스텀
export LITELLM_MODEL=gemini/gemini-2.5-flash
```

## 6. React 데모까지 이어서 실행 (옵션)

```bash
# 1) React 렌더러 빌드
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react
npm install
npm run build

# 2) React 샘플 실행
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/samples/client/react/shell
npm install
npm run dev
```

클라이언트는 `a2ui_agent` 자체를 직접 실행하는 구조가 아니라,
`restaurant_finder` 에이전트(백엔드)와 맞물려 동작합니다.

