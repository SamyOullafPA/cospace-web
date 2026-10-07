"use client";

import { useRef, useState, type SubmitEvent } from "react";
import type { BookingCardProps } from "./BookingCard";
import { validateBooking } from "./CreateBookingForm";
import { isSameBooking } from "@/data/bookings";

type RegistrationFormProps = {
  onAdd: (booking: BookingCardProps) => void;
  bookings: readonly BookingCardProps[];
};

const emptyForm = { desk: "", floor: "", date: "" };

export default function RegistrationForm({ onAdd, bookings }: RegistrationFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<ReturnType<typeof validateBooking>>({});
  const lastSubmittedBooking = useRef<BookingCardProps | null>(null);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    // Stop the browser's full-page POST/reload so React keeps control of state.
    e.preventDefault();

    const validationErrors = validateBooking(form.desk, form.floor, form.date);
    const floor = Number(form.floor);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const booking: BookingCardProps = {
      desk: form.desk.trim(),
      floor,
      date: form.date,
      active: true,
    };
    if (
      bookings.some((existing) => isSameBooking(existing, booking))
      || (lastSubmittedBooking.current && isSameBooking(lastSubmittedBooking.current, booking))
    ) {
      setErrors({ desk: "This desk is already booked on this floor for this date." });
      return;
    }

    lastSubmittedBooking.current = booking;
    onAdd(booking);
    setForm(emptyForm);
  }

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "end", marginBottom: 24 }}
    >
      <label>
        Desk
        <input
          required
          value={form.desk}
          onChange={(e) => update("desk", e.target.value)}
          placeholder="e.g. D14"
          aria-invalid={Boolean(errors.desk)}
          aria-describedby={errors.desk ? "registration-desk-error" : undefined}
          style={{ display: "block", padding: 8, border: `1px solid ${errors.desk ? "red" : "#767676"}` }}
        />
        {errors.desk && <span id="registration-desk-error" role="alert" style={{ display: "block", color: "red" }}>{errors.desk}</span>}
      </label>
      <label>
        Floor
        <input
          required
          type="number"
          min={0}
          value={form.floor}
          onChange={(e) => update("floor", e.target.value)}
          aria-invalid={Boolean(errors.floor)}
          aria-describedby={errors.floor ? "registration-floor-error" : undefined}
          style={{ display: "block", padding: 8, width: 80, border: `1px solid ${errors.floor ? "red" : "#767676"}` }}
        />
        {errors.floor && <span id="registration-floor-error" role="alert" style={{ display: "block", color: "red" }}>{errors.floor}</span>}
      </label>
      <label>
        Date
        <input
          required
          type="date"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? "registration-date-error" : undefined}
          style={{ display: "block", padding: 8, border: `1px solid ${errors.date ? "red" : "#767676"}` }}
        />
        {errors.date && <span id="registration-date-error" role="alert" style={{ display: "block", color: "red" }}>{errors.date}</span>}
      </label>
      <button type="submit" style={{ padding: "8px 16px" }}>
        Book desk
      </button>
    </form>
  );
}
