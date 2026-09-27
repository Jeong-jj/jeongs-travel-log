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
import { TripSelector } from './components/TripSelector';
import { useTripData } from './data/TripDataProvider';
import type {
  CardItem,
  CardsSection,
  ExpenseSection,
  GroupedDirectorySection,
  ShoppingBenefit,
  ShoppingSection,
  TripData,
  TripSection,
} from './types/trip';

const APP_VERSION = 'BETA 1.6.3';
const ITINERARY_ID = 'itinerary';
type BenefitView = 'store' | 'payment';
type ShoppingView = 'list' | 'benefits';

const formatDateRange = (startDate: string, endDate: string) => {
  const start = startDate.replaceAll('-', '.');
  const end = endDate.slice(5).replace('-', '.');
  return `${start} — ${end}`;
};

function Cards({ items }: { items: CardItem[] }) {
  return (
    <div className="cards">
      {items.map((item) => (
        <article className="card" key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {item.links && item.links.length > 0 && (
            <div className="card-links">
              {item.links.map((link) => (
                <a
                  className="card-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  key={link.id ?? link.href}
                >
                  {link.label} <ExternalLink size={14} />
                </a>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  note,
  className = '',
}: {
  eyebrow?: string;
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={`section-head ${className}`.trim()}>
      <div>
        {eyebrow && <span>{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {note && <em>{note}</em>}
    </div>
  );
}

function FoodDirectory({ section }: { section: GroupedDirectorySection }) {
  return (
    <div className="food-regions">
      {section.regions.map((region) => (
        <section className="food-region" key={region.id}>
          <div className="food-region-head">
            <span>AREA</span>
            <h3>{region.label}</h3>
          </div>
          <div className="food-groups">
            {region.groups.map((group) => (
              <article className="food-group" key={group.id}>
                <div className="food-group-head">
                  <h4>{group.label}</h4>
                  <span>
                    {group.places.length > 1
                      ? `후보 ${group.places.length}곳`
                      : '1곳'}
                  </span>
                </div>
                <div className="food-options">
                  {group.places.map((place, index) => (
                    <a
                      className="food-option"
                      href={place.href}
                      target="_blank"
                      rel="noreferrer"
                      key={place.id}
                    >
                      <div>
                        {group.places.length > 1 && (
                          <span className="food-rank">후보 {index + 1}</span>
                        )}
                        <strong>{place.name}</strong>
                        {place.note && <small>{place.note}</small>}
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

function BenefitDirectory({
  benefits,
  benefitCallouts: callouts = [],
  benefitNotice: notice,
}: Pick<ShoppingSection, 'benefits' | 'benefitCallouts' | 'benefitNotice'>) {
  const [view, setView] = useState<BenefitView>('store');
  const [filter, setFilter] = useState('전체');
  const source = benefits ?? [];
  const options = [
    ...new Set(
      source.map((item) => (view === 'store' ? item.store : item.payment)),
    ),
  ].sort((a, b) => a.localeCompare(b, 'ko'));
  const filtered = source
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
      {callouts.length > 0 && (
        <div className="benefit-callouts" aria-label="쇼핑 할인 핵심 비교">
          {callouts.map((callout) => (
            <article key={callout.id}>
              <span>{callout.label}</span>
              <strong>{callout.title}</strong>
              <small>{callout.description}</small>
            </article>
          ))}
        </div>
      )}
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
        총 {filtered.length}개 혜택 · 선착순 행사는 기한 전 조기 종료될 수 있음
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
        {filtered.map((benefit) => (
          <BenefitRow benefit={benefit} key={benefit.id} />
        ))}
      </div>
      {notice && (
        <div className="benefit-notes">
          <strong>결제 전 확인</strong>
          <p>{notice}</p>
        </div>
      )}
    </>
  );
}

function BenefitRow({ benefit }: { benefit: ShoppingBenefit }) {
  return (
    <article className="benefit-row">
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
  );
}

function ShoppingView({ section }: { section: ShoppingSection }) {
  const [view, setView] = useState<ShoppingView>('list');
  return (
    <>
      <div className="shopping-subtabs" role="tablist" aria-label="쇼핑 정보">
        <button
          role="tab"
          aria-selected={view === 'list'}
          className={view === 'list' ? 'active' : ''}
          onClick={() => setView('list')}
        >
          쇼핑리스트
        </button>
        <button
          role="tab"
          aria-selected={view === 'benefits'}
          className={view === 'benefits' ? 'active' : ''}
          onClick={() => setView('benefits')}
        >
          할인 쿠폰 정보
        </button>
      </div>
      {view === 'list' ? (
        <>
          <SectionHeading eyebrow="SHOPPING LIST" title="매장별 구매 목록" />
          <div className="responsive-table">
            <div className="table-head">
              <span>매장</span>
              <span>아이템</span>
              <span>구매 기준</span>
            </div>
            {section.shoppingList.map((item) => (
              <div className="table-row" key={item.id}>
                <div data-label="매장">{item.store}</div>
                <div data-label="아이템">{item.item}</div>
                <div data-label="구매 기준">{item.criteria}</div>
              </div>
            ))}
          </div>
          {section.resourceLinks && (
            <div className="market-links">
              {section.resourceLinks.map((link) => (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  key={link.href}
                >
                  {link.label}
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <SectionHeading
            eyebrow="COUPONS & PAYMENT"
            title="할인 쿠폰 정보"
            note="결제 전 할인 표시 확인"
            className="coupon-heading"
          />
          <BenefitDirectory
            benefits={section.benefits}
            benefitCallouts={section.benefitCallouts}
            benefitNotice={section.benefitNotice}
          />
        </>
      )}
    </>
  );
}

function ExpenseView({ section }: { section: ExpenseSection }) {
  return (
    <>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        note={section.description}
      />
      {section.summary && (
        <div className="budget-summary">
          {section.summary.map((item) => (
            <div key={item.id}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      )}
      <div className="responsive-table budget-table">
        <div className="table-head">
          <span>항목</span>
          <span>산출</span>
          <span>금액</span>
        </div>
        {section.items.map((item) => (
          <div className="table-row" key={item.id}>
            <div data-label="항목">{item.category}</div>
            <div data-label="산출">{item.description}</div>
            <div data-label="금액">{item.displayAmount}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function SectionView({ section }: { section: TripSection }) {
  switch (section.type) {
    case 'cards':
      return (
        <>
          <SectionHeading eyebrow={section.eyebrow} title={section.title} />
          <Cards items={(section as CardsSection).items} />
        </>
      );
    case 'grouped-directory':
      return (
        <>
          <SectionHeading eyebrow={section.eyebrow} title={section.title} />
          <FoodDirectory section={section} />
        </>
      );
    case 'shopping':
      return <ShoppingView section={section} />;
    case 'expense-table':
      return <ExpenseView section={section} />;
    default:
      return (
        <>
          <SectionHeading eyebrow={section.eyebrow} title={section.title} />
          {section.description && <p>{section.description}</p>}
        </>
      );
  }
}

function TripHero({ trip }: { trip: TripData }) {
  const [hotelOpen, setHotelOpen] = useState(false);
  const { hero, meta } = trip;
  const accommodation = hero.accommodation;
  const perPerson = accommodation?.amount
    ? Math.round(accommodation.amount.amount / meta.travelers).toLocaleString(
        'ja-JP',
      )
    : null;

  return (
    <header className="hero">
      <TripSelector />
      <div className="eyebrow">
        {hero.eyebrow} · <strong>{APP_VERSION}</strong>
      </div>
      <div className="hero-row">
        <div>
          <h1>
            {hero.headline.map((line, index) => (
              <span key={`${line}-${index}`}>
                {index > 0 && <br className="mobile-break" />}
                {line}
              </span>
            ))}
          </h1>
          <p>
            {formatDateRange(meta.startDate, meta.endDate)} · {meta.travelers}명
            · {meta.subtitle}
          </p>
        </div>
        {hero.seal && (
          <div className="stamp">
            {hero.seal.primary}
            {hero.seal.secondary && (
              <>
                <br />
                <span>{hero.seal.secondary}</span>
              </>
            )}
          </div>
        )}
      </div>
      <div className="meta-list">
        {hero.facts.map((fact) => {
          const Icon = fact.icon === 'budget' ? WalletCards : Plane;
          return (
            <span className="meta" key={fact.id}>
              <Icon size={16} /> {fact.label}
            </span>
          );
        })}
        {accommodation && (
          <button
            className="meta hotel-trigger"
            onClick={() => setHotelOpen((value) => !value)}
            aria-expanded={hotelOpen}
          >
            <BedDouble size={16} /> {accommodation.name} ·{' '}
            {accommodation.detail}{' '}
            <ChevronDown size={15} className={hotelOpen ? 'rotate' : ''} />
          </button>
        )}
      </div>
      {hotelOpen && accommodation && (
        <section className="hotel-panel">
          <div>
            <span>확정 숙소</span>
            <h2>{accommodation.name}</h2>
            {accommodation.address && (
              <p>
                <MapPin size={15} /> {accommodation.address}
              </p>
            )}
          </div>
          <dl>
            {accommodation.checkIn && (
              <div>
                <dt>체크인</dt>
                <dd>{accommodation.checkIn}</dd>
              </div>
            )}
            {accommodation.checkOut && (
              <div>
                <dt>체크아웃</dt>
                <dd>{accommodation.checkOut}</dd>
              </div>
            )}
            {accommodation.amount && (
              <div>
                <dt>숙박비</dt>
                <dd>{accommodation.amount.display}</dd>
              </div>
            )}
            {perPerson && (
              <div>
                <dt>1인 부담</dt>
                <dd>¥{perPerson}</dd>
              </div>
            )}
          </dl>
          <p className="hotel-note">{accommodation.detail}</p>
          {accommodation.mapUrl && (
            <a
              className="link-button"
              href={accommodation.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              Google Maps <ExternalLink size={15} />
            </a>
          )}
        </section>
      )}
      {hero.savedMap && (
        <a
          className="saved-map"
          href={hero.savedMap.href}
          target="_blank"
          rel="noreferrer"
        >
          <span className="saved-map-icon">
            <MapPinned size={21} />
          </span>
          <span className="saved-map-copy">
            <small>GOOGLE MAPS SAVED LIST</small>
            <strong>{hero.savedMap.label}</strong>
            {hero.savedMap.description && <em>{hero.savedMap.description}</em>}
          </span>
          <ExternalLink className="saved-map-arrow" size={18} />
        </a>
      )}
    </header>
  );
}

function ItineraryView({ trip }: { trip: TripData }) {
  const [dayIndex, setDayIndex] = useState(0);
  const day = trip.itinerary[dayIndex];
  if (!day) return <p>저장된 일정이 없습니다.</p>;

  return (
    <>
      <div className="day-strip" aria-label="날짜 선택">
        {trip.itinerary.map((item, index) => (
          <button
            key={item.id}
            className={dayIndex === index ? 'active' : ''}
            onClick={() => setDayIndex(index)}
          >
            {item.dateLabel}
          </button>
        ))}
      </div>
      <SectionHeading
        eyebrow={`ITINERARY ${String(dayIndex + 1).padStart(2, '0')}`}
        title={day.title}
        note={day.state}
      />
      <div className="timeline">
        {day.events.map((event) => (
          <article className="timeline-item" key={event.id}>
            <time>{event.record?.actualTimeLabel ?? event.timeLabel}</time>
            <div className="dot" />
            <div>
              <h3>{event.title}</h3>
              <p>{event.record?.note ?? event.description}</p>
              {event.links?.map((link) => (
                <a
                  className="timeline-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  key={link.id ?? link.href}
                >
                  {link.label} <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function TripView({ trip }: { trip: TripData }) {
  const visibleSections = trip.sections.filter(
    (section) => section.visible !== false,
  );
  const [activeSectionId, setActiveSectionId] = useState(ITINERARY_ID);
  const activeSection = visibleSections.find(
    (section) => section.id === activeSectionId,
  );

  return (
    <main className="site-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="wrap">
        <TripHero trip={trip} />
        <nav className="tab-strip" aria-label="메인 메뉴">
          <button
            className={activeSectionId === ITINERARY_ID ? 'active' : ''}
            onClick={() => setActiveSectionId(ITINERARY_ID)}
          >
            일정
          </button>
          {visibleSections.map((section) => (
            <button
              key={section.id}
              className={activeSectionId === section.id ? 'active' : ''}
              onClick={() => setActiveSectionId(section.id)}
            >
              {section.navLabel}
            </button>
          ))}
        </nav>
        <section className="content">
          {activeSectionId === ITINERARY_ID ? (
            <ItineraryView trip={trip} />
          ) : activeSection ? (
            <SectionView section={activeSection} />
          ) : null}
        </section>
        <footer>
          {trip.meta.title.toUpperCase()} · {APP_VERSION} · 일정과 교통 시각,
          할인 혜택은 여행 당시 공식 안내 기준
        </footer>
      </div>
    </main>
  );
}

export default function App() {
  const { trip } = useTripData();
  return <TripView trip={trip} key={trip.id} />;
}
