import { SectionConfig } from "./types";

export const dashboardConfig: SectionConfig[] = [
  {
    id: "hero",
    name: "Hero Section",
    type: "text",
    // languages: ["en", "sv", "fr"],
    fields: [
      {
        id: "name",
        label: "Name",
        type: "text",
        required: true,
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
        id: "Image",
        label: "Hero Image",
        type: "image",
        required: true,
        placeholder: "image url",
      },
    ],
  },
  {
    id: "profileHome",
    name: "Profile Image",
    type: "image",
    fields: [
      {
        id: "profileImage",
        label: "Profile Image",
        type: "image",
        required: true,
        placeholder: "Add Profile Picture",
      },
    ],
  },
  {
    id: "aboutShort",
    name: "About Short",
    type: "text",
    fields: [
      {
        id: "title",
        label: "Title",
        type: "text",
        required: true,
        placeholder: "Enter title",
      },
      {
        id: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Enter description",
      },
      {
        id: "buttonText",
        label: "Button Text",
        type: "text",
        required: true,
        placeholder: "Enter button text",
      },
    ],
  },
  {
    id: "listenShort",
    name: "Listen Short",
    type: "text",
    fields: [
      {
        id: "title",
        label: "Title",
        type: "text",
        required: false,
        placeholder: "Enter title",
      },
      {
        id: "buttonText",
        label: "Button Text",
        type: "text",
        required: true,
        placeholder: "Enter button text",
      },
    ],
  },
  {
    id: "secondImageHome",
    name: "Second Home Image",
    type: "image",
    fields: [
      {
        id: "SecondImage",
        label: "Second Home Image",
        type: "image",
        required: true,
        placeholder: "Add a second image",
      },
    ],
  },
];
