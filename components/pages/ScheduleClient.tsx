"use client";

import React from "react";
import styles from "../../app/schedule/page.module.css";
import { Event } from "../../types/interfaces";
import type { ContentData } from "@/components/AdminDashboard/types";

interface ScheduleClientProps {
  scheduleData: ContentData | null;
}

export default function ScheduleClient({ scheduleData }: ScheduleClientProps) {
  if (!scheduleData) {
    return <div>Loading...</div>;
  }

  const scheduleTitle = (scheduleData as any).scheduleTitle || "Schedule";
  const scheduleUnderTitle = (scheduleData as any).scheduleUnderTitle || "";
  const scheduleBookTitle = (scheduleData as any).scheduleBookTitle || "";
  const scheduleBookDesc = (scheduleData as any).scheduleBookDesc || "";
  const scheduleBookEmail = (scheduleData as any).scheduleBookEmail || "ecm.schoeffler@gmail.com";
  const scheduleBookPhone = (scheduleData as any).scheduleBookPhone || "+46735362254";
  
  const items = ((scheduleData as any).items as any[]) || [];
  
  // Convert items to Event format
  const events: Event[] = items.map((item) => ({
    id: item.id || "",
    title: item.title || "",
    location: item.location || "",
    time: item.time || "",
    description: item.description || "",
    startDate: item.startDate || { day: 0, month: "", year: 0 },
  }));

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
        <h1 className={styles.title}>{scheduleTitle}</h1>
        <p className={styles.subtitle}>{scheduleUnderTitle}</p>

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
                    {event.time && (
                      <p className={styles.eventTime}>{event.time}</p>
                    )}
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
          <h2>{scheduleBookTitle}</h2>
          <p>{scheduleBookDesc}</p>
          <div className={styles.contactDetails}>
            <p>
              <strong>Email:</strong> {scheduleBookEmail}
            </p>
            <p>
              <strong>Telefon:</strong> {scheduleBookPhone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

