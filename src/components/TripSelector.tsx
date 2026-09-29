import { useTripData } from '../data/TripDataProvider';

export function TripSelector() {
  const { index, selectedTripId, selectTrip } = useTripData();
  if (index.trips.length < 2) return null;

  return (
    <label className="trip-selector">
      <span>여행 기록</span>
      <select
        value={selectedTripId}
        onChange={(event) => selectTrip(event.target.value)}
        aria-label="여행 기록 선택"
      >
        {index.trips.map((trip) => (
          <option value={trip.id} key={trip.id}>
            {trip.title} · {trip.startDate.slice(0, 4)}
          </option>
        ))}
      </select>
    </label>
  );
}
