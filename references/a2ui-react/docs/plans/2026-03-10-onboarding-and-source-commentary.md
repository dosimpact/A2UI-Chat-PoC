# Onboarding And Source Commentary Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add top-level architecture comments across `src` and write a top-down onboarding document for developers modifying this repository.

**Architecture:** Treat `src/0.8` as the runtime core, `src/components/ui` as the styling primitive layer, and document the repository from runtime flow down to file-level responsibilities. Keep code changes non-behavioral and optimize for developer navigation.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Radix UI, Tailwind utility classes

---

### Task 1: Capture the architecture in a plan artifact

**Files:**
- Create: `docs/plans/2026-03-10-onboarding-and-source-commentary.md`

**Step 1: Write the plan artifact**

Write this file with the agreed scope:
- Comment `src` from a developer-maintainer perspective
- Prioritize top-level architecture over API exhaustiveness
- Add onboarding documentation under `docs`

**Step 2: Verify the plan file exists**

Run: `test -f docs/plans/2026-03-10-onboarding-and-source-commentary.md`
Expected: command exits successfully

### Task 2: Add non-behavioral source commentary

**Files:**
- Modify: `src/index.ts`
- Modify: `src/lib/utils.ts`
- Modify: `src/components/ui/*.tsx`
- Modify: `src/0.8/**/*.ts`
- Modify: `src/0.8/**/*.tsx`

**Step 1: Add file-header comments to core runtime files**

Explain each file's role in the runtime:
- message ingestion
- context ownership
- component lookup
- binding and action dispatch
- concrete component families

**Step 2: Add file-header comments to UI primitive files**

Explain that these are reusable styling wrappers, not A2UI protocol logic.

**Step 3: Preserve behavior**

Do not change runtime logic, exports, or tests unless a formatting tool requires it.

### Task 3: Write the onboarding guide

**Files:**
- Create: `docs/onboarding.md`

**Step 1: Write the document top-down**

Cover:
- what this repository is
- how rendering works end-to-end
- how `src` is organized
- where to extend component behavior
- where to debug message/data/action flow
- how playground, website, and tests support the core library

**Step 2: Keep the document maintainer-focused**

Optimize for a developer who wants to change code safely, not just consume the package.

### Task 4: Verify the documentation pass

**Files:**
- Test: `src/**/*.ts`
- Test: `src/**/*.tsx`
- Test: `docs/onboarding.md`

**Step 1: Run tests**

Run: `npm test -- --runInBand`
Expected: tests pass or fail only for pre-existing issues unrelated to comments/docs

**Step 2: Review diffs**

Run: `git diff -- docs src`
Expected: only documentation or comment-only changes
