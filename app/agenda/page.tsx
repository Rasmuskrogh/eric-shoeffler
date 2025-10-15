"use client";

import React from "react";
import styles from "./page.module.css";

// Events data structure
interface Event {
  id: string;
  title: string;
  location: string;
  time: string;
  description?: string;
  startDate: {
    day: number;
    month: string;
    year: number;
  };
  endDate?: {
    day: number;
    month: string;
    year: number;
  };
}

const events: Event[] = [
  {
    id: "1",
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A mysterious knight saves a princess but forbids her to ask his name — a romantic and fateful tale of faith and doubt. Composer: Richard Wagner.",
    startDate: { day: 16, month: "October", year: 2025 },
  },
  {
    id: "2",
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A mysterious knight saves a princess but forbids her to ask his name — a romantic and fateful tale of faith and doubt. Composer: Richard Wagner.",
    startDate: { day: 1, month: "November", year: 2025 },
  },
  {
    id: "3",
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "17:00",
    description:
      "A mysterious knight saves a princess but forbids her to ask his name — a romantic and fateful tale of faith and doubt. Composer: Richard Wagner.",
    startDate: { day: 6, month: "November", year: 2025 },
  },
  {
    id: "4",
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A mysterious knight saves a princess but forbids her to ask his name — a romantic and fateful tale of faith and doubt. Composer: Richard Wagner.",
    startDate: { day: 9, month: "November", year: 2025 },
  },
  {
    id: "5",
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A mysterious knight saves a princess but forbids her to ask his name — a romantic and fateful tale of faith and doubt. Composer: Richard Wagner.",
    startDate: { day: 15, month: "November", year: 2025 },
  },
  {
    id: "6",
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A mysterious knight saves a princess but forbids her to ask his name — a romantic and fateful tale of faith and doubt. Composer: Richard Wagner.",
    startDate: { day: 23, month: "November", year: 2025 },
  },
  {
    id: "7",
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A mysterious knight saves a princess but forbids her to ask his name — a romantic and fateful tale of faith and doubt. Composer: Richard Wagner.",
    startDate: { day: 30, month: "November", year: 2025 },
  },
  {
    id: "8",
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A mysterious knight saves a princess but forbids her to ask his name — a romantic and fateful tale of faith and doubt. Composer: Richard Wagner.",
    startDate: { day: 16, month: "December", year: 2025 },
  },
  {
    id: "9",
    title: "Lohengrin",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A mysterious knight saves a princess but forbids her to ask his name — a romantic and fateful tale of faith and doubt. Composer: Richard Wagner.",
    startDate: { day: 16, month: "December", year: 2025 },
  },
  {
    id: "10",
    title: "Faurés Requiem",
    location: "Brännkyrka kyrka",
    time: "16:00",
    description:
      "Featuring the serene and introspective bass solos in Fauré's beloved Requiem. Composer: Gabriel Fauré.",
    startDate: { day: 2, month: "November", year: 2025 },
  },
  {
    id: "11",
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 21, month: "January", year: 2026 },
  },
  {
    id: "12",
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 23, month: "January", year: 2026 },
  },
  {
    id: "13",
    title: "Carmen",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 25, month: "January", year: 2026 },
  },
  {
    id: "14",
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 27, month: "January", year: 2026 },
  },
  {
    id: "15",
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 29, month: "January", year: 2026 },
  },
  {
    id: "16",
    title: "Carmen",
    location: "Malmö Opera",
    time: "18:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 31, month: "January", year: 2026 },
  },
  {
    id: "17",
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 3, month: "February", year: 2026 },
  },
  {
    id: "18",
    title: "Carmen",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 8, month: "February", year: 2026 },
  },
  {
    id: "19",
    title: "Carmen",
    location: "Malmö Opera",
    time: "18:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 14, month: "February", year: 2026 },
  },
  {
    id: "20",
    title: "Carmen",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 22, month: "February", year: 2026 },
  },
  {
    id: "21",
    title: "Carmen",
    location: "Malmö Opera",
    time: "18:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 28, month: "February", year: 2026 },
  },
  {
    id: "22",
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 4, month: "March", year: 2026 },
  },
  {
    id: "23",
    title: "Carmen",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 8, month: "March", year: 2026 },
  },
  {
    id: "24",
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 10, month: "March", year: 2026 },
  },
  {
    id: "25",
    title: "Carmen",
    location: "Malmö Opera",
    time: "19:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 13, month: "March", year: 2026 },
  },
  {
    id: "26",
    title: "Carmen",
    location: "Malmö Opera",
    time: "16:00",
    description:
      "A passionate story of love, freedom, and jealousy, where the free-spirited Carmen seduces and destroys the tormented Don José. Composer: Georges Bizet.",
    startDate: { day: 15, month: "March", year: 2026 },
  },
];

// Sort events chronologically
const sortedEvents = events.sort((a, b) => {
  const dateA = new Date(
    a.startDate.year,
    getMonthIndex(a.startDate.month),
    a.startDate.day
  );
  const dateB = new Date(
    b.startDate.year,
    getMonthIndex(b.startDate.month),
    b.startDate.day
  );
  return dateA.getTime() - dateB.getTime();
});

// Helper function to convert month name to index
function getMonthIndex(month: string): number {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months.indexOf(month);
}

// Group events by year
const eventsByYear = sortedEvents.reduce((acc, event) => {
  const year = event.startDate.year;
  if (!acc[year]) {
    acc[year] = [];
  }
  acc[year].push(event);
  return acc;
}, {} as Record<number, Event[]>);

export default function AgendaPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Schedule</h1>
        <p className={styles.subtitle}>Upcoming concerts and events</p>

        <div className={styles.events}>
          {Object.keys(eventsByYear).map((year) => (
            <div key={year}>
              <h2 className={styles.yearHeader}>{year}</h2>
              {eventsByYear[parseInt(year)].map((event) => (
                <div key={event.id} className={styles.event}>
                  <div className={styles.eventDate}>
                    <span className={styles.day}>{event.startDate.day}</span>
                    <span className={styles.month}>
                      {event.startDate.month}
                    </span>
                    {event.endDate && (
                      <>
                        <span className={styles.day}>-</span>
                        <span className={styles.day}>{event.endDate.day}</span>
                        <span className={styles.month}>
                          {event.endDate.month}
                        </span>
                      </>
                    )}
                  </div>
                  <div className={styles.eventDetails}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventLocation}>{event.location}</p>
                    <p className={styles.eventTime}>{event.time}</p>
                    {event.description && (
                      <p className={styles.eventDescription}>
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.contactInfo}>
          <h2>Book a concert</h2>
          <p>
            Do you want to book Eric for an event? Contact us for more
            information about prices and availability.
          </p>
          <div className={styles.contactDetails}>
            <p>
              <strong>Email:</strong>{" "}
              {process.env.EMAIL_USER || "ecm.schoeffler@gmail.com"}
            </p>
            <p>
              <strong>Telefon:</strong> +46735362254
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
