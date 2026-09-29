# Trip Archive 2.0

React 19 + TypeScript + Vite로 만든 모바일 우선 정적 여행 아카이브입니다. 서버 없이 여행별 JSON을 읽으며, 현재 후쿠오카 2026 기록을 첫 데이터로 제공합니다.

## 실행

```bash
pnpm install
pnpm dev
```

`main` 브랜치에 푸시하면 GitHub Actions가 빌드 후 GitHub Pages에 배포합니다.

## 데이터 구조

```text
public/data/
├── trips.json                  # 여행 목록과 기본 여행
└── trips/
    └── fukuoka-2026.json       # 여행 한 건의 전체 데이터
```

`src/types/trip.ts`는 앱에서 사용하는 타입, `schemas/`는 빌드 시 검사하는 JSON Schema입니다. 상세 설계와 확장 규칙은 [데이터 모델 문서](docs/data-model.md)를 참고합니다.

## 새 여행 추가

1. `public/data/trips/<trip-id>.json`을 만들고 `schemaVersion: 1` 형식으로 내용을 작성합니다.
2. `public/data/trips.json`의 `trips`에 같은 ID와 파일 경로를 등록합니다.
3. `pnpm validate:data`로 스키마와 참조 무결성을 확인합니다.
4. `pnpm build`로 타입 검사와 프로덕션 빌드를 확인합니다.

여행이 두 개 이상 등록되면 화면 상단에 여행 선택기가 자동으로 나타납니다. `#/trip/<trip-id>` 주소로 특정 기록을 바로 열 수도 있습니다.

일정은 원래 계획을 `plan`, 실제 방문 결과를 `record`에 나눠 기록합니다. 장소·출처·비용은 안정적인 ID로 연결하므로 화면 구성이 바뀌어도 기록을 재사용할 수 있습니다.

## 품질 검사

```bash
pnpm validate:data
pnpm lint:app
pnpm build
```

런타임 여행 JSON은 온라인에서 최신 파일을 먼저 가져오고, 연결에 실패하면 PWA 캐시를 사용합니다.

## 모바일 앱 설치

- iPhone Safari: 공유 → 홈 화면에 추가
- Android Chrome: 메뉴 → 앱 설치 또는 홈 화면에 추가
- 설치 후 독립 실행 화면과 마지막으로 열어 본 화면의 오프라인 표시 지원

## 반응형 기준

- iPhone / Galaxy 375~430px 우선
- 메인 탭과 날짜 탭 가로 스와이프
- 일정 시간+내용 2열 유지
- 쇼핑·예산 표 모바일 카드 변환
- 44px 이상 터치 영역과 iOS safe-area 지원
- 데스크톱에서는 1080px 고밀도 레이아웃 유지
