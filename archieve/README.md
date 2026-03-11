# a2ui-chat-poc 실행/테스트 가이드

## 디렉터리 구성

- `1.A2UI-React-Shadcn`: pnpm 모노레포 루트 (A2UI 런타임/렌더러/문서 + E2E 워크스페이스)
- `1.A2UI-React-Shadcn/workspaces/react-e2e-testing`: React consumer E2E 레인
- `1.A2UI-React-Shadcn/workspaces/nextjs-e2e-testing`: Next.js consumer E2E 레인

## 사전 준비

- Node.js 20+ 권장
- `pnpm` 사용
- Playwright 브라우저 설치 필요

```bash
npx playwright install chromium
```

## 1) React 렌더러 빌드/단위 테스트

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/1.A2UI-React-Shadcn/renderers/react
pnpm install
pnpm run build
pnpm run test -- --run
```

## 2) Visual Parity 테스트 (Lit vs React)

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/1.A2UI-React-Shadcn/renderers/react/visual-parity
pnpm install
pnpm run test
```

참고:
- 현재 `multipleChoice` fixture는 Lit/React 구현 모델 차이로 parity 대상에서 제외되어 있습니다.
- `dateTimeInputTime`, `videoBasic`, `videoWithPathBinding`는 브라우저 native 렌더 차이를 반영해 허용 임계치가 완화되어 있습니다.

## 3) React consumer E2E

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/1.A2UI-React-Shadcn/workspaces/react-e2e-testing
pnpm install
pnpm run build
pnpm run test:e2e
```

## 4) Next.js consumer E2E

```bash
cd /Users/dodo/workspace/projects/a2ui-chat-poc/1.A2UI-React-Shadcn/workspaces/nextjs-e2e-testing
pnpm install
pnpm run build
pnpm run test:e2e
```

## 전체 스모크 순서(권장)

```bash
# 1) React runtime
cd /Users/dodo/workspace/projects/a2ui-chat-poc/1.A2UI-React-Shadcn/renderers/react
pnpm install && pnpm run build && pnpm run test -- --run

# 2) Visual parity
cd /Users/dodo/workspace/projects/a2ui-chat-poc/1.A2UI-React-Shadcn/renderers/react/visual-parity
pnpm install && pnpm run test

# 3) React E2E lane
cd /Users/dodo/workspace/projects/a2ui-chat-poc/1.A2UI-React-Shadcn/workspaces/react-e2e-testing
pnpm install && pnpm run build && pnpm run test:e2e

# 4) Next E2E lane
cd /Users/dodo/workspace/projects/a2ui-chat-poc/1.A2UI-React-Shadcn/workspaces/nextjs-e2e-testing
pnpm install && pnpm run build && pnpm run test:e2e
```
