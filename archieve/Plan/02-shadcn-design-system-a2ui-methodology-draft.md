# Plan Draft: Shadcn 기반 디자인 시스템 + A2UI 결합 방법론

## 0. 목표 정의

### 최종 목표
- A2UI 프로토콜을 통해 AI가 UI를 생성할 때,
  - 내부 디자인 시스템(브랜드 토큰/컴포넌트 규칙)을 강제하고
  - `shadcn/ui` 생태계 컴포넌트를 지속적으로 흡수/확장할 수 있는 체계를 만든다.

### 성공 기준
- A2UI 메시지로 생성된 화면이 디자인 시스템 규칙(토큰, 간격, 타이포, 상태)을 일관되게 준수한다.
- 신규 컴포넌트(예: shadcn 컴포넌트)를 반복적으로 추가해도 기존 UI와 시각/행동 일관성이 깨지지 않는다.
- AI 생성 결과를 자동 검증(스키마/정적 규칙/시각 회귀)해 품질을 유지한다.

---

## 1. 방법론 핵심 원칙

1. **Protocol First**
- A2UI 메시지 계약(컴포넌트 타입, props, data binding, action)을 먼저 안정화하고, 렌더러 구현은 그 위에서 교체 가능하게 유지한다.

2. **Design Token First**
- shadcn 컴포넌트를 직접 노출하지 않고, 반드시 내부 토큰/스타일 추상화 계층을 통해서만 노출한다.

3. **Catalog as Product API**
- A2UI Catalog를 내부 플랫폼 API로 간주한다.
- 컴포넌트 추가는 “코드 추가”가 아니라 “플랫폼 API 확장”으로 관리한다.

4. **AI Guardrails by Default**
- 모델 프롬프트만 믿지 않고, 스키마 검증 + 정책 검증 + 렌더링 테스트를 파이프라인에 강제한다.

---

## 2. 목표 아키텍처

### 2.1 계층 구조
1. **A2UI Protocol Layer**
- 메시지 타입, surface lifecycle, data model update 규칙.

2. **Catalog Contract Layer**
- `Button`, `Card`, `Input` 등 A2UI 컴포넌트 계약(허용 props, 이벤트, 접근성 제약).

3. **Design System Layer**
- 토큰(색/타입/스페이싱/라디우스/모션), variant 정책, 상태별 스타일 규칙.

4. **Renderer Adapter Layer (React)**
- A2UI 컴포넌트 타입 → 내부 DS 컴포넌트 → shadcn primitive 조합.

5. **AI Generation Layer**
- 모델 입력: 카탈로그 스키마 + 제약 + 예시.
- 모델 출력: A2UI JSON.

### 2.2 핵심 결정
- shadcn은 “직접 사용 대상”이 아니라 “구현 재료”로 제한한다.
- 외부/내부 팀에는 내부 A2UI Catalog만 노출한다(Stable API).

---

## 3. 실행 단계 (초안)

## Phase 1: Baseline 고정 (1-2주)

### 작업
- 기준 브랜치/코드베이스 선택:
  - 프로토콜/스키마 기준: `A2UI-Original`
  - React 렌더러 구현 기준: `A2UI-add-react-renderer`
- 통합 기준 문서화:
  - 현재 지원 컴포넌트 목록
  - 미지원/불완전 항목
  - 버전 정책(v0.8 유지, v0.9+ 준비 전략)

### 산출물
- `catalog-baseline.md`
- `component-support-matrix.md`

---

## Phase 2: Design Token System 구축 (1-2주)

### 작업
- 토큰 스키마 정의:
  - color, typography, radius, spacing, shadow, motion
- 토큰 소스 일원화:
  - CSS variables + TypeScript token map
- theme contract 작성:
  - A2UI `theme` 필드와 내부 토큰 매핑 규칙 정의

### 산출물
- `tokens.json` (또는 등가 포맷)
- `theme-mapping.md`
- `token-governance.md`

---

## Phase 3: A2UI Catalog v1 (DS 래핑) (2-3주)

### 작업
- 표준 컴포넌트부터 DS 래퍼로 재정의:
  - Button, Input(TextField), Checkbox, Card, Tabs, Modal, List, Text
- 각 컴포넌트 계약 정의:
  - 허용 props, default, 금지 props, action payload 규칙
- 이벤트/데이터 바인딩 규칙 통일:
  - path binding, literal fallback, form interaction 표준

### 산출물
- `catalog-v1.schema.json`
- `catalog-v1-guidelines.md`
- React renderer adapter v1

---

## Phase 4: shadcn 지속 온보딩 파이프라인 (지속)

### 작업
- 신규 컴포넌트 온보딩 템플릿 운영:
  1. 후보 선정(사용성/복잡도/접근성 점수)
  2. DS variant 설계
  3. A2UI 계약 정의
  4. Renderer adapter 구현
  5. 테스트(단위/통합/시각)
  6. Prompt example 추가
- 우선순위 후보:
  - Select, Popover, Dialog 확장, Table, Command, Calendar

### 산출물
- `component-onboarding-template.md`
- `onboarding-checklist.md`
- `catalog-changelog.md`

---

## Phase 5: AI 생성 품질 체계 구축 (2주+)

### 작업
- 프롬프트 계층 분리:
  - System(절대 규칙), Task(화면 목적), Catalog examples
- 자동 검증 파이프라인:
  - JSON schema validation
  - 정책 lint(금지 패턴/과도한 depth/비허용 컴포넌트)
  - snapshot + visual regression
- 실패 처리 규칙:
  - 자동 수정(repair) 우선
  - 실패 시 fallback UI 정책

### 산출물
- `a2ui-generation-guardrails.md`
- `validation-ruleset.md`
- CI gate 정의 문서

---

## 4. shadcn 확장 전략 (핵심 방법론)

## 4.1 1:1 매핑 금지, 의미 기반 매핑
- 예: shadcn `button`의 모든 variant를 즉시 노출하지 않는다.
- 먼저 A2UI 의미 타입(`Button`)을 정의하고, 내부에서 DS variant로 매핑한다.

## 4.2 컴포넌트 성숙도 단계
1. **Experimental**
- 내부에서만 사용, API 변경 허용.
2. **Beta**
- AI 생성 허용, 변경 시 마이그레이션 공지 필요.
3. **Stable**
- 하위 호환 유지, breaking change는 새 타입/버전으로 분리.

## 4.3 Catalog Versioning 규칙
- `catalogId`에 버전 명시(`.../catalog/v1`, `.../catalog/v2`).
- breaking change는 기존 필드 수정 대신 새 필드/새 컴포넌트 타입으로 확장.

---

## 5. 품질 보증 전략

### 5.1 테스트 피라미드
1. Unit
- resolver, binding, action payload, variant mapping
2. Integration
- surface lifecycle + data updates + user actions
3. Visual Parity / Snapshot
- 주요 컴포넌트/테마별 회귀
4. Scenario E2E
- 실제 에이전트 응답 스트림 기반 회귀

### 5.2 품질 게이트 (CI)
- schema validation 100% 통과
- lint rule 위반 0
- 핵심 컴포넌트 시각 회귀 임계치 이내
- 신규 컴포넌트는 문서/예시/테스트 없으면 merge 금지

---

## 6. 운영 모델

### 6.1 역할 분리
- **Protocol Owner**: 메시지/스키마 계약
- **Design System Owner**: 토큰/variant/브랜드 규칙
- **Renderer Owner**: React adapter/성능/접근성
- **AI Quality Owner**: 프롬프트/검증/리페어 파이프라인

### 6.2 변경 관리
- 컴포넌트 추가 RFC 경량 템플릿 운영(목표, API, 리스크, 테스트 계획)
- 월 1회 카탈로그 정리(폐기 후보, 실사용률, 실패율)

---

## 7. 리스크와 대응

1. **리스크: A2UI 버전 혼재(v0.8/v0.9+)**
- 대응: 단기 v0.8 고정 + v0.9 호환 어댑터 별도 트랙 운영

2. **리스크: shadcn 업데이트에 따른 스타일 불안정**
- 대응: 직접 종속 최소화, DS 래퍼 API 고정

3. **리스크: AI 출력 변동성**
- 대응: 생성 후 검증 + 자동 repair + fallback UI

4. **리스크: 컴포넌트 수 증가로 관리 비용 상승**
- 대응: 성숙도 단계/온보딩 템플릿/분기별 정리 규칙 강제

---

## 8. 초기 실행 백로그 (우선순위)

1. Baseline 통합 기준 확정(원본 스펙 + React 구현)
2. 토큰 체계 및 theme mapping 문서화
3. Catalog v1 최소 집합(Button/Input/Card/Text/List) 안정화
4. Onboarding 템플릿/체크리스트 확정
5. Validation + Visual regression CI 게이트 연결
6. Select/Popover/Table 온보딩 1차

---

## 9. 이 초안의 기본 가정
- React renderer를 주력 구현으로 사용한다.
- shadcn은 내부 DS 구현 레이어에서 활용하고, 외부 API는 A2UI Catalog로 고정한다.
- 단기적으로는 v0.8 기반 안정화가 빠르고, 중장기적으로 v0.9/v0.10 호환을 준비한다.
