"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

type BookingErrors = Partial<Record<"desk" | "floor" | "date", string>>;

export function validateBooking(desk: string, floor: string, date: string): BookingErrors {
	const errors: BookingErrors = {};

	if (desk.trim().length < 3) {
		errors.desk = "Desk name must be at least 3 characters long.";
	}
	if (!floor.trim() || !Number.isFinite(Number(floor)) || Number(floor) < 0) {
		errors.floor = "Enter a valid non-negative floor number.";
	}

	const bookingDate = new Date(`${date}T00:00:00`);
	const [year, month, day] = date.split("-").map(Number);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (
		!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
		Number.isNaN(bookingDate.getTime()) ||
		bookingDate.getFullYear() !== year ||
		bookingDate.getMonth() + 1 !== month ||
		bookingDate.getDate() !== day
	) {
		errors.date = "Enter a valid date.";
	} else if (bookingDate < today) {
		errors.date = "Date must be today or in the future.";
	}

	return errors;
}

export default function CreateBookingForm() {
	const [desk, setDesk] = useState("");
	const [floor, setFloor] = useState("");
	const [date, setDate] = useState("");
	const [errors, setErrors] = useState<BookingErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (isSubmitting) return;

		setSuccessMessage("");
		const validationErrors = validateBooking(desk, floor, date);
		setErrors(validationErrors);
		if (Object.keys(validationErrors).length > 0) return;

		setIsSubmitting(true);
		await new Promise<void>((resolve) => setTimeout(resolve, 2000));
		setDesk("");
		setFloor("");
		setDate("");
		setSuccessMessage("Booking submitted successfully.");
		setIsSubmitting(false);
	}

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.currentTarget;
		setSuccessMessage("");

		switch (name) {
			case "desk":
				setDesk(value);
				break;
			case "floor":
				setFloor(value);
				break;
			case "date":
				setDate(value);
				break;
		}
	}

	return (
		<form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
			<label style={{ display: "block" }}>
				Desk
				<input
					type="text" name="desk" value={desk} onChange={handleChange}
					disabled={isSubmitting} aria-invalid={Boolean(errors.desk)}
					aria-describedby={errors.desk ? "desk-error" : undefined}
					style={{ display: "block", border: `1px solid ${errors.desk ? "red" : "#767676"}` }}
				/>
			</label>
			{errors.desk && <p id="desk-error" role="alert" style={{ color: "red" }}>{errors.desk}</p>}
			<label style={{ display: "block" }}>
				Floor
				<input
					type="text" name="floor" value={floor} onChange={handleChange}
					disabled={isSubmitting} aria-invalid={Boolean(errors.floor)}
					aria-describedby={errors.floor ? "floor-error" : undefined}
					style={{ display: "block", border: `1px solid ${errors.floor ? "red" : "#767676"}` }}
				/>
			</label>
			{errors.floor && <p id="floor-error" role="alert" style={{ color: "red" }}>{errors.floor}</p>}
			<label style={{ display: "block" }}>
				Date
				<input
					type="date" name="date" value={date} onChange={handleChange}
					disabled={isSubmitting} aria-invalid={Boolean(errors.date)}
					aria-describedby={errors.date ? "date-error" : undefined}
					style={{ display: "block", border: `1px solid ${errors.date ? "red" : "#767676"}` }}
				/>
			</label>
			{errors.date && <p id="date-error" role="alert" style={{ color: "red" }}>{errors.date}</p>}
			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Submitting..." : "Submit booking"}
			</button>
			{successMessage && <p role="status">{successMessage}</p>}
		</form>
	);
}
