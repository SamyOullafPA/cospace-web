"use client";

import { useState } from "react";
import Link from "next/link";
import BaseModal from "@/components/BaseModal";
import BookingsTable from "@/components/BookingsTable";
import RegistrationForm from "@/components/RegistrationForm";
import { initialBookings, type Booking } from "@/data/bookings";
import styles from "./dashboard.module.css";

export default function Home() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function addBooking(booking: Omit<Booking, "id">) {
    setBookings((previous) => [...previous, { ...booking, id: Date.now() }]);
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
            onClick={() => setIsModalOpen(true)}
          >
            Book a desk
          </button>
        </div>
        <section id="desk-bookings" className={styles.bookings} aria-label="Bookings">
          <BookingsTable bookings={bookings} />
        </section>
      </main>
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book a desk"
      >
        <RegistrationForm onAdd={addBooking} />
      </BaseModal>
    </div>
  );
}
