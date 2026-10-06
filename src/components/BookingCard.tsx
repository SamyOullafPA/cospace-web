import Link from "next/link";
import styles from "./BookingCard.module.css";

export type BookingCardProps = {
  desk: string;
  floor: number;
  date: string;
  active: boolean;
};

export default function BookingCard({
  id,
  desk,
  floor,
  date,
  active,
}: BookingCardProps & { id?: number }) {
  const card = (
    <article className={`${styles.card} ${active ? styles.active : styles.inactive}`}>
      <header className={styles.header}>
        <h2 className={styles.desk}>Desk {desk}</h2>
        <span className={styles.badge}>{active ? "Active" : "Inactive"}</span>
      </header>
      <dl className={styles.details}>
        <dt>Floor</dt>
        <dd>{floor}</dd>
        <dt>Date</dt>
        <dd>{date}</dd>
      </dl>
    </article>
  );

  return id === undefined ? card : (
    <Link
      href={`/bookings/${id}`}
      className={styles.link}
      aria-label={`View booking ${id} for desk ${desk}`}
    >
      {card}
    </Link>
  );
}
