"use client";

import { useState } from "react";
import BookingCard, { type BookingCardProps } from "./BookingCard";
import RegistrationForm from "./RegistrationForm";
import { initialBookings, type Booking } from "@/data/bookings";

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
            <BookingCard key={id} id={id} {...booking} />
          ))}
        </div>
      )}
    </section>
  );
}
