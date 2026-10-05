# Fukuoka 2026 Record Handoff

> 이 문서는 사이트 코드에 이미 표현된 일정/가격/매장 데이터를 복제하기 위한 문서가 아니다.
> 코드만 보고는 알기 어려운 사용자 의도, 의사결정 배경, 작업 규칙,
> 미확정 사항 및 향후 조사 시 주의사항을 Codex/Claude Code에 인계하기 위한 문서다.
> 프로젝트 전체의 목적과 범위는 `PROJECT_CONTEXT.md`를 먼저 확인한다.

---

## 1. Project Overview

- 여행지: 일본 후쿠오카
- 기간: 2026-09-18 ~ 2026-09-22 (4박 5일)
- 인원: 32세 전후 남성 2명
- 항공편 예약 완료
  - 9/18 FUK 13:40 도착
  - 9/22 FUK 19:40 출발
- 숙소 예약 완료
  - Atlas Apartment
  - 후쿠오카시 주오구 다이묘 1초메 1-9
  - 9/18 16:00 체크인
  - 9/22 10:00 체크아웃
  - 4박 총 ¥79,834 / 2인
- 여행 웹사이트를 여행 전 계획용 + 실제 여행 중 모바일 가이드로 사용한다.

상세 일정, 쇼핑 리스트, 가격, 예산 등 현재 데이터는
항상 repository의 최신 코드를 source of truth로 먼저 확인할 것.

---

## 2. User / Planning Style

사용자는 추상적인 추천보다 실제 여행에서 바로 실행할 수 있는 정보를 선호한다.

특히 다음을 중요하게 생각한다.

### Concrete over vague

"오전 히타 이동 → 관광 → 복귀" 같은 표현보다

- 몇 시 출발
- 어디에서 탑승
- 어느 노선
- 요금
- 예상 도착시간
- 놓쳤을 때 Plan B

까지 구체화하는 것을 선호한다.

특히 외곽 이동일인 히타와 미야지다케는 교통편이 일정 설계의 핵심이다.

### Do not invent precision

반대로 확인되지 않은 열차시간이나 행사시간을
그럴듯하게 확정해서 넣는 것은 금지한다.

예:

- 2026 미야지다케 추계대제 세부시간 미발표
- JR 열차는 당일 출발시각에 따라 Google Maps에서 최적편 확인 가능

이런 경우 사이트에서도 "미확정 / 최근 패턴 / 당일 확인"을 명확히 구분한다.

### Explain why

단순 추천뿐 아니라 왜 그 선택을 했는지 비교 근거를 중요하게 본다.

예:

- 숙소는 하카타보다 텐진권이 이번 일정에 유리
- 카메라는 일본 중고품보다 국내 보증품이 나을 수 있음
- 히타는 숙박보다 당일치기가 효율적
- 렌터카는 맥주 시음 때문에 히타 일정과 맞지 않음

새로운 결정을 내릴 때도 이런 맥락을 유지한다.

---

## 3. Website Product Philosophy

이 사이트는 단순 일정표가 아니다.

실제 일본 여행 중 스마트폰으로 열어보고

- 오늘 일정 확인
- 이동 방법 확인
- 가격 확인
- 매장 확인
- Plan B 확인

까지 할 수 있는 개인용 travel dashboard가 목표다.

따라서 "보기 좋은 사이트"보다
"여행 현장에서 빠르게 필요한 정보를 찾을 수 있는 사이트"가 우선이다.

---

## 4. UI / UX Preferences

### Primary devices

최우선:

- iPhone
- Galaxy

PC에서도 사용하지만 최종 배포 후 실제 여행 중에는 스마트폰 사용 비중이 높다.

Tablet 최적화는 우선순위가 낮다.

### Responsive philosophy

PC 화면을 단순 축소하지 않는다.

모바일에서는 필요하면:

- navigation horizontal scroll
- date tabs horizontal scroll
- table → cards
- 2-column timeline
- collapsible detail
- large touch targets

등 모바일에 맞는 별도 표현을 사용한다.

### Information density

사용자는 정보가 많다는 이유로 내용을 삭제하는 것을 원하지 않는다.

모바일에서 공간이 부족하면

"정보 삭제"가 아니라

"접기 / 카드화 / 탭 / 스크롤"

등으로 해결한다.

### Existing visual direction

현재 dark UI 방향을 선호한다.

전체 리뉴얼 시에도 특별한 이유 없이
밝은 관광청 스타일이나 과도하게 화려한 디자인으로 바꾸지 않는다.

### Interaction example

숙소 정보는 일정 본문에 항상 노출하는 것보다

상단의

`🏨 Atlas Apartment · 4박 ¥79,834`

태그를 클릭하면 상세정보가 아래에 펼쳐지는 방식이 사용자의 선호다.

즉 중요한 정보라도 항상 화면을 차지하게 하기보다
필요할 때 펼쳐보는 구조를 적극 활용한다.

---

## 5. Critical Content Rule

### NEVER regress existing information

이 프로젝트에서 이미 한 번 문제가 발생했다.

교통 정보를 상세화하는 과정에서 기존 쇼핑 섹션의

- 매장
- 구매 예정 품목
- 예상 가격
- 카메라 시세 사이트

정보가 축약되어 사용자가 강하게 문제를 제기했다.

따라서:

> 한 영역을 개선한다고 다른 영역의 기존 데이터를 삭제하거나 축약하지 않는다.

리팩터링 / responsive conversion / redesign을 할 때도 동일하다.

기존 콘텐츠 보존 여부를 반드시 확인한다.

---

## 6. Versioning

Semantic Versioning 형태로 관리한다.

`x.y.z`

예:

- 작은 정보 수정 / 데이터 추가 / 버그 수정 → patch
  - 1.4.0 → 1.4.1
- 새로운 UI 기능 / 의미 있는 기능 추가 → minor
  - 1.4.x → 1.5.0
- 사이트 구조나 디자인을 대대적으로 변경 → major
  - 1.x.x → 2.0.0

과거의 "Beta 1.3 고정" 규칙은 폐기됐다.

현재 repo의 실제 최신 버전을 확인한 뒤 다음 버전을 결정한다.

---

## 7. Trip Preferences / Exclusions

### Strong interests

- 후쿠오카성
- 히타
- 일본 맥주
- 온천
- 현지 음식
- 술
- 일본 위스키
- 쇼핑
- 빈티지 시계/카메라 구경
- 지역 축제

### Fukuoka Castle

후쿠오카성은 필수 방문지다.

2026년 여행 시점에는 천수대 발굴조사 때문에
`天守台`만 출입 제한이다.

이를 "후쿠오카성 폐쇄"라고 표현하면 안 된다.

후쿠오카성 유적 / 마이즈루공원은 관람 가능하다.

### Not interested / excluded

다음은 사용자가 현재 별로 관심 없어 하거나 명시적으로 제외했다.

- teamLab → 명시적으로 제외
- Momochi → 관심 낮음
- Fukuoka Tower → 관심 낮음

제외한 장소를 사이트에
"제외 장소" 같은 형태로 계속 노출하지 않는다.

그냥 콘텐츠에서 제거한다.

### Kushida Shrine

추천하지 않는다.

사용자가 역사적 맥락 때문에 방문을 원하지 않는다.

향후 "후쿠오카 대표 신사"라는 이유로 자동 추천하지 말 것.

---

## 8. Hita Planning Intent

히타는 이번 여행에서 가장 시간표 의존도가 높은 일정 중 하나다.

중요한 사용자 의도:

- 당일치기 선호
- 렌터카 사용하지 않음
- Sapporo Beer Hita에서 실제 맥주를 마실 계획
- 유료 brewery tour는 관심 없음
- 무료 자유견학 + tasting이 목적
- tasting salon에는 늦어도 15:30까지 들어가고 싶어함
- Yumesansui 온천은 아직 밝을 때 이용하고 싶어함
- Hita Mabushi Senya는 매우 높은 우선순위
- Hita yakisoba도 먹고 싶음

버스 시간은 일정의 anchor로 취급한다.

귀환편은 목표편 + backup편을 사이트에서 같이 보여주는 것이 좋다.

---

## 9. Miyajidake Intent

미야지다케 자체뿐 아니라
9/21 추계대제 경험이 핵심이다.

사용자가 특히 관심 있는 것은:

`お下り (Okudari)`

신을 모신 행렬이 내려오는 procession이다.

단순 제례인 `大祭始祭`보다
시각적으로 볼거리가 있는 Okudari에 더 관심이 있다.

2026년 정확한 행사 세부시간이 발표되지 않았다면
과거 2024/2025 패턴을 근거로 예상시간을 표시하되
절대 확정시간처럼 작성하지 않는다.

공식 일정 발표 후 업데이트 대상이다.

JR 하카타 → 후쿠마 이동은
특정 열차를 미리 강제로 고정할 필요가 없다.

당일 Google Maps에서 실제 출발시간 기준으로
JR 가고시마 본선의 적절한 일반/쾌속편을 선택하는 방식도 허용된다.

---

## 10. Last Day / Luggage

숙소는 체크아웃 이후 luggage storage를 제공하지 않는다.

따라서 Bounce 사용은 선택사항이 아니라 확정 일정이다.

- Bounce 앱 예약
- Tenjin Station North Exit 인근
- 짐 2개
- ¥1,700

9/22 10:00 체크아웃 직후 짐을 맡기고
후쿠오카성 / 오호리 / 마지막 쇼핑 일정으로 이동한다.

이 비용은 공용 여행경비다.

---

## 11. Shopping Philosophy

쇼핑 리스트는 단순 매장 목록으로 만들지 않는다.

가능하면 각 매장마다:

- 무엇을 살지
- 예상 가격
- 우선순위
- 재고형인지
- 가격 비교 기준

을 유지한다.

사용자는 "매장 이름만 나열된 쇼핑 섹션"을 원하지 않는다.

### Whisky

최소 2병 구매 의사가 강하다.

우선순위:

1. Hibiki Blender's Choice
2. Yamazaki 12
3. Johnnie Walker Blue Label

Japanese Harmony와 Blender's Choice를 혼동하지 않는다.

사용자가 원하는 Hibiki는
`Blender's Choice`다.

위스키는 LINXAS를 높은 우선순위로 보고
Yamaya / Champ de Vin 등과 가격 비교한다.

한국 입국 시 주류 면세한도도 고려해야 한다.

특히 700ml + 700ml + 750ml = 2.15L이므로
3병 구매 시 2L 한도를 넘을 수 있다는 점을 기억한다.

### Vintage digital camera

현재는 구매 우선순위가 낮아졌다.

이유:

일본에서 저렴한 매물은

- C rank
- junk
- 작동 보증 없음

등이 많고,
한국에서 약간 비싸더라도 일정 기간 보증되는 제품이
사용자에게 더 적합하다고 판단했다.

따라서 일본에서는 "구경" 중심.

좋은 조건일 때만 구매.

조건:

- SD / SDHC 선호
- xD-only 모델 피함
- 정상 작동 보장
- C rank / junk 지양
- 국내 가격 대비 충분히 저렴

사이트에는 중고 카메라 매장뿐 아니라
시장 가격을 확인할 수 있는 검색 링크를 유지한다.

예:

- Camera no Naniwa inventory
- Camera no Kitamura
- Kakaku
- Yahoo Auctions sold/closed price search

이 링크들은 과거 리팩터링 과정에서 빠져 문제가 됐으므로
삭제하지 않는다.

---

## 12. Food / Drinking Style

매일 술집 1차/2차/3차를 도는 여행은 아니다.

기본 패턴:

`저녁식사 + 술을 같은 식당에서 → 편의점 맥주/간식`

별도 2차 술집은 현재 9/21 하루 정도만 예산에 반영했다.

따라서 음식 예산을 계산할 때
매일 별도 술집 비용을 중복 계산하지 않는다.

텐진 야타이를 경험하고 싶어하며
나카스보다 텐진 야타이를 선호한다.

후쿠오카 시내 식사 후보 중
`설화(유키하나)`도 사용자가 관심을 보인 곳이다.

---

## 13. Budget Philosophy

### Common fund

현지 공용비와 개인 쇼핑을 분리한다.

사용자가 Toss 외화계좌에서 엔화를 관리하고
공용비를 전부 결제한 뒤 친구에게 절반을 원화로 받을 계획이다.

현재 공용자금 기준은 약:

`¥80,000 / 2인`

숙박 / 항공 / 개인 쇼핑은 별도.

### Shopping money

개인 쇼핑은 별도.

위스키 최소 2병 + KALDI/Don Quijote 소액 구매는
발생 가능성이 매우 높다.

옷 / mont-bell / 시계 / 카메라 등은
마음에 드는 상품이 있을 때만 산다.

### Exchange strategy

사용자는 Toss 외화계좌의 엔화 매수/매도 수수료가 0이라고 이해하고 있다.

따라서 과도하게 환전하기보다

- 필요한 만큼 먼저 환전
- 부족하면 추가
- 남으면 다시 원화 전환

하는 전략을 선호한다.

---

## 14. Research Rules

가격 / 영업시간 / 교통 / 행사정보는
가능하면 최신 공식 출처를 우선한다.

우선순위:

1. 공식 사이트
2. 운영회사 공식 시간표
3. 공식 매장
4. 신뢰 가능한 예약/교통 서비스
5. 블로그/커뮤니티는 실제 경험 참고용

특히 다음은 출발 직전 다시 조사할 가치가 높다.

- 미야지다케 2026 추계대제 정확한 시간
- JR / 버스 시간표
- 위스키 가격 및 재고
- 중고 카메라 재고
- 식당 휴무
- 임시 휴관
- 후쿠오카성 발굴조사 변경
- 날씨 / 태풍
- 지진 관련 교통 영향

---

## 15. Known Calendar Edge Case

9/21은 일본 공휴일 월요일이다.

오호리공원 일본정원은 일반적으로 월요일 휴원이며,
월요일이 공휴일이면 다음 날 휴원하는 규칙이 있다.

따라서 현재 일정상 9/22 화요일은
일본정원이 대체 휴원일일 가능성이 높다.

오호리공원 자체와 혼동하지 않는다.

- Ohori Park → 이용 가능
- Japanese Garden → 9/22 휴원 가능성 매우 높음

향후 공식 2026 운영 캘린더 확인 필요.

---

## 16. Avoid These Failure Modes

### 1. Do not silently delete content

리뉴얼하면서 기존 데이터를 요약하지 않는다.

### 2. Do not turn estimates into confirmed facts

예상 행사시간 / 예상 이동시간 / 예상가격은
확정값과 시각적으로 구분한다.

### 3. Do not over-plan flexible city days

히타처럼 교통편이 중요한 날은 상세하게.

반대로 텐진 쇼핑 같은 날은
분 단위 timetable로 과도하게 고정하지 않는다.

### 4. Do not recommend excluded attractions again

teamLab / Momochi / Fukuoka Tower / Kushida Shrine 등을
일반적인 관광 추천 알고리즘으로 다시 넣지 않는다.

### 5. Do not simplify shopping into store names

상품 + 가격 + 우선순위 + 비교 링크가 중요하다.

### 6. Do not break mobile layout when adding content

새로운 일정/카드 하나를 추가한 뒤
iPhone/Galaxy viewport에서 반드시 확인한다.

과거 Bounce 일정 삽입 시 DAY header 구조 안에
timeline item이 잘못 들어가 정렬이 깨진 사례가 있었다.

DOM 구조를 임의로 문자열 위치에 삽입하는 식의
취약한 수정은 피한다.

---

## 17. Recommended Architecture for Future Refactor

현재 single HTML prototype에서 GitHub 기반으로 옮길 경우
가능하면 콘텐츠와 UI를 분리한다.

Example:

jeongs-travel-log/
├── index.html
├── assets/
├── css/
│ └── app.css
├── js/
│ └── app.js
├── data/
│ ├── itinerary.json
│ ├── shopping.json
│ ├── budget.json
│ └── places.json
├── AGENTS.md
└── PROJECT_HANDOFF.md

특히 여행 데이터는 HTML에 직접 반복해서 박지 않는 것이 좋다.

이렇게 해야 Codex / Claude Code가
UI를 리뉴얼하면서 여행 데이터를 실수로 삭제할 위험을 줄일 수 있다.

---

## 18. Source of Truth Rule

충돌이 있을 경우 우선순위:

1. 사용자의 최신 직접 지시
2. 최신 repository data/code
3. 이 PROJECT_HANDOFF.md의 의사결정 맥락
4. 과거 조사자료

이 문서는 의도와 맥락을 설명하는 문서이며
시간표/가격 같은 변경 가능한 데이터를 영구적인 truth로 간주하지 않는다.

---

## 19. Working Relationship

사용자는 프론트엔드 개발자이며
구현 세부사항과 UI 문제를 직접 확인한다.

따라서 작업 결과에 대해
"적용했다"는 설명만 하는 것보다
실제 동작하는 결과물을 보여주는 것을 선호한다.

특히 UI 변경은:

`설명 → 승인 → 구현`

을 반복하기보다, 요구가 충분히 명확하면

`설계 → 실제 구현 → 사용자가 결과 확인 → 피드백`

방식이 더 잘 맞는다.

사용자가 "해봐", "반영해봐", "리뉴얼해봐"라고 하면
가능한 경우 실제 코드 변경까지 수행한다.

또한 사용자가 발견한 UI 문제를
단순히 설명하는 데 그치지 말고 실제 수정 결과를 제공한다.
