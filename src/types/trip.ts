export type TripStatus = 'planning' | 'upcoming' | 'ongoing' | 'completed';
export type VisitStatus =
  | 'planned'
  | 'visited'
  | 'skipped'
  | 'changed'
  | 'cancelled';
export type SectionType =
  | 'cards'
  | 'grouped-directory'
  | 'shopping'
  | 'expense-table'
  | 'gallery'
  | 'map'
  | 'checklist'
  | 'journal'
  | 'table'
  | 'links';

export interface ExternalLink {
  id?: string;
  label: string;
  href: string;
  kind?: 'official' | 'map' | 'article' | 'reservation' | 'reference';
}

export interface Money {
  amount: number;
  currency: string;
  display?: string;
}

export interface TripIndexEntry {
  id: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  thumbnail?: string;
  tags?: string[];
  dataPath: string;
}

export interface TripIndex {
  schemaVersion: 1;
  defaultTripId: string;
  trips: TripIndexEntry[];
}

export interface TripMeta {
  title: string;
  subtitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  timezone: string;
  locale: string;
  travelers: number;
  status: TripStatus;
  tags: string[];
}

export interface TripHero {
  eyebrow: string;
  headline: string[];
  seal?: {
    primary: string;
    secondary?: string;
  };
  facts: Array<{
    id: string;
    icon: 'arrival' | 'departure' | 'budget' | 'custom';
    label: string;
  }>;
  accommodation?: {
    name: string;
    detail: string;
    address?: string;
    checkIn?: string;
    checkOut?: string;
    amount?: Money;
    mapUrl?: string;
  };
  savedMap?: ExternalLink & {
    description?: string;
  };
}

export interface EventPlan {
  timeLabel?: string;
  description?: string;
}

export interface EventRecord {
  status: VisitStatus;
  actualTimeLabel?: string;
  note?: string;
  rating?: number;
  photoIds?: string[];
  expenseIds?: string[];
}

export interface ItineraryEvent {
  id: string;
  timeLabel: string;
  title: string;
  description: string;
  placeId?: string;
  links?: ExternalLink[];
  sourceIds?: string[];
  plan?: EventPlan;
  record?: EventRecord;
}

export interface ItineraryDay {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  state?: string;
  events: ItineraryEvent[];
}

export interface Place {
  id: string;
  name: string;
  region?: string;
  categories?: string[];
  mapUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  visited?: boolean;
  note?: string;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  publisher?: string;
  accessedAt?: string;
  sourceType: 'official' | 'article' | 'blog' | 'map' | 'personal';
}

export interface SectionBase {
  id: string;
  type: SectionType;
  navLabel: string;
  eyebrow?: string;
  title: string;
  description?: string;
  visible?: boolean;
}

export interface CardItem {
  id: string;
  title: string;
  description: string;
  links?: ExternalLink[];
  placeId?: string;
  sourceIds?: string[];
}

export interface CardsSection extends SectionBase {
  type: 'cards';
  items: CardItem[];
}

export interface DirectoryPlace {
  id: string;
  name: string;
  href: string;
  note?: string;
  placeId?: string;
}

export interface DirectoryGroup {
  id: string;
  label: string;
  places: DirectoryPlace[];
}

export interface DirectoryRegion {
  id: string;
  label: string;
  groups: DirectoryGroup[];
}

export interface GroupedDirectorySection extends SectionBase {
  type: 'grouped-directory';
  regions: DirectoryRegion[];
}

export interface ShoppingListItem {
  id: string;
  store: string;
  item: string;
  criteria: string;
}

export interface ShoppingBenefit {
  id: string;
  store: string;
  payment: string;
  minimum: string;
  discount: string;
  deadline: string;
  href: string;
  note?: string;
  verifiedAt?: string;
  sourceIds?: string[];
}

export interface BenefitCallout {
  id: string;
  label: string;
  title: string;
  description: string;
}

export interface ShoppingSection extends SectionBase {
  type: 'shopping';
  shoppingList: ShoppingListItem[];
  resourceLinks?: ExternalLink[];
  benefitCallouts?: BenefitCallout[];
  benefits?: ShoppingBenefit[];
  benefitNotice?: string;
}

export interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount?: Money;
  displayAmount: string;
  paidBy?: string;
  participants?: number;
  date?: string;
}

export interface ExpenseSection extends SectionBase {
  type: 'expense-table';
  summary?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  items: ExpenseItem[];
}

export interface GenericSection extends SectionBase {
  type: Exclude<
    SectionType,
    'cards' | 'grouped-directory' | 'shopping' | 'expense-table'
  >;
  data: Record<string, unknown>;
}

export type TripSection =
  | CardsSection
  | GroupedDirectorySection
  | ShoppingSection
  | ExpenseSection
  | GenericSection;

export interface TripData {
  schemaVersion: 1;
  id: string;
  meta: TripMeta;
  hero: TripHero;
  itinerary: ItineraryDay[];
  sections: TripSection[];
  places?: Place[];
  sources?: Source[];
}
