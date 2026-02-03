import { SectionConfig } from "./types";

export const dashboardConfig: SectionConfig[] = [
  {
    id: "home",
    name: "Home",
    type: "mixed",
    languages: ["en", "sv", "fr"],
    fields: [
      {
        id: "name",
        label: "Name",
        type: "text",
        required: false,
        placeholder: "Enter name",
      },
      {
        id: "tagline",
        label: "Tagline",
        type: "text",
        required: false,
        placeholder: "Enter hero tagline",
      },
      {
        id: "aboutTitle",
        label: "About Title",
        type: "text",
        required: false,
        placeholder: "Enter about title",
      },
      {
        id: "description",
        label: "Description",
        type: "textarea",
        required: false,
        placeholder: "Enter description",
      },
      {
        id: "aboutButtonText",
        label: "About Button Text",
        type: "text",
        required: false,
        placeholder: "Enter about button text",
      },
      {
        id: "listenTitle",
        label: "Listen Title",
        type: "text",
        required: false,
        placeholder: "Enter listen title",
      },
      {
        id: "listenButtonText",
        label: "Listen Button Text",
        type: "text",
        required: false,
        placeholder: "Enter listen button text",
      },
      {
        id: "youtubeUrl",
        label: "YouTube URL",
        type: "text",
        required: false,
        placeholder: "https://www.youtube.com/watch?v=... eller https://youtu.be/...",
      },
    ],
    sharedFields: [
      {
        id: "imageLarge",
        label: "Hero Image Wide Screens",
        type: "image",
        required: true,
        placeholder: "image url",
      },
      {
        id: "imageSmall",
        label: "Hero Image Small Screens",
        type: "image",
        required: true,
        placeholder: "image url",
      },
      {
        id: "profileImage",
        label: "Profile Image",
        type: "image",
        required: true,
        placeholder: "Add Profile Picture",
      },
      {
        id: "SecondImage",
        label: "Second Home Image",
        type: "image",
        required: true,
        placeholder: "Add a second image",
      },
    ],
  },
  {
    id: "schedule",
    name: "Schedule",
    type: "mixed",
    languages: ["en", "sv", "fr"],
    // Items är en delad lista som finns på toppnivån (tillsammans med språk-objekten)
    sharedLists: ["items"],
    fields: [
      {
        id: "scheduleTitle",
        label: "Schedule Title",
        type: "text",
        required: false,
        placeholder: "Enter schedule title",
      },
      {
        id: "scheduleUnderTitle",
        label: "Schedule Under Title",
        type: "text",
        required: false,
        placeholder: "Enter schedule under title",
      },
      {
        id: "scheduleBookTitle",
        label: "Schedule Book Title",
        type: "text",
        required: false,
        placeholder: "Enter schedule book title",
      },
      {
        id: "scheduleBookDesc",
        label: "Schedule Book Description",
        type: "textarea",
        required: false,
        placeholder: "Enter schedule book description",
      },
      {
        id: "scheduleBookEmail",
        label: "Schedule Book Email",
        type: "text",
        required: false,
        placeholder: "Enter schedule book email",
      },
      {
        id: "scheduleBookPhone",
        label: "Schedule Book Phone",
        type: "text",
        required: false,
        placeholder: "Enter schedule book phone",
      },
    ],
    listItemConfig: {
      fields: [
        {
          id: "id",
          label: "ID",
          type: "text",
          required: true,
          placeholder: "Unique ID (e.g., '1')",
        },
        {
          id: "title",
          label: "Title",
          type: "text",
          required: false,
          placeholder: "Event title (e.g., 'Lohengrin')",
        },
        {
          id: "location",
          label: "Location",
          type: "text",
          required: false,
          placeholder: "Event location (e.g., 'Malmö Opera')",
        },
        {
          id: "time",
          label: "Time",
          type: "text",
          required: false,
          placeholder: "Event time (e.g., '16:00')",
        },
        {
          id: "description",
          label: "Description",
          type: "textarea",
          required: false,
          placeholder: "Event description",
        },
        {
          id: "startDate",
          label: "Start Date",
          type: "date",
          required: false,
          nestedFields: [
            {
              id: "day",
              label: "Day",
              type: "number",
              required: false,
              placeholder: "Day",
            },
            {
              id: "month",
              label: "Month",
              type: "text",
              required: false,
              placeholder: "Month (e.g., 'October')",
            },
            {
              id: "year",
              label: "Year",
              type: "number",
              required: false,
              placeholder: "Year",
            },
          ],
        },
      ],
      // Description är språk-specifik, men listan är delad
      // Month översätts i frontend (behålls som engelska namn i databasen)
      localizedFields: ["description"],
    },
  },
  {
    id: "media",
    name: "Media",
    type: "mixed",
    languages: ["en", "sv", "fr"],
    fields: [
      {
        id: "mediaTitle",
        label: "Media Title",
        type: "text",
        required: false,
        placeholder: "Enter media title",
      },
      {
        id: "mediaSubtitle",
        label: "Media Subtitle",
        type: "text",
        required: false,
        placeholder: "Enter media subtitle",
      },
      {
        id: "videoSectionTitle",
        label: "VideoSection Title",
        type: "text",
        required: false,
        placeholder: "Videos Section Title",
      },
      {
        id: "musicSectionTitle",
        label: "Music Section Title",
        type: "text",
        required: false,
        placeholder: "Music Section Title",
      },
      {
        id: "gallerySectionTitle",
        label: "Gallery Section Title",
        type: "text",
        required: false,
        placeholder: "Gallery Section Title",
      },
    ],
    sharedLists: ["gallery", "music", "videos"], // Dessa listor är delade mellan alla språk
    listItemConfigs: {
      videos: {
        fields: [
          {
            id: "youtubeUrl",
            label: "YouTube URL",
            type: "text",
            required: false,
            placeholder: "https://www.youtube.com/watch?v=... eller https://youtu.be/...",
          },
          {
            id: "title",
            label: "Video Title",
            type: "text",
            required: false,
            placeholder: "Video title (e.g., 'Stars')",
          },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            required: false,
            placeholder: "Video description",
          },
        ],
        // Description är språk-specifik, men listan är delad
        localizedFields: ["description"],
      },
      music: {
        fields: [
          {
            id: "spotifyUrl",
            label: "Spotify URL",
            type: "text",
            required: false,
            placeholder:
              "https://open.spotify.com/track/... eller https://open.spotify.com/album/... eller https://open.spotify.com/playlist/...",
          },
          {
            id: "title",
            label: "Title",
            type: "text",
            required: false,
            placeholder: "Track/Album/Playlist title (e.g., 'Eric Schoeffler - Album')",
          },
        ],
      },
      gallery: {
        fields: [
          {
            id: "url",
            label: "Image",
            type: "image",
            required: true,
            placeholder: "Upload image",
          },
          {
            id: "alt",
            label: "Alt Text",
            type: "text",
            required: false,
            placeholder: "Image description",
          },
          // width och height sparas automatiskt i bakgrunden, behöver inte visas
        ],
      },
    },
  },
  {
    id: "about",
    name: "About",
    type: "mixed",
    languages: ["en", "sv", "fr"],
    fields: [
      {
        id: "aboutTitle",
        label: "About Title",
        type: "text",
        required: false,
        placeholder: "Enter about title",
      },
      {
        id: "aboutText",
        label: "About Text",
        type: "textarea",
        required: false,
        placeholder: "Enter about text",
      },
    ],
    sharedFields: [
      {
        id: "aboutImage",
        label: "About Image",
        type: "image",
        required: true,
        placeholder: "Enter about image",
      },
    ],
  },
  {
    id: "repertoire",
    name: "Repertoire",
    type: "mixed",
    languages: ["en", "sv", "fr"],
    sharedLists: ["availableNow", "inPreparation"],
    fields: [
      {
        id: "repertoireTitle",
        label: "Repertoire Title",
        type: "text",
        required: false,
        placeholder: "Enter Repertoir Title",
      },
      {
        id: "avaliableListTitle",
        label: "Avaliable List Title",
        type: "text",
        required: false,
        placeholder: "Enter Avaliable List Title",
      },
      {
        id: "avaliableListSubtitle",
        label: "Avaliable List Subtitle",
        type: "text",
        required: false,
        placeholder: "Enter Avaliable List Subtitle",
      },
      {
        id: "inPreparationListTitle",
        label: "In Preparation List Title",
        type: "text",
        required: false,
        placeholder: "Enter In Preparation List Title",
      },
      {
        id: "inPreparationListSubtitle",
        label: "In Preparation List Subtitle",
        type: "text",
        required: false,
        placeholder: "Enter In Preparation List Subtitle",
      },
    ],
    listItemConfigs: {
      availableNow: {
        fields: [
          {
            id: "composer",
            label: "Composer",
            type: "text",
            required: true,
            placeholder: "e.g. Bizet, Mozart, Verdi",
          },
          {
            id: "role",
            label: "Role",
            type: "text",
            required: true,
            placeholder: "e.g. Morales, Masetto",
          },
          {
            id: "opera",
            label: "Opera",
            type: "text",
            required: true,
            placeholder: "e.g. Carmen, Don Giovanni",
          },
        ],
      },
      inPreparation: {
        fields: [
          {
            id: "composer",
            label: "Composer",
            type: "text",
            required: true,
            placeholder: "e.g. Mozart, Bizet, Gounod",
          },
          {
            id: "role",
            label: "Role",
            type: "text",
            required: true,
            placeholder: "e.g. Leporello, Escamillo",
          },
          {
            id: "opera",
            label: "Opera",
            type: "text",
            required: true,
            placeholder: "e.g. Don Giovanni, Carmen",
          },
        ],
      },
    },
  },
  {
    id: "contact",
    name: "Contact",
    type: "mixed",
    languages: ["en", "sv", "fr"],
    fields: [
      {
        id: "contactText",
        label: "Contact Text",
        type: "textarea",
        required: false,
        placeholder: "Enter contact text",
      },
    ],
  },
];
