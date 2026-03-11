# React E2E Plan

## Scope
- `1.A2UI-React-Shadcn`의 결과물을 사용하는 사용처(consumer)에서
- React 기반 Chat UI + A2UI 렌더링 통합 E2E 테스트를 수행하는 공간.

## Final Deliverable
- React 사용처에서 동작하는 `A2UI Chat + Viewer` 제공

## UI Benchmark Gate
- [ ] 결과 UI/UX가 [a2ui-composer.ag-ui.com](https://a2ui-composer.ag-ui.com/)와 동등한 사용 흐름을 제공
  - [ ] Chat 입력 -> A2UI Viewer 렌더 -> action round-trip 갱신 흐름이 끊김 없이 동작
  - [ ] 로딩/오류/fallback 상태가 사용자에게 명확히 보임

## Checklist
- [ ] consumer 앱에서 1번 구현 결과 연결(패키지/모듈/빌드 아티팩트) 확인
- [ ] Chat UI에서 Viewer가 surface를 정상 렌더링
- [ ] smoke: app boot + surface render
- [ ] action round-trip: click/input -> agent response -> UI update
- [ ] failure handling: timeout/error fallback
- [ ] visual regression baseline for key flows

## Done Criteria
- [ ] React 사용처에서 `A2UI Chat + Viewer`를 실제로 실행 가능
- [ ] 핵심 E2E 시나리오(smoke/action/failure)가 통과
- [ ] `UI Benchmark Gate` 충족

## Boundary
- 이 디렉터리 내 파일만 수정.
