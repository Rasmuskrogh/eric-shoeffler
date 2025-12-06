"use client";

import React from "react";
import styles from "../../app/schedule/page.module.css";
import { Event } from "../../types/interfaces";
import type { ContentData } from "@/components/AdminDashboard/types";

interface ScheduleClientProps {
  scheduleData: ContentData | null;
  locale?: string;
}

interface ScheduleItem {
  id: string;
  title: string;
  location: string;
  time?: string;
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

interface ScheduleData {
  scheduleTitle?: string;
  scheduleUnderTitle?: string;
  scheduleBookTitle?: string;
  scheduleBookDesc?: string;
  scheduleBookEmail?: string;
  scheduleBookPhone?: string;
  items?: ScheduleItem[];
}

export default function ScheduleClient({
  scheduleData,
  locale = "sv",
}: ScheduleClientProps) {
  if (!scheduleData) {
    return <div>Loading...</div>;
  }

  // Funktion för att översätta månadsnamn baserat på locale
  // Månader kommer från databasen som engelska namn, översätts här
  const translateMonth = (month: string): string => {
    const monthTranslations: Record<string, Record<string, string>> = {
      en: {
        January: "January",
        February: "February",
        March: "March",
        April: "April",
        May: "May",
        June: "June",
        July: "July",
        August: "August",
        September: "September",
        October: "October",
        November: "November",
        December: "December",
      },
      sv: {
        January: "Januari",
        February: "Februari",
        March: "Mars",
        April: "April",
        May: "Maj",
        June: "Juni",
        July: "Juli",
        August: "Augusti",
        September: "September",
        October: "Oktober",
        November: "November",
        December: "December",
      },
      fr: {
        January: "Janvier",
        February: "Février",
        March: "Mars",
        April: "Avril",
        May: "Mai",
        June: "Juin",
        July: "Juillet",
        August: "Août",
        September: "Septembre",
        October: "Octobre",
        November: "Novembre",
        December: "Décembre",
      },
    };
    const translations = monthTranslations[locale] || monthTranslations["sv"];
    return translations[month] || month;
  };

  const data = scheduleData as unknown as ScheduleData;
  const scheduleTitle = data.scheduleTitle || "";
  const scheduleUnderTitle = data.scheduleUnderTitle || "";
  const scheduleBookTitle = data.scheduleBookTitle || "";
  const scheduleBookDesc = data.scheduleBookDesc || "";
  const scheduleBookEmail = data.scheduleBookEmail || "";
  const scheduleBookPhone = data.scheduleBookPhone || "";

  const items: ScheduleItem[] = data.items || [];

  // Convert items to Event format
  const events: Event[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    location: item.location,
    time: item.time || "",
    description: item.description || "",
    startDate: {
      ...item.startDate,
      month: translateMonth(item.startDate.month),
    },
    endDate: item.endDate
      ? {
          ...item.endDate,
          month: translateMonth(item.endDate.month),
        }
      : undefined,
  }));

  // Helper function to convert month name to index (använder engelska namn för datum-beräkningar)
  function getMonthIndex(month: string): number {
    // Konvertera tillbaka till engelska namn för datum-beräkningar
    const englishMonths: Record<string, string> = {
      Januari: "January",
      Februari: "February",
      Mars: "March",
      April: "April",
      Maj: "May",
      Juni: "June",
      Juli: "July",
      Augusti: "August",
      September: "September",
      Oktober: "October",
      November: "November",
      December: "December",
      Janvier: "January",
      Février: "February",
      Avril: "April",
      Mai: "May",
      Juin: "June",
      Juillet: "July",
      Août: "August",
      Septembre: "September",
      Octobre: "October",
      Novembre: "November",
      Décembre: "December",
    };
    const englishMonth = englishMonths[month] || month;
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
    return months.indexOf(englishMonth);
  }

  // Get current date (start of today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Separate events into upcoming and past
  const upcomingEvents: Event[] = [];
  const pastEvents: Event[] = [];

  events.forEach((event) => {
    const eventDate = new Date(
      event.startDate.year,
      getMonthIndex(event.startDate.month),
      event.startDate.day
    );
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate >= today) {
      upcomingEvents.push(event);
    } else {
      pastEvents.push(event);
    }
  });

  // Sort upcoming events chronologically (ascending)
  const sortedUpcomingEvents = upcomingEvents.sort((a, b) => {
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

  // Sort past events chronologically (descending - most recent first)
  const sortedPastEvents = pastEvents.sort((a, b) => {
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
    return dateB.getTime() - dateA.getTime();
  });

  // Group upcoming events by year
  const upcomingEventsByYear = sortedUpcomingEvents.reduce((acc, event) => {
    const year = event.startDate.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, Event[]>);

  // Group past events by year
  const pastEventsByYear = sortedPastEvents.reduce((acc, event) => {
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
        {scheduleTitle && <h1 className={styles.title}>{scheduleTitle}</h1>}
        {scheduleUnderTitle && (
          <p className={styles.subtitle}>{scheduleUnderTitle}</p>
        )}

        <div className={styles.events}>
          {/* Upcoming Events */}
          {Object.keys(upcomingEventsByYear).length > 0 && (
            <>
              {Object.keys(upcomingEventsByYear).map((year) => (
                <div key={`upcoming-${year}`}>
                  <h2 className={styles.yearHeader}>{year}</h2>
                  {upcomingEventsByYear[parseInt(year)].map((event) => (
                    <div key={event.id} className={styles.event}>
                      <div className={styles.eventDate}>
                        <span className={styles.day}>
                          {event.startDate.day}
                        </span>
                        <span className={styles.month}>
                          {event.startDate.month}
                        </span>
                        {event.endDate && (
                          <>
                            <span className={styles.day}>-</span>
                            <span className={styles.day}>
                              {event.endDate.day}
                            </span>
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
            </>
          )}

          {/* Past Events */}
          {Object.keys(pastEventsByYear).length > 0 && (
            <>
              <h2 className={styles.pastEventsHeader}>Passerade evenemang</h2>
              {Object.keys(pastEventsByYear).map((year) => (
                <div key={`past-${year}`}>
                  <h3 className={styles.yearHeader}>{year}</h3>
                  {pastEventsByYear[parseInt(year)].map((event) => (
                    <div
                      key={event.id}
                      className={`${styles.event} ${styles.pastEvent}`}
                    >
                      <div className={styles.eventDate}>
                        <span className={styles.day}>
                          {event.startDate.day}
                        </span>
                        <span className={styles.month}>
                          {event.startDate.month}
                        </span>
                        {event.endDate && (
                          <>
                            <span className={styles.day}>-</span>
                            <span className={styles.day}>
                              {event.endDate.day}
                            </span>
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
            </>
          )}
        </div>

        {(scheduleBookTitle ||
          scheduleBookDesc ||
          scheduleBookEmail ||
          scheduleBookPhone) && (
          <div className={styles.contactInfo}>
            {scheduleBookTitle && <h2>{scheduleBookTitle}</h2>}
            {scheduleBookDesc && <p>{scheduleBookDesc}</p>}
            {(scheduleBookEmail || scheduleBookPhone) && (
              <div className={styles.contactDetails}>
                {scheduleBookEmail && (
                  <p>
                    <strong>Email:</strong> {scheduleBookEmail}
                  </p>
                )}
                {scheduleBookPhone && (
                  <p>
                    <strong>Telefon:</strong> {scheduleBookPhone}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
