# A2UI Chat POC One-Pager (전체 점검 가이드)

## 목적
- 이 문서는 `1.A2UI-React-Shadcn` 모노레포에서 **내가 전체 상태를 점검**할 때 쓰는 실행 순서와 체크리스트다.
- 기준은 "재현 가능 + 근거 있는 Pass/Fail"이다.

## 점검 범위
- 모노레포 설치/워크스페이스 인식
- 핵심 런타임 테스트
  - `renderers/web_core`
  - `renderers/react`
- 시각 동등성(React vs Lit)
  - `renderers/react/visual-parity`
- 소비자 E2E
  - `workspaces/react-e2e-testing`
  - `workspaces/nextjs-e2e-testing`
- 스코프 제한 검사
  - `plan/reports/scripts/verify-scope-constraints.sh`

## 사전 조건
- Node.js 20+
- pnpm 10.x
- Playwright 브라우저 설치

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/1.A2UI-React-Shadcn
pnpm -v
npx playwright install chromium
```

## 권장 전체 점검 순서 (복붙 실행)

```bash
set -e
cd /Users/dodo/workspace/projects/a2ui-chat-poc/1.A2UI-React-Shadcn

# 1) workspace 설치
pnpm install

# 2) workspace 인식 확인
pnpm -r list --depth -1

# 3) web_core 테스트
pnpm --dir renderers/web_core test

# 4) react 빌드 + 테스트
pnpm --dir renderers/react build
pnpm --dir renderers/react test -- --run

# 5) visual parity
pnpm --dir renderers/react/visual-parity test

# 6) consumer E2E
pnpm --filter react-e2e-consumer test:e2e
pnpm --filter nextjs-e2e-consumer test:e2e

# 7) scope gate
./plan/reports/scripts/verify-scope-constraints.sh
```

## 체크리스트 (내가 보는 항목)
- [ ] `pnpm install`이 실패 없이 끝남
- [ ] `pnpm -r list --depth -1`에 아래가 보임
- `@a2ui/react`
- `@a2ui/web_core`
- `@a2ui/visual-parity`
- `react-e2e-consumer`
- `nextjs-e2e-consumer`
- [ ] `renderers/web_core` 테스트 전부 pass
- [ ] `renderers/react` 테스트 전부 pass
- [ ] `visual-parity` 전부 pass
- [ ] React E2E `3 passed`
- [ ] Next E2E `4 passed`
- [ ] scope gate `PASS: all changed files are within allowed scope.`

## 알려진/정상 경고
- Next E2E 로그의 `intentional crash for boundary verification`
- 이는 에러 경로 테스트용 로그이며, 테스트가 pass면 정상이다.
- `pnpm install` 시 일부 peer dependency warning
- 현재 점검 대상과 무관한 optional/외부 의존성 경고가 포함될 수 있다.

## 실패 시 우선 점검
1. `pnpm install` 실패
- `pnpm-workspace.yaml` 범위 확인 (`workspaces/*`, `samples/client/react/shell` 포함)
- 잘못된 로컬 링크 패키지가 workspace에 포함됐는지 확인

2. `vite: command not found`
- 해당 패키지가 workspace에 포함됐는지 확인
- 루트에서 `pnpm install` 재실행

3. E2E에서 Playwright 실행 실패
- `npx playwright install chromium` 재실행

4. visual parity 실패
- 먼저 `renderers/react` 재빌드 후 재실행
- `pnpm --dir renderers/react build`
- `pnpm --dir renderers/react/visual-parity test`

## 데모 실행 (수동 확인)

```bash
# React shell demo
pnpm --filter @a2ui/react-shell dev

# React consumer demo
pnpm --filter react-e2e-consumer dev

# Next consumer demo
pnpm --filter nextjs-e2e-consumer dev
```

## 결과 기록 템플릿
- Date:
- Git branch:
- Install: PASS/FAIL
- web_core: PASS/FAIL
- react tests: PASS/FAIL
- visual parity: PASS/FAIL
- react e2e: PASS/FAIL
- next e2e: PASS/FAIL
- scope gate: PASS/FAIL
- Blocker:
- Notes:
