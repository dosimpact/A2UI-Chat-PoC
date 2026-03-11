# A2UI React Onboarding

## 1. 이 저장소는 무엇인가

이 저장소의 중심은 `@easyops-cn/a2ui-react` 라이브러리다. 서버가 보내는 A2UI 메시지 스트림을 받아 React 컴포넌트 트리로 바꾸고, 사용자의 입력이나 액션을 다시 애플리케이션 바깥으로 전달한다.

핵심 포인트는 "직접 JSX를 설계하는 UI 라이브러리"가 아니라 "프로토콜 기반으로 UI를 렌더링하는 런타임"이라는 점이다. 그래서 코드를 읽을 때도 컴포넌트 하나하나보다 아래 흐름을 먼저 잡는 편이 빠르다.

1. 서버 메시지를 받는다.
2. 메시지를 surface state와 data model state로 분해한다.
3. root component부터 재귀적으로 렌더링한다.
4. 바인딩된 값은 data model에서 읽는다.
5. 사용자 입력은 data model 업데이트 또는 action dispatch로 다시 흘려보낸다.

## 2. 가장 먼저 이해해야 할 런타임 흐름

수정 작업을 시작할 때는 아래 순서로 읽는 것이 가장 효율적이다.

1. [`src/index.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/index.ts)
루트 엔트리다. 실제 구현은 버전 디렉터리로 위임한다.

2. [`src/0.8/index.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/index.ts)
현재 공개 API의 중심이다. 어떤 타입, 컴포넌트, 훅이 외부에 노출되는지 보여준다.

3. [`src/0.8/contexts/A2UIProvider.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/contexts/A2UIProvider.tsx)
메시지 배열을 받아 전체 컨텍스트를 조립하는 진입점이다. `SurfaceProvider`, `DataModelProvider`, `ComponentsMapProvider`를 묶고, 내부에서 메시지를 실제 상태로 반영한다.

4. [`src/0.8/hooks/useA2UIMessageHandler.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/hooks/useA2UIMessageHandler.ts)
프로토콜 메시지를 해석하는 곳이다. `beginRendering`, `surfaceUpdate`, `dataModelUpdate`, `deleteSurface`가 각각 어떤 상태 변경으로 이어지는지 여기서 정해진다.

5. [`src/0.8/A2UIRenderer.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/A2UIRenderer.tsx)
현재 surface 목록을 읽고 각 surface의 root component부터 렌더링을 시작한다.

6. [`src/0.8/components/ComponentRenderer.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/components/ComponentRenderer.tsx)
실제 라우터다. component definition에서 타입 이름을 읽고, 레지스트리 또는 사용자 override에서 구현체를 찾는다.

이 6개 파일을 먼저 이해하면 저장소의 큰 흐름은 거의 잡힌다.

## 3. `src` 디렉터리를 어떻게 읽어야 하나

### `src/0.8`

실제 런타임이 들어 있는 메인 영역이다.

- `contexts/`
상태 소유권이 여기 있다.

  - [`SurfaceContext.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/contexts/SurfaceContext.tsx)
  surface 단위 컴포넌트 트리를 저장한다. component definition map과 root component를 관리한다.

  - [`DataModelContext.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/contexts/DataModelContext.tsx)
  surface별 데이터 모델을 저장한다. 데이터 바인딩, 폼 입력, 액션 context 해석이 모두 여기에 의존한다.

  - [`ActionContext.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/contexts/ActionContext.tsx)
  사용자 상호작용을 외부 콜백으로 보내는 출구다. action payload를 만들 때 data model 값을 resolve한다.

  - [`ComponentsMapContext.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/contexts/ComponentsMapContext.tsx)
  기본 컴포넌트 구현을 사용자 정의 컴포넌트로 치환할 수 있게 해준다.

- `hooks/`
컴포넌트가 컨텍스트를 소비하는 표준 경로다.

  - [`useDataBinding.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/hooks/useDataBinding.ts)
  `ValueSource`를 실제 값으로 바꾼다. 리터럴과 path reference를 통합 처리한다.

  - [`useDispatchAction.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/hooks/useDispatchAction.ts)
  interactive component가 action을 외부로 보낼 때 쓴다.

  - [`useComponent.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/hooks/useComponent.ts)
  surface 내부에서 특정 component definition을 꺼내는 최소 단위 조회 훅이다.

  - [`useA2UIMessageHandler.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/hooks/useA2UIMessageHandler.ts)
  런타임의 "메시지 해석기"다.

- `components/`
서버가 선언한 component type을 실제 React 컴포넌트로 매핑한다.

  - `display/`
  읽기 전용 leaf 성격의 컴포넌트들

  - `layout/`
  자식 component를 배치하거나 반복 렌더링하는 컴포넌트들

  - `interactive/`
  입력을 data model이나 action으로 다시 연결하는 컴포넌트들

- `types/`
프로토콜과 런타임이 공유하는 타입 정의다. 새 기능을 추가할 때 대부분 여기부터 손대게 된다.

- `utils/`
path 해석, data binding 해석 같은 순수 함수 계층이다. 상태 버그를 좁혀갈 때 가장 먼저 보기 좋다.

- `schemas/`
프로토콜 JSON schema가 들어 있다. 타입과 구현 사이의 기준 문서 역할을 한다.

### `src/components/ui`

이 디렉터리는 A2UI 프로토콜 로직이 아니다. Radix UI와 Tailwind를 이용해 만든 프리미티브 래퍼 모음이다.

중요한 해석은 다음과 같다.

- 여기 파일들은 "A2UI가 무엇을 렌더링할지"를 결정하지 않는다.
- 대신 "정해진 위젯을 어떻게 보이게 할지"를 결정한다.
- 디자인 시스템을 바꾸고 싶다면 여기부터 본다.
- 메시지 처리, data binding, action 흐름을 바꾸고 싶다면 `src/0.8` 쪽을 본다.

### `src/lib`

[`src/lib/utils.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/lib/utils.ts)는 현재 class name 병합 유틸 하나만 가진다. 작지만 UI 프리미티브 대부분이 의존하는 공통 지점이다.

## 4. 핵심 개념 네 가지

### Surface

렌더링의 최상위 단위다. 하나의 surface는 root component와 component map을 가진다. 서버 메시지가 여러 surface를 동시에 보낼 수 있으므로 상태도 surface별로 분리된다.

### Data Model

컴포넌트가 값을 직접 props로만 받지 않고, 경로 기반 참조로도 받는 이유가 여기 있다. 예를 들어 `TextField`, `CheckBox`, `Slider`는 입력 결과를 data model에 기록하고, 다른 컴포넌트는 같은 경로를 다시 읽을 수 있다.

### Component Definition

런타임은 JSX를 직접 저장하지 않는다. 대신 `id`, `weight`, `component` payload를 가진 선언형 definition을 저장한다. `ComponentRenderer`는 이 definition을 읽어 실제 React 컴포넌트로 바꾼다.

### Action

사용자 행동의 외부 전달 포맷이다. 버튼 클릭 같은 상호작용은 `ActionContext`를 통해 `ActionPayload`로 변환되고, 필요하면 data model 값을 context에 합성해서 상위 애플리케이션으로 전달한다.

## 5. 수정 포인트별로 어디를 보면 되나

### 새 컴포넌트 타입을 추가하고 싶다

보통 아래 순서다.

1. [`src/0.8/types/index.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/types/index.ts)에 props 타입을 추가한다.
2. 적절한 폴더(`display`, `layout`, `interactive`)에 구현 파일을 만든다.
3. [`src/0.8/components/ComponentRenderer.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/components/ComponentRenderer.tsx)의 `componentRegistry`에 등록한다.
4. 필요하면 테스트를 같은 디렉터리의 기존 패턴에 맞춰 추가한다.

### 데이터 바인딩이 이상하다

아래 순서로 좁히면 빠르다.

1. [`src/0.8/hooks/useDataBinding.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/hooks/useDataBinding.ts)
2. [`src/0.8/utils/dataBinding.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/utils/dataBinding.ts)
3. [`src/0.8/utils/pathUtils.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/utils/pathUtils.ts)
4. [`src/0.8/contexts/DataModelContext.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/contexts/DataModelContext.tsx)

### 메시지 순서나 surface 초기화가 이상하다

[`src/0.8/hooks/useA2UIMessageHandler.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/hooks/useA2UIMessageHandler.ts)와 [`src/0.8/contexts/SurfaceContext.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/contexts/SurfaceContext.tsx)를 같이 보면 된다. 이 저장소는 `surfaceUpdate`가 `beginRendering`보다 먼저 와도 견디도록 설계되어 있다.

### 액션 payload가 기대와 다르다

[`src/0.8/contexts/ActionContext.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/contexts/ActionContext.tsx)와 [`src/0.8/utils/dataBinding.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/utils/dataBinding.ts)의 `resolveActionContext`를 먼저 본다.

## 6. 테스트는 어떻게 구성되어 있나

테스트는 대부분 소스 옆에 공존한다. 이 저장소는 아키텍처상 "상태 컨텍스트 + 훅 + 컴포넌트 라우터" 구조가 분리되어 있어서, 단위 테스트도 그 경계를 따라간다.

- context 테스트
상태 저장과 조회의 계약을 검증한다.

- hook 테스트
메시지 해석, data binding, action dispatch 같은 런타임 연결부를 검증한다.

- component 테스트
타입별 렌더링과 입력 반응을 검증한다.

변경 전에 비슷한 테스트를 먼저 찾고 패턴을 복사하는 편이 가장 빠르다.

## 7. 라이브러리 밖의 보조 영역

### `playground/`

실험장이다. 실제로 메시지와 UI를 만지며 확인할 때 가장 먼저 켜볼 곳이다. 문서보다 빠르게 런타임 감각을 잡을 수 있다.

### `website/`

배포용 문서 사이트다. 외부 설명 채널이므로, 저장소 내부 온보딩 문서보다 소비자 관점일 가능성이 높다.

### `specs/`

기능별 설계 흔적이 남아 있다. 현재 구현 의도가 애매할 때 참고할 수 있지만, 실제 진실의 원천은 `src/0.8` 구현과 테스트다.

## 8. 처음 수정할 때 추천하는 읽기 순서

1. [`package.json`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/package.json)
빌드, 테스트, 워크스페이스 구성을 확인한다.

2. [`src/0.8/index.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/index.ts)
공개 API를 본다.

3. [`src/0.8/contexts/A2UIProvider.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/contexts/A2UIProvider.tsx)
상태 조립 진입점을 본다.

4. [`src/0.8/hooks/useA2UIMessageHandler.ts`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/hooks/useA2UIMessageHandler.ts)
메시지 처리 흐름을 본다.

5. [`src/0.8/A2UIRenderer.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/A2UIRenderer.tsx)
렌더 시작 지점을 본다.

6. [`src/0.8/components/ComponentRenderer.tsx`](/Users/dodo/workspace/projects/a2ui-chat-poc/references/a2ui-react/src/0.8/components/ComponentRenderer.tsx)
타입 라우팅을 본다.

7. 수정 대상에 따라 `contexts`, `hooks`, `components`, `utils` 중 한 갈래를 깊게 들어간다.

## 9. 기억해둘 운영 규칙

- 런타임 핵심은 `src/0.8`이다.
- UI 프리미티브는 `src/components/ui`다.
- surface와 data model은 항상 분리해서 생각한다.
- component 구현을 바꿀 때는 바인딩과 액션 흐름이 깨지지 않는지 같이 본다.
- 새 기능은 가능하면 타입, 구현, 테스트를 같은 축으로 함께 추가한다.

이 문서를 읽고 나면 다음 단계는 보통 둘 중 하나다.

1. Playground를 띄워 실제 메시지와 렌더링을 확인한다.
2. 바꾸려는 기능과 가장 가까운 테스트 파일부터 읽는다.
