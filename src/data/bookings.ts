export type Booking = {
  id: number;
  desk: string;
  floor: number;
  date: string;
  active: boolean;
};

export function isSameBooking(
  first: Pick<Booking, "desk" | "floor" | "date">,
  second: Pick<Booking, "desk" | "floor" | "date">,
) {
  return first.desk.trim().toLowerCase() === second.desk.trim().toLowerCase()
    && first.floor === second.floor
    && first.date === second.date;
}

export const initialBookings: Booking[] = [
  { id: 1, desk: "A12", floor: 3, date: "2026-10-06", active: true },
  { id: 2, desk: "B07", floor: 5, date: "2026-10-08", active: false },
  { id: 3, desk: "C21", floor: 2, date: "2026-10-12", active: true },
  { id: 4, desk: "A03", floor: 1, date: "2026-10-15", active: true },
];