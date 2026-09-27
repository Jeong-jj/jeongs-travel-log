# Trip data model v1

여행 데이터는 화면 구현과 분리한다. 앱은 `public/data/trips.json`에서 여행 목록을 읽고, 선택한 여행의 `dataPath`에 있는 JSON을 불러와 렌더링한다.

## 설계 원칙

- `schemaVersion`으로 데이터 포맷의 변경을 추적한다.
- 모든 여행, 일정, 장소, 섹션, 비용, 출처에는 변경되지 않는 `id`를 사용한다.
- 날짜는 `YYYY-MM-DD`, 금액은 숫자와 ISO 4217 통화 코드를 분리한다.
- 일정의 계획과 실제 기록은 `plan`과 `record`로 나눠 원래 계획을 보존한다.
- 일정·장소·비용·출처는 도메인 데이터로 유지하고, 화면별 콘텐츠만 `sections` 블록으로 조합한다.
- 임의 HTML과 CSS는 JSON에 저장하지 않는다.

## 파일 구성

```text
public/data/
├── trips.json
└── trips/
    ├── fukuoka-2026.json
    └── another-trip.json
```

## 확장 규칙

새 화면 표현이 필요하면 기존 필드를 변형하지 않고 새로운 섹션 `type`과 렌더러를 추가한다. 기존 데이터와 호환되지 않는 변경은 `schemaVersion`을 올리고 마이그레이션 함수를 제공한다.

서버가 추가되더라도 컴포넌트가 직접 데이터 출처를 알지 않도록 `TripRepository` 인터페이스를 거친다. 정적 JSON 저장소는 첫 번째 구현체이며, 이후 API 저장소로 교체할 수 있다.
