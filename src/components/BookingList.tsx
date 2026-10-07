"use client";

import { useState } from "react";
import BookingCard from "./BookingCard";
import RegistrationForm from "./RegistrationForm";
import { initialBookings, isSameBooking, type Booking } from "@/data/bookings";

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [query, setQuery] = useState("");

  function addBooking(booking: Booking) {
    setBookings((prev) => prev.some((existing) => isSameBooking(existing, booking))
      ? prev
      : [...prev, booking]);
  }

  const q = query.trim().toLowerCase();
  const visible = bookings.filter((b) =>
    [b.desk, b.floor, b.date].some((field) => field.toLowerCase().includes(q))
  );

  return (
    <section>
      <RegistrationForm onAdd={addBooking} bookings={bookings} />
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
