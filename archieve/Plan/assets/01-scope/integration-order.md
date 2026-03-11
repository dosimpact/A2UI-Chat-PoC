# CP1: Integration Order (Serial)

## 통합 순서
1. `web_core` / protocol 기준선 동기화
   - catalog/action/version 계약을 수용할 수 있는지 선검증
2. `renderers/react` 런타임 통합
   - 카탈로그 bootstrap, provider/wrapper, 안전한 fallback 동작 반영
3. 샘플/문서 계층 통합
   - React e2e, Next e2e, 샘플 plan 문서/README 업데이트
4. CP0~CP3 게이트 통과 후 CP4로 이동

## 1차 통합 검증
- 계약-구현 불일치 항목이 없는지 문서 기준으로 사전 체크
- 기본 시나리오가 샘플에서 최소 동작되는지 확인

## 통합 실패 대응
- 순서상 앞단이 실패하면 다음 단계로 진행하지 않으며, 실패 레벨에 따라 롤백 범위를 CP 범위 단위로 고정한다.
