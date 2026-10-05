import styles from "./BookingCard.module.css";

export type BookingCardProps = {
  desk: string;
  floor: number;
  date: string;
  active: boolean;
};

export default function BookingCard({ desk, floor, date, active }: BookingCardProps) {
  return (
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
}
