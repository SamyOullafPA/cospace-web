import BookingList from "@/components/BookingList";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>My Bookings</h1>
        <BookingList />
      </main>
    </div>
  );
}
