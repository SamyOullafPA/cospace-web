export interface ColleagueOpportunity {
  id: string;
  desk: string;
  floor: string;
  date: string;
  active: boolean;
}

export type Booking = ColleagueOpportunity;

const isString = (value: unknown): value is string => typeof value === "string";

// Mapped type: adding, removing or retyping an interface key is a compile error until this is updated.
const fieldGuards: {
  [K in keyof ColleagueOpportunity]-?: (value: unknown) => value is ColleagueOpportunity[K];
} = {
  id: isString,
  desk: isString,
  floor: isString,
  date: isString,
  active: (value): value is boolean => typeof value === "boolean",
};

export function isColleagueOpportunity(value: unknown): value is ColleagueOpportunity {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (Object.keys(fieldGuards) as (keyof ColleagueOpportunity)[])
    .every((key) => fieldGuards[key](record[key]));
}

export function isSameBooking(
  first: Pick<Booking, "desk" | "floor" | "date">,
  second: Pick<Booking, "desk" | "floor" | "date">,
) {
  return first.desk.trim().toLowerCase() === second.desk.trim().toLowerCase()
    && first.floor === second.floor
    && first.date === second.date;
}

export const initialBookings: Booking[] = [
  { id: "1", desk: "A12", floor: "3", date: "2026-10-06", active: true },
  { id: "2", desk: "B07", floor: "5", date: "2026-10-08", active: false },
  { id: "3", desk: "C21", floor: "2", date: "2026-10-12", active: true },
  { id: "4", desk: "A03", floor: "1", date: "2026-10-15", active: true },
];