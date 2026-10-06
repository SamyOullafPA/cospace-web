import Link from "next/link";
import { notFound } from "next/navigation";
import BookingCard from "@/components/BookingCard";
import { initialBookings } from "@/data/bookings";
import styles from "../../page.module.css";

export default async function BookingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const booking = initialBookings.find((booking) => String(booking.id) === id);

    if (!booking) {
        notFound();
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <section style={{ display: "grid", gap: 24 }}>
                    <h1>Booking #{booking.id}</h1>
                    <BookingCard
                        desk={booking.desk}
                        floor={booking.floor}
                        date={booking.date}
                        active={booking.active}
                    />
                    <Link href="/">Back to bookings</Link>
                </section>
            </main>
        </div>
    );
}