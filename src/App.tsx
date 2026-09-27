import { useState } from 'react';
import {
  BedDouble,
  ChevronDown,
  ExternalLink,
  MapPin,
  MapPinned,
  Plane,
  WalletCards,
} from 'lucide-react';

const tabs = ['일정', '관광', '교통', '먹거리', '쇼핑', '예산'] as const;
type Tab = (typeof tabs)[number];
type CardLink = [label: string, href: string];
type CardRow = [title: string, description: string, links?: CardLink[]];
type FoodPlace = { name: string; href: string; note?: string };
type FoodGroup = { menu: string; places: FoodPlace[] };
type FoodRegion = { region: string; groups: FoodGroup[] };
type ShoppingSection = '쇼핑리스트' | '할인 쿠폰 정보';
type BenefitView = 'store' | 'payment';
type ShoppingBenefit = {
  store: string;
  payment: string;
  minimum: string;
  discount: string;
  deadline: string;
  href: string;
  note?: string;
};

const days = [
  {
    date: '9/18 금',
    title: 'DAY 1 · 텐진 / 다이묘',
    state: '쇼핑 + 야타이',
    items: [
      [
        '13:40',
        '후쿠오카 공항 도착',
        '입국 수속 → 지하철 → Atlas Apartment 이동',
      ],
      [
        '16:00',
        'Atlas Apartment 체크인',
        '짐 정리 후 텐진·미나텐진·다이묘 도보권 이동',
      ],
      [
        '16:30 ~',
        '텐진 · 미나텐진 · 다이묘 쇼핑',
        'Standard Products, GU, BOOK OFF, 몽벨, 주류·카메라 매장',
      ],
      [
        '저녁',
        '저녁 자유 슬롯',
        '먹거리 후보에서 당일 동선 · 대기시간 · 컨디션에 맞춰 선택',
      ],
    ],
  },
  {
    date: '9/19 토',
    title: 'DAY 2 · 후쿠오카성 / 오호리',
    state: '회복 + 시내',
    items: [
      [
        '늦은 오전',
        '여유 있게 하루 시작',
        '전날 이동 피로를 풀고 숙소 주변에서 브런치',
      ],
      ['오후', '후쿠오카성터', '마이즈루공원과 성터를 천천히 산책'],
      ['오후', '오호리공원', '호수 산책 · 카페 · 휴식'],
      [
        '저녁',
        '저녁 자유 슬롯',
        '먹거리 후보에서 당일 동선 · 대기시간 · 컨디션에 맞춰 선택',
      ],
    ],
  },
  {
    date: '9/20 일',
    title: 'DAY 3 · 히타',
    state: '핵심 원정',
    items: [
      [
        '09:00',
        '니시테츠 텐진 고속버스터미널',
        '예약 불필요 좌석정원제 · 연휴이므로 일찍 줄서기',
      ],
      [
        '09:27',
        '텐진 → 히타',
        '고속버스 히타호 · 11:00 전후 도착 · 왕복 ¥3,580/인',
      ],
      [
        '점심',
        '히타마부시 센야',
        '10:30~16:30 · LO 15:30 · 2명 예약 불가, 현장 번호표',
      ],
      [
        '오후',
        '삿포로 맥주공장',
        '일요일 정상 영업 · 무료 자유견학 + 유료 테이스팅 · 주문 마감 16:00',
      ],
      [
        '15:20 ~',
        '琴ひら温泉 유메산스이',
        '일요일 11:00~21:00 · 최종접수 20:30 · 성인 ¥800 · 밝을 때 계곡 노천탕',
      ],
      [
        '17:00 ~',
        '저녁 자유 슬롯',
        '히타 또는 후쿠오카 복귀 후 먹거리 후보 중 유동적으로 선택',
      ],
      [
        '18:20',
        '히타 → 텐진 목표편',
        '19:50 도착 예상 · 놓치면 19:00 → 20:30 백업 막차',
      ],
      [
        '비상',
        '택시 플랜 B',
        '히타→후쿠오카 약 ¥20,000~25,000+ · 고속도로비 별도 가능',
      ],
    ],
  },
  {
    date: '9/21 월',
    title: 'DAY 4 · 미야지다케',
    state: '축제 + 2차',
    items: [
      [
        '09:30 ~ 09:45',
        '하카타역 출발 목표',
        'JR 가고시마 본선 일반/쾌속 · 하카타→후쿠마 약 25분',
        'https://m.blog.naver.com/yunni_gongbang/224406531097',
        '미야지다케 가는 법',
      ],
      [
        '10:10 ~ 10:20',
        '후쿠마역 도착',
        '버스/택시 약 5분 · 도보 약 25분 · 버스 편도 약 ¥210',
      ],
      [
        '10:30 ~ 10:45',
        '미야지다케 신사 도착',
        '참배 후 11:15 전에 제1주차장 특설회장·오모테산도 주변 관람 위치 확보',
      ],
      [
        '12:00',
        '추계대제 어신행렬 오쿠다리',
        '미야지다케 신사→미야지하마 약 2km · 2026.09.18 공식 발표 기준',
        'https://www.miyajidake.or.jp/news/topics/%E7%A7%8B%E5%AD%A3%E5%A4%A7%E7%A5%AD%E8%A1%8C%E4%BA%8B%E6%97%A5%E7%A8%8B',
        '2026 추계대제 공식 일정',
      ],
      [
        '복귀',
        '후쿠마 → 하카타',
        '출발 직전 Google Maps로 실시간 최적 경로 재검색',
      ],
      [
        '저녁',
        '저녁 자유 슬롯',
        '먹거리 후보에서 당일 동선 · 대기시간 · 컨디션에 맞춰 선택',
      ],
    ],
  },
  {
    date: '9/22 화',
    title: 'DAY 5 · 다자이후',
    state: '역사 + 귀국',
    items: [
      [
        '10:00',
        '체크아웃 → Bounce 짐 보관',
        '텐진역 인근 Tenjin Station North Exit · 앱 예약 · 짐 2개 ¥1,700',
      ],
      [
        '10:30 전후',
        '니시테츠 후쿠오카(텐진)역 출발',
        '짐 없이 니시테츠 전철로 다자이후 이동',
      ],
      [
        '11:30 ~ 14:00',
        '다자이후 텐만구',
        '참배 · 산도 산책 · 점심 · 우메가에모치',
      ],
      [
        '14:30',
        '다자이후 출발',
        '출국 여유를 위해 늦어도 14:30에는 텐진으로 복귀',
      ],
      [
        '15:30 전후',
        '텐진 도착 → 짐 회수',
        'Bounce에서 짐을 찾고 공항으로 이동',
      ],
      [
        '16:00 ~ 16:30',
        '후쿠오카 공항 도착 목표',
        '국제선 수속 시간을 넉넉하게 확보',
      ],
      ['19:40', '후쿠오카 출발', '여유 있게 공항 도착'],
    ],
  },
];

const sights: CardRow[] = [
  [
    '히타',
    '마메다마치 · 히타마부시 · 삿포로 맥주공장 · 유메산스이 · 히타 야키소바를 하루에 연결',
  ],
  [
    '다자이후 텐만구',
    '니시테츠 텐진 출발. 참배와 산도, 우메가에모치까지 묶는 반나절',
  ],
  [
    '미야지다케 신사',
    '9/21 공휴일·축제일. 12:00 추계대제 어신행렬 오쿠다리 관람',
  ],
  [
    '후쿠오카성터 + 오호리공원',
    '도착 다음 날 늦게 시작해 여행 피로를 풀며 걷는 시내 산책 코스',
  ],
];

const transport: CardRow[] = [
  [
    '버스 승차법 · 현금/교통계 IC',
    '앞·옆면 행선지 확인 → 승차구에서 현금은 정리권을 뽑고, nimoca·SUGOCA·Suica 등 교통계 IC는 터치 → 내릴 정류장 안내 후 벨 → 앞문에서 현금은 정리권+정확한 운임, IC는 다시 터치하고 하차. IC는 정리권을 뽑지 않는다.',
    [
      [
        '니시테츠 공식 승·하차 안내',
        'https://www.nishitetsu.jp/bus/norikata/norikata/',
      ],
      ['nimoca 버스 이용법', 'https://www.nimoca.jp/use/bus'],
    ],
  ],
  [
    '해외카드 컨택리스 · 버스',
    '일반 니시테츠 노선버스 전체가 대상은 아니었다. 여행 당시 가능 노선은 하카타역↔후쿠오카공항 국제선, Fukuoka BRT, 다자이후 라이너버스 타비토(旅人), 후쿠오카↔구마모토 히노쿠니호. 승차·하차 모두 같은 카드/휴대폰을 터치한다.',
    [
      [
        '니시테츠 터치결제 대상 노선',
        'https://nishitetsu.jp/bus/norikata/tap-to-ride/',
      ],
    ],
  ],
  [
    '후쿠오카시 지하철',
    '공항선·하코자키선·나나쿠마선 36개 전 역에서 해외카드·Apple Pay·Google Pay 터치 가능. 같은 카드 번호와 같은 매체로 타면 1일 상한 ¥640. 카드 실물과 Apple Pay는 서로 다른 매체로 계산되며, JR 치쿠히선 직통 구간은 제외.',
    [
      [
        '후쿠오카시 지하철 공식 안내',
        'https://subway.city.fukuoka.lg.jp/topics/detail.php?id=1895',
      ],
    ],
  ],
  [
    '니시테츠 전철',
    '텐진오무타선·다자이후선·아마기선·카이즈카선 전 역에서 해외카드 터치 가능. 다만 다자이후역 동쪽 출구 등 일부 부출입구는 단말기가 없으므로 중앙 출구를 이용. 1카드·1명 성인 보통운임만 가능.',
    [
      [
        '니시테츠 전철 공식 터치결제 안내',
        'https://www.nishitetsu.jp/train/kippu/tattikessai/',
      ],
    ],
  ],
  [
    'JR 규슈 · 후쿠오카 권역',
    '2026.09.18 기준 92개 역: 가고시마본선 모지코↔구루메, 후쿠호쿠유타카선 오리오↔하카타, 카시이선 사이토자키↔우미, 와카마츠선 와카마츠↔오리오. 하카타↔후쿠마도 포함. 신칸센·신칸센 환승 개찰구는 제외하고 승차·하차 시 같은 매체를 사용.',
    [
      [
        'JR 규슈 공식 터치결제 안내',
        'https://www.jrkyushu.co.jp/railway/touch/',
      ],
      [
        '2026.09.18 대상 92개 역 발표',
        'https://www.jrkyushu.co.jp/railway/touch/pdf/news260908_1.pdf',
      ],
    ],
  ],
  [
    '히타',
    '니시테츠 텐진 고속BT → 히타BT. 예약 없는 좌석정원제라 승차장에 줄을 서고, 승차 시 교통계 IC를 터치한 뒤 히타에서 다시 터치해 정산. 해외 신용카드 컨택리스 대상 노선은 아니었으므로 nimoca·SUGOCA·Suica 등 교통계 IC, 현금 또는 승차권을 사용.',
    [
      [
        '히타호 공식 운임·승차권',
        'https://nishitetsu.jp/bus/highwaybus/rosen/hita/',
      ],
      ['nimoca 이용 가능 범위', 'https://www.nimoca.jp/area'],
    ],
  ],
  [
    '유메산스이 시내 이동',
    '히타역·BT에서 차로 약 10분. ひたはしり号 B코스 또는 택시를 일정에 맞춰 사용.',
  ],
  [
    '다자이후',
    '니시테츠 후쿠오카(텐진)역 → 다자이후역. 당일 출발 시각에 맞춰 환승 확인.',
  ],
  [
    '미야지다케',
    '하카타 → JR 가고시마본선 → 후쿠마는 해외카드·Apple Pay·Google Pay 터치 가능. 후쿠마역↔미야지다케 노선버스는 일반 해외카드 컨택리스가 아니므로 교통계 IC 또는 현금을 사용. JR 운임은 지하철 ¥640 상한과 별개.',
  ],
  [
    'Bounce',
    '체크아웃 직후 텐진역 북쪽 출구 인근 보관소. 앱 사전예약, 짐 2개 ¥1,700.',
  ],
];

const foodRegions: FoodRegion[] = [
  {
    region: '후쿠오카 시내',
    groups: [
      {
        menu: '라멘',
        places: [
          {
            name: '후톤 라멘',
            href: 'https://www.google.com/maps/search/?api=1&query=후톤+라멘+후쿠오카',
          },
        ],
      },
      {
        menu: '야타이',
        places: [
          {
            name: '텐진 야타이',
            href: 'https://maps.app.goo.gl/Tmv7Fg5UMtbcmsC57?g_st=ic',
            note: '첫날 저녁 + 술',
          },
        ],
      },
      {
        menu: '야키니쿠',
        places: [
          {
            name: '시치린야',
            href: 'https://maps.app.goo.gl/suXqMW8KbTK43iQ88?g_st=ic',
            note: '하루요시 1초메',
          },
          {
            name: '야키니쿠 아카탄',
            href: 'https://maps.app.goo.gl/qk9cCrRjVgYUAMMw9?g_st=ic',
          },
        ],
      },
      {
        menu: '사시미',
        places: [
          {
            name: '설화(유키하나)',
            href: 'https://maps.app.goo.gl/QthTzh2mijSMqVjr8?g_st=ic',
            note: '1순위 · 하루요시 3초메',
          },
          {
            name: '카츠카이슈',
            href: 'https://maps.app.goo.gl/2vRRJpxDYw7cQm2CA?g_st=ic',
          },
          {
            name: '카와타로 나카스본점',
            href: 'https://maps.app.goo.gl/oU4q53zfhJHz5j3z8?g_st=ic',
            note: '오징어회',
          },
        ],
      },
      {
        menu: '오뎅바',
        places: [
          {
            name: '나다이오뎅 야스베',
            href: 'https://maps.app.goo.gl/tUSkHgRwiMJo4mBcA?g_st=ic',
            note: '니시나카스',
          },
          {
            name: '하츠유키',
            href: 'https://maps.app.goo.gl/pP8XNsdgj8DSPv1A9?g_st=ic',
            note: '다이묘',
          },
        ],
      },
      {
        menu: '야키토리',
        places: [
          {
            name: '야키토리 마코토짱',
            href: 'https://maps.app.goo.gl/4Ss65Pa6uev2hGsx7?g_st=ic',
          },
          {
            name: '스미게키죠 무사시자',
            href: 'https://maps.app.goo.gl/55bCDDnmXBCFGSgy7?g_st=ic',
            note: '원시구이',
          },
          {
            name: '토리카와 야키토리 미츠마스 텐진점',
            href: 'https://maps.app.goo.gl/YEj6pUBptz5kUtqZ8?g_st=ic',
          },
        ],
      },
    ],
  },
  {
    region: '다자이후',
    groups: [
      {
        menu: '명란 와규 덮밥',
        places: [
          {
            name: '와규 멘타이코 카구라',
            href: 'https://maps.app.goo.gl/mqF8uZv2V5J5JWdR9?g_st=ic',
          },
        ],
      },
      {
        menu: '우메가에모치',
        places: [
          {
            name: '카사노야',
            href: 'https://maps.app.goo.gl/frUyhafmzRjgXquV7?g_st=ic',
            note: '다자이후 산도 간식',
          },
        ],
      },
    ],
  },
  {
    region: '히타',
    groups: [
      {
        menu: '장어',
        places: [
          {
            name: '히타마부시 센야',
            href: 'https://maps.app.goo.gl/AHVgqwTQUHCppUom6?g_st=ic',
            note: '1순위 · 2명 예약 불가',
          },
          {
            name: '이타야 본가(いた屋本家)',
            href: 'https://maps.app.goo.gl/k6qsSCp5Lnc7Ki4d8',
            note: '센야 플랜 B · 예약 가능',
          },
          {
            name: '우나기 로테이(うなぎ 鷺邸)',
            href: 'https://maps.app.goo.gl/JW3262CVK4dGuVpLA',
            note: '강을 보는 고택 분위기',
          },
        ],
      },
      {
        menu: '히타 야키소바',
        places: [
          {
            name: '소노다',
            href: 'https://maps.app.goo.gl/c7R72chbgJNuMpQa9?g_st=ic',
          },
          {
            name: '다이가쿠켄',
            href: 'https://maps.app.goo.gl/aj23Nj4beiYB5FLZ9?g_st=ic',
          },
          {
            name: '야키소바 쿠라게(焼きそば くらげ)',
            href: 'https://maps.app.goo.gl/aAzKUKx1yKcnsQQMA?g_st=ic',
            note: '포장 전용',
          },
        ],
      },
      {
        menu: '맥주',
        places: [
          {
            name: '삿포로 맥주공장 테이스팅 살롱',
            href: 'https://www.google.com/maps/search/?api=1&query=Sapporo+Beer+Kyushu+Hita+Brewery',
            note: '주문 마감 16:00 · 흑라벨/에비스 각 ¥450',
          },
        ],
      },
    ],
  },
];

const shops = [
  [
    'Standard Products',
    '보냉백 · 여행용품 · 에코백 · 러기지 스트랩',
    '필요품 우선',
  ],
  ['GU', '의류 · 이너 · 가벼운 여행복', '사이즈와 면세 확인'],
  ['BOOK OFF', '중고 의류 · 잡화 · 취미품', '상태 대비 가격 비교'],
  ['몽벨', '아웃도어 의류 · 소형 여행 장비', '국내가와 비교'],
  ['빅카메라', '전자제품 · 카메라 액세서리', '쿠폰·면세·보증 조건 확인'],
  ['LINXAS', '위스키 시세 조사와 실물 확인', '목표가보다 높으면 보류'],
  ['야마야', '대중적인 주류와 안주', '면세·수하물 한도 확인'],
  ['Champ de Vin', '와인·위스키 탐색', '희소품 위주'],
  [
    'HIGHTIME',
    '위스키 전문 탐색',
    '히비키 Blender’s Choice · 야마자키 12 · 조니워커 블루 목표가 비교',
  ],
  ['카메라의 나니와', '중고 카메라 · 렌즈', '하카타 마루이점 매장 재고 확인'],
  ['카메라의 키타무라', '중고 카메라 · 렌즈', '온라인 중고가와 현장 상태 비교'],
  [
    'Takachiho / 타카치호 텐진',
    '중고 카메라 구경',
    '후순위 · 나니와 매장별 재고와 함께 확인',
  ],
];
const shopLinks = [
  ['Naniwa 중고재고', 'https://www.cameranonaniwa.co.jp/'],
  ['Kitamura 중고', 'https://shop.kitamura.jp/'],
  ['가격.com 카메라 시세', 'https://kakaku.com/camera/'],
  [
    'Yahoo! 옥션 낙찰시세',
    'https://auctions.yahoo.co.jp/closedsearch/closedsearch',
  ],
];
const shoppingBenefits: ShoppingBenefit[] = [
  {
    store: '돈키호테',
    payment: '카카오페이',
    minimum: '¥15,000',
    discount: '¥1,000 즉시 할인',
    deadline: '2026.10.31',
    href: 'https://gauntlet.kakaopay.com/promotion/Gc3aa5288486d493d813',
    note: '카카오페이머니 · 기간 내 1회 · 일부 점포 제외',
  },
  {
    store: '빅카메라',
    payment: '카카오페이',
    minimum: '¥15,000',
    discount: '¥2,000 즉시 할인',
    deadline: '2026.10.31',
    href: 'https://gauntlet.kakaopay.com/promotion/G32d7d8e3658d426a9af',
    note: '카카오페이머니 · 기간 내 1회 · 일일 선착순',
  },
  {
    store: '후쿠오카 PARCO',
    payment: '카카오페이',
    minimum: '¥10,000',
    discount: '¥1,200 즉시 할인',
    deadline: '2026.09.30',
    href: 'https://gauntlet.kakaopay.com/promotion/G5b22a853751944e08be',
    note: '후쿠오카·삿포로·나고야점 · 기간 내 1회',
  },
  {
    store: 'GU',
    payment: '카카오페이',
    minimum: '¥5,000',
    discount: '¥600 즉시 할인',
    deadline: '2026.10.11',
    href: 'https://gauntlet.kakaopay.com/promotion/Ge18a7a9c7ca843e8bd7',
    note: '카카오페이머니 · 기간 내 1회 · 일일 선착순',
  },
  {
    store: 'PayPay 가맹점',
    payment: '네이버페이',
    minimum: '제한 없음',
    discount: '10% · 1회 최대 ¥500',
    deadline: '2026.09.30',
    href: 'https://blog.naver.com/nv_npay/224332038195',
    note: '매장 PayPay QR 촬영 · 월 5회 · 일별 선착순',
  },
  {
    store: '돈키호테',
    payment: '네이버페이',
    minimum: '¥15,000',
    discount: '¥1,500 즉시 할인',
    deadline: '2026.09.30',
    href: 'https://blog.naver.com/nv_npay/224332099219',
    note: 'Alipay+ 해외QR · 가맹점별 5회 · 선착순',
  },
  {
    store: '빅카메라',
    payment: '네이버페이',
    minimum: '¥15,000',
    discount: '¥1,500 즉시 할인',
    deadline: '2026.09.30',
    href: 'https://blog.naver.com/nv_npay/224332099219',
    note: 'Alipay+ 해외QR · 가맹점별 5회 · 선착순',
  },
  {
    store: '후쿠오카 PARCO',
    payment: '네이버페이',
    minimum: '¥10,000',
    discount: '¥1,000 즉시 할인',
    deadline: '2026.09.30',
    href: 'https://blog.naver.com/nv_npay/224332078740',
    note: 'Alipay+ 해외QR · 가맹점별 5회 · 선착순',
  },
  {
    store: 'GU',
    payment: '네이버페이',
    minimum: '¥5,000',
    discount: '¥500 즉시 할인',
    deadline: '2026.09.30',
    href: 'https://blog.naver.com/nv_npay/224332078740',
    note: 'Alipay+ 해외QR · 가맹점별 5회 · 선착순',
  },
  {
    store: '솔라리아 플라자',
    payment: '네이버페이',
    minimum: '¥10,000',
    discount: '¥1,000 즉시 할인',
    deadline: '2026.09.30',
    href: 'https://blog.naver.com/nv_npay/224332078740',
    note: 'Alipay+ 해외QR · 선착순',
  },
  {
    store: '솔라리아 스테이지',
    payment: '네이버페이',
    minimum: '¥5,000',
    discount: '¥500 즉시 할인',
    deadline: '2026.09.30',
    href: 'https://blog.naver.com/nv_npay/224332078740',
    note: 'Alipay+ 해외QR · 선착순',
  },
  {
    store: '후쿠오카공항 대상 매장',
    payment: '네이버페이',
    minimum: '¥10,000',
    discount: '¥1,000 즉시 할인',
    deadline: '2026.09.30',
    href: 'https://blog.naver.com/nv_npay/224332107150',
    note: 'Alipay+ 해외QR · 일부 매장 제외 · 선착순',
  },
  {
    store: '돈키호테',
    payment: '매장 쿠폰',
    minimum: '세전 ¥10,000',
    discount: '면세 + 최대 5%',
    deadline: '종료일 미표기',
    href: 'https://livejapan.com/public/operation/coupon/donki/ko.html',
    note: '실시간 바코드 필수 · 스크린샷 불가 · 주류 등 제외',
  },
  {
    store: '돈키호테',
    payment: '매장 쿠폰',
    minimum: '세전 ¥30,000',
    discount: '면세 + 최대 7%',
    deadline: '종료일 미표기',
    href: 'https://livejapan.com/public/operation/coupon/donki/ko.html',
    note: '다른 할인과 중복 불가 · 주류·Apple 등 제외',
  },
  {
    store: '빅카메라',
    payment: '매장 쿠폰',
    minimum: '세전 ¥5,000',
    discount: '면세 + 3~7%',
    deadline: '2026.10.31',
    href: 'https://livejapan.com/public/operation/coupon/biccamera/en.html',
    note: '가전·카메라 7% / 화장품 5% / 일본주 일부 3%',
  },
  {
    store: '이와타야·후쿠오카 미츠코시',
    payment: '게스트 카드',
    minimum: '단품 ¥3,000',
    discount: '5% 할인',
    deadline: '상시 · 종료일 미표기',
    href: 'https://www.iwataya-mitsukoshi.mistore.jp/mitsukoshi/event_calendar/globalcustomer/guest-card.html',
    note: '쇼핑 전 면세카운터에서 여권으로 발급 · 제외 브랜드 있음',
  },
  {
    store: '일본 면세 대응 매장',
    payment: '면세',
    minimum: '세전 ¥5,000',
    discount: '소비세 면제',
    deadline: '현행 방식 2026.10.31까지',
    href: 'https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00019.html',
    note: '여권 원본 · 같은 매장/같은 날 · 소모품은 개봉 금지',
  },
];
const budgets = [
  ['확정 숙박비', 'Atlas Apartment · 4박 / 2인', '¥79,834'],
  ['숙박세 예상', '¥200 × 2명 × 4박 · 포함 여부 현장 확인', '¥1,600'],
  ['Bounce 짐 보관', '9/22 · 짐 2개 · 공용 여행경비', '¥1,700'],
  ['히타 왕복 버스', '¥3,580 × 2명', '¥7,160'],
  ['유메산스이', '¥800 × 2명', '¥1,600'],
  ['삿포로 생맥주', '흑라벨/에비스 각 ¥450 기준', '현장 선택'],
  ['후쿠마 ↔ 미야지다케 버스', '편도 약 ¥210 × 왕복 × 2명', '약 ¥840'],
  ['공용비', '교통·식사·술·공용지출 목표', '¥80,000'],
  ['개인 쇼핑', '주류·카메라·의류', '별도'],
];

function Cards({ rows }: { rows: CardRow[] }) {
  return (
    <div className="cards">
      {rows.map(([title, desc, links]) => (
        <article className="card" key={title}>
          <h3>{title}</h3>
          <p>{desc}</p>
          {links && (
            <div className="card-links">
              {links.map(([label, href]) => (
                <a
                  className="card-link"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  key={href}
                >
                  {label} <ExternalLink size={14} />
                </a>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function FoodDirectory() {
  return (
    <div className="food-regions">
      {foodRegions.map(({ region, groups }) => (
        <section className="food-region" key={region}>
          <div className="food-region-head">
            <span>AREA</span>
            <h3>{region}</h3>
          </div>
          <div className="food-groups">
            {groups.map(({ menu, places }) => (
              <article className="food-group" key={menu}>
                <div className="food-group-head">
                  <h4>{menu}</h4>
                  <span>
                    {places.length > 1 ? `후보 ${places.length}곳` : '1곳'}
                  </span>
                </div>
                <div className="food-options">
                  {places.map(({ name, href, note }, index) => (
                    <a
                      className="food-option"
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      key={href}
                    >
                      <div>
                        {places.length > 1 && (
                          <span className="food-rank">후보 {index + 1}</span>
                        )}
                        <strong>{name}</strong>
                        {note && <small>{note}</small>}
                      </div>
                      <ExternalLink size={15} />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ShoppingBenefits() {
  const [view, setView] = useState<BenefitView>('store');
  const [filter, setFilter] = useState('전체');
  const options = [
    ...new Set(
      shoppingBenefits.map((item) =>
        view === 'store' ? item.store : item.payment,
      ),
    ),
  ].sort((a, b) => a.localeCompare(b, 'ko'));
  const filtered = shoppingBenefits
    .filter(
      (item) =>
        filter === '전체' ||
        (view === 'store' ? item.store : item.payment) === filter,
    )
    .sort((a, b) =>
      view === 'store'
        ? a.store.localeCompare(b.store, 'ko') ||
          a.payment.localeCompare(b.payment, 'ko')
        : a.payment.localeCompare(b.payment, 'ko') ||
          a.store.localeCompare(b.store, 'ko'),
    );

  const changeView = (next: BenefitView) => {
    setView(next);
    setFilter('전체');
  };

  return (
    <>
      <div className="benefit-callouts" aria-label="쇼핑 할인 핵심 비교">
        <article>
          <span>빅카메라</span>
          <strong>카카오페이 ¥2,000</strong>
          <small>동일 최소금액의 네이버페이보다 ¥500 큼</small>
        </article>
        <article>
          <span>돈키호테</span>
          <strong>¥15,000이면 네이버페이</strong>
          <small>¥30,000 이상이면 7% 매장 쿠폰과 비교</small>
        </article>
        <article>
          <span>GU · PARCO</span>
          <strong>현재 카카오페이 우세</strong>
          <small>각각 네이버페이보다 ¥100 · ¥200 큼</small>
        </article>
      </div>
      <div className="benefit-toolbar">
        <label>
          <span>보기 기준</span>
          <select
            value={view}
            onChange={(event) => changeView(event.target.value as BenefitView)}
          >
            <option value="store">상점별 혜택 보기</option>
            <option value="payment">결제수단별 혜택 보기</option>
          </select>
        </label>
        <label>
          <span>{view === 'store' ? '상점 선택' : '결제수단 선택'}</span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option>전체</option>
            {options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="benefit-status">
        2026.09.18 공식 페이지 기준 · 총 {filtered.length}개 혜택 · 선착순
        행사는 기한 전 조기 종료될 수 있음
      </p>
      <div className="benefit-table">
        <div className="benefit-table-head">
          <span>상점</span>
          <span>결제수단</span>
          <span>최소 결제금액</span>
          <span>할인 금액</span>
          <span>이벤트 기한</span>
          <span>확인</span>
        </div>
        {filtered.map((benefit, index) => (
          <article
            className="benefit-row"
            key={`${benefit.store}-${benefit.payment}-${benefit.discount}-${index}`}
          >
            <div data-label="상점">
              <strong>{benefit.store}</strong>
              {benefit.note && <small>{benefit.note}</small>}
            </div>
            <div data-label="결제수단">
              <span
                className={`payment-badge payment-${benefit.payment.replaceAll(' ', '-')}`}
              >
                {benefit.payment}
              </span>
            </div>
            <div data-label="최소 결제금액">{benefit.minimum}</div>
            <div data-label="할인 금액">
              <strong>{benefit.discount}</strong>
            </div>
            <div data-label="이벤트 기한">{benefit.deadline}</div>
            <div data-label="확인">
              <a
                href={benefit.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${benefit.store} ${benefit.payment} 혜택 공식 페이지`}
              >
                공식 정보 <ExternalLink size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="benefit-notes">
        <strong>결제 전 확인</strong>
        <p>
          카카오페이는 카카오페이머니만 대상이며 카드 결제는 제외됩니다. 매장
          쿠폰과 결제 프로모션의 중복은 보장되지 않으므로 최종 결제 화면에
          할인액이 표시됐는지 확인하세요.
        </p>
      </div>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('일정');
  const [day, setDay] = useState(0);
  const [hotelOpen, setHotelOpen] = useState(false);
  const [shoppingSection, setShoppingSection] =
    useState<ShoppingSection>('쇼핑리스트');
  return (
    <main className="site-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="wrap">
        <header className="hero">
          <div className="eyebrow">
            FUKUOKA TRIP PLANNER · <strong>BETA 1.6.3</strong>
          </div>
          <div className="hero-row">
            <div>
              <h1>
                후쿠오카
                <br className="mobile-break" /> 4박 5일
              </h1>
              <p>
                2026.09.18 — 09.22 · 남자 둘 · 도시 / 역사 / 축제 / 쇼핑 /
                먹거리 / 술
              </p>
            </div>
            <div className="stamp">
              九州
              <br />
              <span>FUKUOKA</span>
            </div>
          </div>
          <div className="meta-list">
            <span className="meta">
              <Plane size={16} /> 9/18 13:40 도착
            </span>
            <span className="meta">
              <Plane size={16} /> 9/22 19:40 출발
            </span>
            <span className="meta">
              <WalletCards size={16} /> 공용비 ¥80,000
            </span>
            <button
              className="meta hotel-trigger"
              onClick={() => setHotelOpen((v) => !v)}
              aria-expanded={hotelOpen}
            >
              <BedDouble size={16} /> Atlas Apartment · 4박 ¥79,834{' '}
              <ChevronDown size={15} className={hotelOpen ? 'rotate' : ''} />
            </button>
          </div>
          {hotelOpen && (
            <section className="hotel-panel">
              <div>
                <span>확정 숙소</span>
                <h2>Atlas Apartment</h2>
                <p>
                  <MapPin size={15} /> 후쿠오카시 주오구 다이묘 1초메 1-9
                </p>
              </div>
              <dl>
                <div>
                  <dt>체크인</dt>
                  <dd>9/18 16:00</dd>
                </div>
                <div>
                  <dt>체크아웃</dt>
                  <dd>9/22 10:00</dd>
                </div>
                <div>
                  <dt>숙박비</dt>
                  <dd>¥79,834 / 2인</dd>
                </div>
                <div>
                  <dt>1인 부담</dt>
                  <dd>¥39,917</dd>
                </div>
              </dl>
              <p className="hotel-note">
                Tenjin-Minami역 약 550m · 히타/다자이후는 텐진 출발,
                미야지다케는 하카타역 이동
              </p>
              <a
                className="link-button"
                href="https://maps.google.com/?q=1-1-9+Daimyo+Chuo+Ward+Fukuoka"
                target="_blank"
                rel="noreferrer"
              >
                Google Maps <ExternalLink size={15} />
              </a>
            </section>
          )}
          <a
            className="saved-map"
            href="https://maps.app.goo.gl/DgXaRUgMjiE5ZEkS9?g_st=i"
            target="_blank"
            rel="noreferrer"
          >
            <span className="saved-map-icon">
              <MapPinned size={21} />
            </span>
            <span className="saved-map-copy">
              <small>GOOGLE MAPS SAVED LIST</small>
              <strong>후쿠오카 전체 저장 목록</strong>
              <em>관광 · 쇼핑 · 먹거리 한 번에 보기</em>
            </span>
            <ExternalLink className="saved-map-arrow" size={18} />
          </a>
        </header>
        <nav className="tab-strip" aria-label="메인 메뉴">
          {tabs.map((t) => (
            <button
              key={t}
              className={tab === t ? 'active' : ''}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>
        <section className="content">
          {tab === '일정' && (
            <>
              <div className="day-strip" aria-label="날짜 선택">
                {days.map((d, i) => (
                  <button
                    key={d.date}
                    className={day === i ? 'active' : ''}
                    onClick={() => setDay(i)}
                  >
                    {d.date}
                  </button>
                ))}
              </div>
              <div className="section-head">
                <div>
                  <span>ITINERARY {String(day + 1).padStart(2, '0')}</span>
                  <h2>{days[day].title}</h2>
                </div>
                <em>{days[day].state}</em>
              </div>
              <div className="timeline">
                {days[day].items.map(
                  ([time, place, note, reference, referenceLabel]) => (
                    <article className="timeline-item" key={time + place}>
                      <time>{time}</time>
                      <div className="dot" />
                      <div>
                        <h3>{place}</h3>
                        <p>{note}</p>
                        {reference && (
                          <a
                            className="timeline-link"
                            href={reference}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {referenceLabel ?? '참고 링크'}{' '}
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </article>
                  ),
                )}
              </div>
            </>
          )}
          {tab === '관광' && (
            <>
              <div className="section-head">
                <div>
                  <span>PLACES</span>
                  <h2>관광 포인트</h2>
                </div>
              </div>
              <Cards rows={sights} />
            </>
          )}
          {tab === '교통' && (
            <>
              <div className="section-head">
                <div>
                  <span>TRANSIT</span>
                  <h2>교통 상세</h2>
                </div>
              </div>
              <Cards rows={transport} />
            </>
          )}
          {tab === '먹거리' && (
            <>
              <div className="section-head">
                <div>
                  <span>FOOD</span>
                  <h2>지역별 먹거리 후보</h2>
                </div>
              </div>
              <FoodDirectory />
            </>
          )}
          {tab === '쇼핑' && (
            <>
              <div
                className="shopping-subtabs"
                role="tablist"
                aria-label="쇼핑 정보"
              >
                <button
                  role="tab"
                  aria-selected={shoppingSection === '쇼핑리스트'}
                  className={shoppingSection === '쇼핑리스트' ? 'active' : ''}
                  onClick={() => setShoppingSection('쇼핑리스트')}
                >
                  쇼핑리스트
                </button>
                <button
                  role="tab"
                  aria-selected={shoppingSection === '할인 쿠폰 정보'}
                  className={
                    shoppingSection === '할인 쿠폰 정보' ? 'active' : ''
                  }
                  onClick={() => setShoppingSection('할인 쿠폰 정보')}
                >
                  할인 쿠폰 정보
                </button>
              </div>
              {shoppingSection === '쇼핑리스트' ? (
                <>
                  <div className="section-head">
                    <div>
                      <span>SHOPPING LIST</span>
                      <h2>매장별 구매 목록</h2>
                    </div>
                  </div>
                  <div className="responsive-table">
                    <div className="table-head">
                      <span>매장</span>
                      <span>아이템</span>
                      <span>구매 기준</span>
                    </div>
                    {shops.map(([a, b, c]) => (
                      <div className="table-row" key={a}>
                        <div data-label="매장">{a}</div>
                        <div data-label="아이템">{b}</div>
                        <div data-label="구매 기준">{c}</div>
                      </div>
                    ))}
                  </div>
                  <div className="market-links">
                    {shopLinks.map(([name, href]) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        key={name}
                      >
                        {name}
                        <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="section-head coupon-heading">
                    <div>
                      <span>COUPONS & PAYMENT</span>
                      <h2>할인 쿠폰 정보</h2>
                    </div>
                    <em>결제 전 할인 표시 확인</em>
                  </div>
                  <ShoppingBenefits />
                </>
              )}
            </>
          )}
          {tab === '예산' && (
            <>
              <div className="section-head">
                <div>
                  <span>BUDGET</span>
                  <h2>확정·예상 비용</h2>
                </div>
                <em>개인 쇼핑 별도</em>
              </div>
              <div className="budget-summary">
                <div>
                  <span>숙소 확정</span>
                  <strong>¥79,834</strong>
                </div>
                <div>
                  <span>공용비 목표</span>
                  <strong>¥80,000</strong>
                </div>
                <div>
                  <span>짐 보관</span>
                  <strong>¥1,700</strong>
                </div>
              </div>
              <div className="responsive-table budget-table">
                <div className="table-head">
                  <span>항목</span>
                  <span>산출</span>
                  <span>금액</span>
                </div>
                {budgets.map(([a, b, c]) => (
                  <div className="table-row" key={a}>
                    <div data-label="항목">{a}</div>
                    <div data-label="산출">{b}</div>
                    <div data-label="금액">{c}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
        <footer>
          FUKUOKA TRIP PLANNER · BETA 1.6.3 · 일정과 교통 시각, 할인 혜택은 여행
          당일 공식 안내로 재확인
        </footer>
      </div>
    </main>
  );
}
