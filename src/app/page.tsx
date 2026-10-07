"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BaseModal from "@/components/BaseModal";
import BookingCard from "@/components/BookingCard";
import RegistrationForm from "@/components/RegistrationForm";
import { isColleagueOpportunity, isSameBooking, type ColleagueOpportunity } from "@/data/bookings";
import styles from "./dashboard.module.css";

export default function Home() {
  const [bookings, setBookings] = useState<ColleagueOpportunity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookings() {
      try {
        const response = await fetch("http://localhost:5000/bookings", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Could not load bookings (${response.status}).`);
        }

        const payload: unknown = await response.json();
        const data: unknown = payload !== null && typeof payload === "object" && "data" in payload
          ? payload.data
          : payload;
        if (!Array.isArray(data) || !data.every(isColleagueOpportunity)) {
          throw new Error("The server returned invalid booking data.");
        }
        const opportunities: ColleagueOpportunity[] = data;
        if (!controller.signal.aborted) setBookings(opportunities);
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error instanceof Error ? error.message : "Could not load bookings.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadBookings();
    return () => controller.abort();
  }, []);

  function addBooking(booking: ColleagueOpportunity) {
    setBookings((previous) => previous.some((existing) => isSameBooking(existing, booking))
      ? previous
      : [...previous, booking]);
    setIsModalOpen(false);
  }

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar} aria-label="Dashboard sidebar">
        <h2 className={styles.sidebarTitle}>Workspace</h2>
        <nav className={styles.navigation} aria-label="Dashboard navigation">
          <Link href="/" aria-current="page">Dashboard</Link>
          <Link href="#desk-bookings">Bookings</Link>
        </nav>
      </aside>
      <main className={styles.main} id="dashboard-content" tabIndex={-1}>
        <div className={styles.toolbar}>
          <h1>My Bookings</h1>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={isLoading || Boolean(error)}
            onClick={() => setIsModalOpen(true)}
          >
            Book a desk
          </button>
        </div>
        <section id="desk-bookings" className={styles.bookings} aria-label="Bookings">
          {isLoading ? (
            <p role="status">Loading...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {bookings.map((booking) => (
                <BookingCard key={booking.id} {...booking} />
              ))}
            </div>
          )}
        </section>
      </main>
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book a desk"
      >
        <RegistrationForm onAdd={addBooking} bookings={bookings} />
      </BaseModal>
    </div>
  );
}
