import { initialBookings, type Booking } from "@/data/bookings";
import styles from "./BookingsTable.module.css";

type BookingsTableProps = {
  bookings?: readonly Booking[];
};

export default function BookingsTable({
  bookings = initialBookings,
}: BookingsTableProps) {
  return (
    <div
      className={styles.container}
      role="region"
      aria-label="Desk bookings"
      tabIndex={0}
    >
      <table className={styles.table}>
        <caption>Desk bookings</caption>
        <thead>
          <tr>
            <th scope="col">Desk</th>
            <th scope="col">Floor</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={4}>No bookings available.</td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <th scope="row">{booking.desk}</th>
                <td>{booking.floor}</td>
                <td>
                  <time dateTime={booking.date}>{booking.date}</time>
                </td>
                <td>
                  <span className={booking.active ? styles.active : styles.inactive}>
                    {booking.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}