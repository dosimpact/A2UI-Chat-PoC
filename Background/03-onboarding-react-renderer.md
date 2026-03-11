# React Renderer 온보딩 (A2UI-add-react-renderer/renderers/react)

이 문서는 `references/A2UI-add-react-renderer/renderers/react` 기준으로 작성한 React 렌더러 프로젝트의 프로젝트 요약, 아키텍처, 실행·테스트 방법입니다.

## 1) 프로젝트 개요

- 패키지명: `@a2ui/react`
- 경로: `references/A2UI-add-react-renderer/renderers/react`
- 버전: `0.8.0`
- 목적: A2UI(JSON UI 메시지)로 전달되는 Surface/컴포넌트 트리를 React에서 렌더링
- 핵심 특징:
  - `@a2ui/lit`의 메시지 처리기(`Data.createSignalA2uiMessageProcessor`) 재사용
  - React 18/19 지원
  - 컴포넌트 레지스트리 기반 동적/지연 렌더링
  - `A2UIProvider` + `A2UIRenderer` + `ComponentNode`의 3단 구성
  - 정적 스타일 주입 API 제공 (`injectStyles`)

## 2) 큰 아키텍처

### 2.1. 핵심 실행 흐름

1. 사용자/AI 메시지 수신부에서 `ServerToClientMessage[]`를 앱으로 전달
2. `A2UIProvider`가 `processMessages`로 메시지를 `@a2ui/lit` 메시지 프로세서에 전달
3. 프로세서 상태가 변경되면 `version`이 증가하면서 화면 업데이트 신호 발생
4. `A2UIRenderer`가 `surfaceId` 기준으로 루트 서피스를 조회해 출력
5. `ComponentNode`가 컴포넌트 타입별로 registry에서 실제 React 컴포넌트를 찾아 재귀 렌더링
6. 인터랙션은 액션 디스패치로 클라이언트로 전달

### 2.2. 상태/액션 분리(Context 분리 아키텍처)

- `A2UIProvider`는 두 컨텍스트를 분리합니다.
  - `A2UIActionsContext`: `processMessages`, `setData`, `dispatch`, `getData` 등은 참조 안정성 유지
  - `A2UIStateContext`: 상태 변경 시 `version` 증가로 렌더 반영
- `useA2UIActions()`는 재렌더 없이 액션만 사용 가능
- `useA2UIState()`는 상태 변경 구독 필요 컴포넌트에서 사용
- `useA2UI()`는 두 기능을 묶어 제공

### 2.3. 레지스트리/컴포넌트 체계

- `ComponentRegistry`가 기본 컴포넌트 카탈로그를 관리
- 기본 등록은 `registerDefaultCatalog()`를 통해 초기화
- 렌더링 시 노드 타입(Text, Row, Button 등)에 맞춰 해당 컴포넌트 클래스를 찾아 렌더링
- 일부 컴포넌트는 lazy 로딩 등록도 지원

### 2.4. 스타일/테마 체계

- 스타일은 `src/styles/index.ts`의 `injectStyles()`에서 전역으로 주입
- Lit 렌더러의 구조(`:host`, `section`, `::slotted`)를 Light DOM 기준 selector로 변환
- `ThemeProvider`, `litTheme`, `defaultTheme`로 컴포넌트 테마 제공
- 유틸리티: `cn`, `classMapToString`, `stylesToObject`, `mergeClassMaps`

### 2.5. API 진입점(요약)

- 렌더링 계층:
  - `A2UIProvider` / `A2UIRenderer` / `A2UIViewer` / `ComponentNode`
- 훅:
  - `useA2UI`, `useA2UIActions`, `useA2UIState`, `useA2UIContext`, `useA2UIComponent`
- 레지스트리:
  - `ComponentRegistry`, `registerDefaultCatalog`, `initializeDefaultCatalog`
- 타입:
  - `Types`, `Primitives`, `Surface`, `A2UIClientEventMessage` 등 re-export
- 파일: [renderers/react/src/core/A2UIProvider.tsx](/Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/src/core/A2UIProvider.tsx), [renderers/react/src/core/A2UIRenderer.tsx](/Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/src/core/A2UIRenderer.tsx), [renderers/react/src/core/ComponentNode.tsx](/Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/src/core/ComponentNode.tsx), [renderers/react/src/index.ts](/Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/src/index.ts)

## 3) 실행 방법 (개발자 온보딩)

### 3.1. 사전 준비

- Node.js 18 이상
- 패키지 관리자: npm 권장
- 선행 의존성: `@a2ui/lit`(같은 모노레포 내 패스 연동)

### 3.2. 설치 및 빌드

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react
npm install
npm run build
```

### 3.3. 단일/통합 테스트 실행

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react
npm test
```

### 3.4. 개발 보조 명령

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react

# 타입체크
npm run typecheck

# 린트
npm run lint
npm run lint:fix

# 테스트 워치 모드
npm run test:watch
```

## 4) 통합/확장 테스트(선택)

### 4.1. Visual Parity 테스트 실행

React 렌더러는 Lit과 픽셀 유사도를 비교하는 Playwright 기반 시각적 회귀 테스트를 별도 폴더에 갖고 있습니다.

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react
npm run build

cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/visual-parity
npm install
npm test
```

### 4.2. Visual Parity 개발 모드

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/visual-parity
npm run dev
```

- React 앱: `localhost:5001`
- Lit 앱: `localhost:5002`

## 5) 참고 파일 (온보딩 체크리스트)

1. [renderers/react/package.json](/Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/package.json): 패키지 스크립트/의존성/엔트리 확인
2. [renderers/react/README.md](/Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/README.md): 공식 문서(내부 API, API Reference)
3. [renderers/react/src/styles/index.ts](/Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/src/styles/index.ts): 스타일 주입 방식
4. [renderers/react/visual-parity/README.md](/Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/visual-parity/README.md): 시각적 회귀 테스트 가이드
5. [renderers/react/visual-parity/PARITY.md](/Users/dodo/workspace/projects/a2ui-chat-poc/references/A2UI-add-react-renderer/renderers/react/visual-parity/PARITY.md): Lit 대비 구조/스타일 변환 원칙

