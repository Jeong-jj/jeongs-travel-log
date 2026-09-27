import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const dataRoot = path.join(projectRoot, 'public', 'data');

const readJson = async (filePath) =>
  JSON.parse(await readFile(filePath, { encoding: 'utf8' }));

const [indexSchema, tripSchema, tripIndex] = await Promise.all([
  readJson(path.join(projectRoot, 'schemas', 'trip-index.schema.json')),
  readJson(path.join(projectRoot, 'schemas', 'trip.schema.json')),
  readJson(path.join(dataRoot, 'trips.json')),
]);

const ajv = new Ajv2020({ allErrors: true, strict: true });
const validateIndex = ajv.compile(indexSchema);
const validateTrip = ajv.compile(tripSchema);
const failures = [];

const pushSchemaErrors = (label, errors = []) => {
  for (const error of errors) {
    failures.push(`${label}${error.instancePath || '/'} ${error.message}`);
  }
};

if (!validateIndex(tripIndex)) {
  pushSchemaErrors('trips.json', validateIndex.errors);
}

const indexIds = tripIndex.trips.map((trip) => trip.id);
if (new Set(indexIds).size !== indexIds.length) {
  failures.push('trips.json contains duplicate trip ids');
}
if (!indexIds.includes(tripIndex.defaultTripId)) {
  failures.push(`defaultTripId does not exist: ${tripIndex.defaultTripId}`);
}

const collectIds = (value, ids, location = '$') => {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectIds(item, ids, `${location}[${index}]`),
    );
    return;
  }
  if (!value || typeof value !== 'object') return;

  if (typeof value.id === 'string') {
    if (ids.has(value.id)) {
      failures.push(
        `duplicate id "${value.id}" at ${location} and ${ids.get(value.id)}`,
      );
    } else {
      ids.set(value.id, location);
    }
  }

  for (const [key, child] of Object.entries(value)) {
    collectIds(child, ids, `${location}.${key}`);
  }
};

for (const entry of tripIndex.trips) {
  const tripPath = path.resolve(dataRoot, entry.dataPath);
  if (!tripPath.startsWith(`${dataRoot}${path.sep}`)) {
    failures.push(`dataPath escapes public/data: ${entry.dataPath}`);
    continue;
  }

  let trip;
  try {
    trip = await readJson(tripPath);
  } catch (error) {
    failures.push(`cannot read ${entry.dataPath}: ${error.message}`);
    continue;
  }

  if (!validateTrip(trip)) {
    pushSchemaErrors(entry.dataPath, validateTrip.errors);
  }

  if (trip.id !== entry.id)
    failures.push(`${entry.dataPath} id does not match index entry`);
  if (trip.meta?.title !== entry.title) {
    failures.push(`${entry.dataPath} title does not match index entry`);
  }
  if (
    trip.meta?.startDate !== entry.startDate ||
    trip.meta?.endDate !== entry.endDate
  ) {
    failures.push(`${entry.dataPath} dates do not match index entry`);
  }
  if (trip.meta?.status !== entry.status) {
    failures.push(`${entry.dataPath} status does not match index entry`);
  }

  collectIds(trip, new Map());

  const placeIds = new Set((trip.places ?? []).map((place) => place.id));
  const sourceIds = new Set((trip.sources ?? []).map((source) => source.id));
  const expenseIds = new Set(
    trip.sections
      .filter((section) => section.type === 'expense-table')
      .flatMap((section) => section.items.map((item) => item.id)),
  );

  const inspectReferences = (value, location = '$') => {
    if (Array.isArray(value)) {
      value.forEach((item, index) =>
        inspectReferences(item, `${location}[${index}]`),
      );
      return;
    }
    if (!value || typeof value !== 'object') return;

    if (value.placeId && !placeIds.has(value.placeId)) {
      failures.push(
        `${location}.placeId references missing place "${value.placeId}"`,
      );
    }
    for (const sourceId of value.sourceIds ?? []) {
      if (!sourceIds.has(sourceId)) {
        failures.push(
          `${location}.sourceIds references missing source "${sourceId}"`,
        );
      }
    }
    for (const expenseId of value.expenseIds ?? []) {
      if (!expenseIds.has(expenseId)) {
        failures.push(
          `${location}.expenseIds references missing expense "${expenseId}"`,
        );
      }
    }

    for (const [key, child] of Object.entries(value)) {
      inspectReferences(child, `${location}.${key}`);
    }
  };

  inspectReferences(trip);
}

if (failures.length > 0) {
  console.error('Trip data validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validated ${tripIndex.trips.length} trip data file(s).`);
