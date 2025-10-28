"use client";

import React from "react";
import styles from "./page.module.css";
import { Event } from "../../types/interfaces";
import { useTranslations } from "next-intl";

export default function AgendaPage() {
  const t = useTranslations("Schedule");

  const events: Event[] = [
    {
      id: "1",
      title: "Lohengrin",
      location: "Malmö Opera",
      time: "16:00",
      description: t("lohengrinDesc"),
      startDate: { day: 16, month: t("october"), year: 2025 },
    },
    {
      id: "2",
      title: "Lohengrin",
      location: "Malmö Opera",
      time: "16:00",
      description: t("lohengrinDesc"),
      startDate: { day: 1, month: t("november"), year: 2025 },
    },
    {
      id: "3",
      title: "Lohengrin",
      location: "Malmö Opera",
      time: "17:00",
      description: t("lohengrinDesc"),
      startDate: { day: 6, month: t("november"), year: 2025 },
    },
    {
      id: "4",
      title: "Lohengrin",
      location: "Malmö Opera",
      time: "16:00",
      description: t("lohengrinDesc"),
      startDate: { day: 9, month: t("november"), year: 2025 },
    },
    {
      id: "5",
      title: "Lohengrin",
      location: "Malmö Opera",
      time: "16:00",
      description: t("lohengrinDesc"),
      startDate: { day: 15, month: t("november"), year: 2025 },
    },
    {
      id: "6",
      title: "Lohengrin",
      location: "Malmö Opera",
      time: "16:00",
      description: t("lohengrinDesc"),
      startDate: { day: 23, month: t("november"), year: 2025 },
    },
    {
      id: "7",
      title: "Lohengrin",
      location: "Malmö Opera",
      time: "16:00",
      description: t("lohengrinDesc"),
      startDate: { day: 30, month: t("november"), year: 2025 },
    },
    {
      id: "8",
      title: "Lohengrin",
      location: "Malmö Opera",
      time: "16:00",
      description: t("lohengrinDesc"),
      startDate: { day: 16, month: t("december"), year: 2025 },
    },
    {
      id: "9",
      title: "Lohengrin",
      location: "Malmö Opera",
      time: "16:00",
      description: t("lohengrinDesc"),
      startDate: { day: 16, month: t("december"), year: 2025 },
    },
    {
      id: "10",
      title: "Faurés Requiem",
      location: "Brännkyrka kyrka",
      time: "16:00",
      description: t("faureDesc"),
      startDate: { day: 2, month: t("november"), year: 2025 },
    },
    {
      id: "11",
      title: "Carmen",
      location: "Malmö Opera",
      time: "19:00",
      description: t("carmenDesc"),
      startDate: { day: 21, month: t("january"), year: 2026 },
    },
    {
      id: "12",
      title: "Carmen",
      location: "Malmö Opera",
      time: "19:00",
      description: t("carmenDesc"),
      startDate: { day: 23, month: t("january"), year: 2026 },
    },
    {
      id: "13",
      title: "Carmen",
      location: "Malmö Opera",
      time: "16:00",
      description: t("carmenDesc"),
      startDate: { day: 25, month: t("january"), year: 2026 },
    },
    {
      id: "14",
      title: "Carmen",
      location: "Malmö Opera",
      time: "19:00",
      description: t("carmenDesc"),
      startDate: { day: 27, month: t("january"), year: 2026 },
    },
    {
      id: "15",
      title: "Carmen",
      location: "Malmö Opera",
      time: "19:00",
      description: t("carmenDesc"),
      startDate: { day: 29, month: t("january"), year: 2026 },
    },
    {
      id: "16",
      title: "Carmen",
      location: "Malmö Opera",
      time: "18:00",
      description: t("carmenDesc"),
      startDate: { day: 31, month: t("january"), year: 2026 },
    },
    {
      id: "17",
      title: "Carmen",
      location: "Malmö Opera",
      time: "19:00",
      description: t("carmenDesc"),
      startDate: { day: 3, month: t("february"), year: 2026 },
    },
    {
      id: "18",
      title: "Carmen",
      location: "Malmö Opera",
      time: "16:00",
      description: t("carmenDesc"),
      startDate: { day: 8, month: t("february"), year: 2026 },
    },
    {
      id: "19",
      title: "Carmen",
      location: "Malmö Opera",
      time: "18:00",
      description: t("carmenDesc"),
      startDate: { day: 14, month: t("february"), year: 2026 },
    },
    {
      id: "20",
      title: "Carmen",
      location: "Malmö Opera",
      time: "16:00",
      description: t("carmenDesc"),
      startDate: { day: 22, month: t("february"), year: 2026 },
    },
    {
      id: "21",
      title: "Carmen",
      location: "Malmö Opera",
      time: "18:00",
      description: t("carmenDesc"),
      startDate: { day: 28, month: t("february"), year: 2026 },
    },
    {
      id: "22",
      title: "Carmen",
      location: "Malmö Opera",
      time: "19:00",
      description: t("carmenDesc"),
      startDate: { day: 4, month: t("march"), year: 2026 },
    },
    {
      id: "23",
      title: "Carmen",
      location: "Malmö Opera",
      time: "16:00",
      description: t("carmenDesc"),
      startDate: { day: 8, month: t("march"), year: 2026 },
    },
    {
      id: "24",
      title: "Carmen",
      location: "Malmö Opera",
      time: "19:00",
      description: t("carmenDesc"),
      startDate: { day: 10, month: t("march"), year: 2026 },
    },
    {
      id: "25",
      title: "Carmen",
      location: "Malmö Opera",
      time: "19:00",
      description: t("carmenDesc"),
      startDate: { day: 13, month: t("march"), year: 2026 },
    },
    {
      id: "26",
      title: "Carmen",
      location: "Malmö Opera",
      time: "16:00",
      description: t("carmenDesc"),
      startDate: { day: 15, month: t("march"), year: 2026 },
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
          <h2>{t("bookTitle")}</h2>
          <p>{t("bookDesc")}</p>
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
