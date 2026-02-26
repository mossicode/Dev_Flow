import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...createdAts) {
  return twMerge(clsx(createdAts));
}

export const getTimeStamp = (createdAt: Date | string) => {
  const date = new Date(createdAt)
  const now = new Date();
  // const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "just now";

  // const now = new Date();
  const secondsAgo = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

 const techDescriptions = {
  javascript: "A versatile scripting language used to build interactive web applications on the client and server.",
  typescript: "A typed superset of JavaScript that improves code safety, tooling, and maintainability.",
  react: "A component-based UI library for building fast and reusable frontend interfaces.",
  nextjs: "A React framework for full-stack apps with routing, server rendering, and API support.",
  nodejs: "A JavaScript runtime that lets you run JS on the server for backend development.",
  express: "A minimal Node.js web framework for building APIs and server-side applications.",
  mongodb: "A document-oriented NoSQL database designed for flexible and scalable data storage.",
  mongoose: "An ODM for MongoDB in Node.js that provides schemas, validation, and query helpers.",
  tailwindcss: "A utility-first CSS framework for building custom UI designs quickly.",
  html: "The standard markup language used to structure content on the web.",
  css: "A stylesheet language used to control layout, colors, spacing, and visual design on web pages.",
  git: "A distributed version control system used to track code changes and collaborate safely.",
};

export const getTechDescription = (tech: string) => {
  if (!tech) return "";
  return techDescriptions[tech.toLowerCase()] ?? "";
};
