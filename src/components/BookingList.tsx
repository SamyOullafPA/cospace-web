"use client";

import { useState } from "react";
import BookingCard, { type BookingCardProps } from "./BookingCard";
import RegistrationForm from "./RegistrationForm";

type Booking = BookingCardProps & { id: number };

const initialBookings: Booking[] = [
  { id: 1, desk: "A12", floor: 3, date: "2026-10-06", active: true },
  { id: 2, desk: "B07", floor: 5, date: "2026-10-08", active: false },
  { id: 3, desk: "C21", floor: 2, date: "2026-10-12", active: true },
  { id: 4, desk: "A03", floor: 1, date: "2026-10-15", active: true },
];

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [query, setQuery] = useState("");

  function addBooking(booking: BookingCardProps) {
    setBookings((prev) => [...prev, { ...booking, id: Date.now() }]);
  }

  const q = query.trim().toLowerCase();
  const visible = bookings.filter((b) =>
    [b.desk, String(b.floor), b.date].some((field) => field.toLowerCase().includes(q))
  );

  return (
    <section>
      <RegistrationForm onAdd={addBooking} />
      <input
        type="search"
        placeholder="Search by desk, floor or date"
        aria-label="Search bookings"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, width: 280, marginBottom: 16 }}
      />
      {visible.length === 0 ? (
        <p>No bookings match &quot;{query}&quot;.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {visible.map(({ id, ...booking }) => (
            <BookingCard key={id} {...booking} />
          ))}
        </div>
      )}
    </section>
  );
}
