import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { TripData, TripIndex } from '../types/trip';
import type { TripRepository } from './tripRepository';

interface TripDataContextValue {
  index: TripIndex;
  trip: TripData;
  selectedTripId: string;
  selectTrip: (tripId: string) => void;
}

const TripDataContext = createContext<TripDataContextValue | null>(null);

const tripIdFromHash = () => {
  const match = window.location.hash.match(/^#\/trip\/([a-z0-9-]+)$/);
  return match?.[1];
};

function LoadingScreen({ message }: { message: string }) {
  return (
    <output className="data-state">
      <span>TRIP ARCHIVE</span>
      <h1>{message}</h1>
    </output>
  );
}

export function TripDataProvider({
  repository,
  children,
}: {
  repository: TripRepository;
  children: ReactNode;
}) {
  const [index, setIndex] = useState<TripIndex | null>(null);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    repository
      .getIndex(controller.signal)
      .then((nextIndex) => {
        setIndex(nextIndex);
        const requestedId = tripIdFromHash();
        const selected = nextIndex.trips.some((item) => item.id === requestedId)
          ? requestedId!
          : nextIndex.defaultTripId;
        setSelectedTripId(selected);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            reason instanceof Error ? reason.message : '여행 목록 로드 실패',
          );
        }
      });
    return () => controller.abort();
  }, [repository]);

  useEffect(() => {
    if (!index || !selectedTripId) return;
    const entry = index.trips.find((item) => item.id === selectedTripId);
    if (!entry) return;

    const controller = new AbortController();
    repository
      .getTrip(entry.dataPath, controller.signal)
      .then((nextTrip) => {
        setError('');
        setTrip(nextTrip);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            reason instanceof Error ? reason.message : '여행 데이터 로드 실패',
          );
        }
      });
    return () => controller.abort();
  }, [index, repository, selectedTripId]);

  useEffect(() => {
    if (!trip || trip.id !== selectedTripId) return;
    document.title = `${trip.meta.title} · Trip Archive`;
  }, [selectedTripId, trip]);

  useEffect(() => {
    if (!index) return;
    const onHashChange = () => {
      const requestedId = tripIdFromHash();
      if (requestedId && index.trips.some((item) => item.id === requestedId)) {
        setSelectedTripId(requestedId);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [index]);

  const selectTrip = useCallback((tripId: string) => {
    window.location.hash = `/trip/${tripId}`;
    setSelectedTripId(tripId);
  }, []);

  const value = useMemo(
    () =>
      index && trip?.id === selectedTripId
        ? { index, trip, selectedTripId, selectTrip }
        : null,
    [index, selectTrip, selectedTripId, trip],
  );

  if (error) return <LoadingScreen message={error} />;
  if (!value) return <LoadingScreen message="여행 기록을 불러오는 중…" />;

  return <TripDataContext value={value}>{children}</TripDataContext>;
}

export function useTripData() {
  const value = useContext(TripDataContext);
  if (!value)
    throw new Error('useTripData must be used inside TripDataProvider');
  return value;
}
