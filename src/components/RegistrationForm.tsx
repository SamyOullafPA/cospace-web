"use client";

import { useState, type SubmitEvent } from "react";
import type { BookingCardProps } from "./BookingCard";

type RegistrationFormProps = {
  onAdd: (booking: BookingCardProps) => void;
};

const emptyForm = { desk: "", floor: "", date: "" };

export default function RegistrationForm({ onAdd }: RegistrationFormProps) {
  const [form, setForm] = useState(emptyForm);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    // Stop the browser's full-page POST/reload so React keeps control of state.
    e.preventDefault();

    onAdd({
      desk: form.desk.trim(),
      floor: Number(form.floor),
      date: form.date,
      active: true,
    });
    setForm(emptyForm);
  }

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "end", marginBottom: 24 }}
    >
      <label>
        Desk
        <input
          required
          value={form.desk}
          onChange={(e) => update("desk", e.target.value)}
          placeholder="e.g. D14"
          style={{ display: "block", padding: 8 }}
        />
      </label>
      <label>
        Floor
        <input
          required
          type="number"
          min={0}
          value={form.floor}
          onChange={(e) => update("floor", e.target.value)}
          style={{ display: "block", padding: 8, width: 80 }}
        />
      </label>
      <label>
        Date
        <input
          required
          type="date"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          style={{ display: "block", padding: 8 }}
        />
      </label>
      <button type="submit" style={{ padding: "8px 16px" }}>
        Book desk
      </button>
    </form>
  );
}
