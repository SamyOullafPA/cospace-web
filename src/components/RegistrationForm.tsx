"use client";

import { useRef, useState, type SubmitEvent } from "react";
import api, { getApiErrorMessage } from "@/lib/api";
import type { BookingCardProps } from "./BookingCard";
import { validateBooking } from "./CreateBookingForm";
import { isSameBooking, type Booking } from "@/data/bookings";

type RegistrationFormProps = {
  onAdd: (booking: Booking) => void;
  bookings: readonly BookingCardProps[];
};

const emptyForm = { desk: "", floor: "", date: "" };

export default function RegistrationForm({ onAdd, bookings }: RegistrationFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<ReturnType<typeof validateBooking>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const lastSubmittedBooking = useRef<BookingCardProps | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    // Stop the browser's full-page POST/reload so React keeps control of state.
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateBooking(form.desk, form.floor, form.date);
    setErrors(validationErrors);
    setSubmitError(null);
    if (Object.keys(validationErrors).length > 0) return;

    const booking: BookingCardProps = {
      desk: form.desk.trim(),
      // The API stores floors as labels like "Floor 7" (min 5 chars).
      floor: `Floor ${form.floor.trim()}`,
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
    setIsSubmitting(true);
    try {
      const response = await api.post<Booking>("/bookings", booking);
      onAdd(response.data);
      setForm(emptyForm);
    } catch (error) {
      lastSubmittedBooking.current = null;
      setSubmitError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
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
      <button type="submit" disabled={isSubmitting} style={{ padding: "8px 16px" }}>
        {isSubmitting ? "Saving..." : "Book desk"}
      </button>
      {submitError && (
        <div
          role="alert"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            border: "1px solid #b42318",
            borderRadius: 8,
            background: "#fef3f2",
            color: "#7a271a",
          }}
        >
          <span><strong>Booking not saved.</strong> {submitError}</span>
          <button
            type="button"
            onClick={() => setSubmitError(null)}
            aria-label="Dismiss error"
            style={{ background: "none", border: "none", color: "inherit", fontSize: 18, cursor: "pointer" }}
          >
            ×
          </button>
        </div>
      )}
    </form>
  );
}
