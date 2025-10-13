import styles from "./page.module.css";
import Image from "next/image";

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: "Coming soon...",
      excerpt: "",
      image: "/Eric with Piano.jpg",
      /*  date: "",
      category: "", */
    },
    /* {
      id: 2,
      title: "Konsertserie i Stockholm",
      excerpt:
        "Under våren 2024 ger Eric Schoeffler en serie av intima konserter i Stockholms mest prestigefulla konsertsalar.",
      image: "/ProfilePicture Eric Shoeffler.png",
      date: "2024-02-20",
      category: "Konsert",
    },
    {
      id: 3,
      title: "Samarbete med Stockholm Music Group",
      excerpt:
        "Eric Schoeffler och Stockholm Music Group presenterar en ny serie av bröllopsmusik och specialarrangemang för privata evenemang.",
      image: "/la-boheme-quartet-large.avif",
      date: "2024-02-15",
      category: "Samarbete",
    },
    {
      id: 4,
      title: "Internationell turné planerad",
      excerpt:
        "Under sommaren 2024 kommer Eric Schoeffler att turnera i Europa med fokus på romantiska och klassiska verk.",
      image: "/Eric with Piano.jpg",
      date: "2024-02-10",
      category: "Turné",
    },
    {
      id: 5,
      title: "Nyinspelning av Schubert-lieder",
      excerpt:
        "Eric Schoeffler har påbörjat inspelning av Franz Schuberts mest kända lieder för kommande album som släpps hösten 2024.",
      image: "/ProfilePicture Eric Shoeffler.png",
      date: "2024-02-05",
      category: "Inspelning",
    }, */
  ];

  return (
    <div className={styles.newsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>News</h1>
        <p className={styles.subtitle}>The latest from Eric Schoeffler</p>
      </div>

      <div className={styles.newsContainer}>
        {newsItems.map((item) => (
          <article key={item.id} className={styles.newsItem}>
            <div className={styles.imageContainer}>
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={200}
                className={styles.newsImage}
              />
            </div>
            <div className={styles.contentContainer}>
              <div className={styles.meta}>
                {/* <span className={styles.category}>{item.category}</span>
                <span className={styles.date}>
                  {new Date(item.date).toLocaleDateString("sv-SE")}
                </span> */}
              </div>
              <h2 className={styles.newsTitle}>{item.title}</h2>
              <p className={styles.newsExcerpt}>{item.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
