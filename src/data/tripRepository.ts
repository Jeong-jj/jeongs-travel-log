import type { TripData, TripIndex } from '../types/trip';

export interface TripRepository {
  getIndex(signal?: AbortSignal): Promise<TripIndex>;
  getTrip(dataPath: string, signal?: AbortSignal): Promise<TripData>;
}

const assertObject = (
  value: unknown,
  label: string,
): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} JSON의 형식이 올바르지 않습니다.`);
  }
  return value as Record<string, unknown>;
};

const assertTripIndex = (value: unknown): TripIndex => {
  const data = assertObject(value, '여행 목록');
  if (data.schemaVersion !== 1 || !Array.isArray(data.trips)) {
    throw new Error('지원하지 않는 여행 목록 버전입니다.');
  }
  return data as unknown as TripIndex;
};

const assertTripData = (value: unknown): TripData => {
  const data = assertObject(value, '여행');
  if (
    data.schemaVersion !== 1 ||
    typeof data.id !== 'string' ||
    !Array.isArray(data.itinerary) ||
    !Array.isArray(data.sections)
  ) {
    throw new Error('지원하지 않는 여행 데이터 버전입니다.');
  }
  return data as unknown as TripData;
};

export class StaticTripRepository implements TripRepository {
  readonly #dataRoot: string;

  constructor(baseUrl = import.meta.env.BASE_URL) {
    this.#dataRoot = `${baseUrl.replace(/\/?$/, '/')}data/`;
  }

  async #fetchJson(path: string, signal?: AbortSignal): Promise<unknown> {
    const response = await fetch(`${this.#dataRoot}${path}`, {
      cache: 'no-cache',
      signal,
    });
    if (!response.ok) {
      throw new Error(
        `여행 데이터를 불러오지 못했습니다. (${response.status})`,
      );
    }
    return response.json() as Promise<unknown>;
  }

  async getIndex(signal?: AbortSignal): Promise<TripIndex> {
    return assertTripIndex(await this.#fetchJson('trips.json', signal));
  }

  async getTrip(dataPath: string, signal?: AbortSignal): Promise<TripData> {
    if (dataPath.includes('..') || dataPath.startsWith('/')) {
      throw new Error('잘못된 여행 데이터 경로입니다.');
    }
    return assertTripData(await this.#fetchJson(dataPath, signal));
  }
}
