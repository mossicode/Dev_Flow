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

  if (secondsAgo < 60) return "just now";

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
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

  c: "A powerful low-level programming language widely used for system and embedded development.",
  cpp: "An extension of C that supports object-oriented programming and high-performance applications.",
  csharp: "A modern object-oriented language developed by Microsoft for .NET applications.",
  java: "A widely used object-oriented programming language designed for cross-platform applications.",
  python: "A high-level programming language known for simplicity and strong support in AI and data science.",
  go: "A fast and efficient programming language developed by Google for scalable backend systems.",
  rust: "A systems programming language focused on safety, speed, and memory management.",
  kotlin: "A modern language used mainly for Android development and backend services.",
  swift: "A programming language developed by Apple for iOS and macOS applications.",
  dart: "A language developed by Google mainly used with Flutter for cross-platform apps.",
  php: "A server-side scripting language widely used for web development.",
  ruby: "A dynamic language known for simplicity and productivity, used in Ruby on Rails.",
  scala: "A JVM language that combines object-oriented and functional programming.",
  r: "A programming language designed for statistical computing and data analysis.",
  matlab: "A language used for numerical computing, simulations, and engineering tasks.",
  julia: "A high-performance language designed for numerical and scientific computing.",
  assembly: "A low-level programming language closely related to machine code.",
  bash: "A command-line scripting language used in Linux and Unix systems.",
  powershell: "A task automation and configuration language from Microsoft.",
  sql: "A standard language used to manage and query relational databases.",

  postgres: "A powerful open-source relational database known for reliability and advanced features.",
  mysql: "One of the most popular relational database management systems.",
  sqlite: "A lightweight relational database stored locally in a single file.",
  redis: "An in-memory data store used for caching, queues, and fast data access.",
  firebase: "A backend platform by Google providing databases, authentication, and hosting.",
  prisma: "A modern ORM for Node.js and TypeScript that simplifies database access.",
  sequelize: "A promise-based ORM for Node.js supporting multiple SQL databases.",
  supabase: "An open-source backend platform that provides database, auth, and APIs.",
  graphql: "A query language for APIs that allows clients to request specific data.",
  apollo: "A popular GraphQL client and server implementation.",

  vue: "A progressive JavaScript framework for building user interfaces.",
  angular: "A full-featured frontend framework developed by Google.",
  svelte: "A modern frontend framework that compiles components into efficient JavaScript.",
  remix: "A full-stack React framework focused on web standards and performance.",
  astro: "A modern static site builder optimized for fast content-driven websites.",
  nuxt: "A framework built on Vue.js for creating server-rendered applications.",
  gatsby: "A React-based framework for building static websites and apps.",
  vite: "A fast frontend build tool designed for modern web development.",
  webpack: "A powerful module bundler for JavaScript applications.",
  parcel: "A zero-configuration web application bundler.",

  bootstrap: "A popular CSS framework for building responsive websites quickly.",
  sass: "A CSS preprocessor that adds variables, nesting, and functions to CSS.",
  less: "A stylesheet language that extends CSS with dynamic features.",
  styledcomponents: "A library for styling React components using JavaScript.",
  chakraui: "A React component library focused on accessibility and developer experience.",
  materialui: "A React UI framework implementing Google's Material Design.",
  antDesign: "A UI design system and React component library for enterprise apps.",

  docker: "A platform for building, shipping, and running applications in containers.",
  kubernetes: "A system for automating deployment and scaling of containerized applications.",
  nginx: "A high-performance web server and reverse proxy.",
  apache: "A widely used open-source web server.",
  vercel: "A cloud platform optimized for deploying frontend applications.",
  netlify: "A platform for deploying and hosting modern web projects.",
  aws: "Amazon Web Services cloud platform offering scalable infrastructure.",
  azure: "Microsoft’s cloud computing platform for building and deploying applications.",
  googlecloud: "Google’s cloud infrastructure and computing services.",

  linux: "An open-source operating system widely used for servers and development.",
  ubuntu: "A popular Linux distribution used for development and servers.",
  debian: "A stable Linux distribution used for servers and software development.",
  centos: "A Linux distribution often used for enterprise servers.",

  jira: "A project management and issue tracking tool widely used by development teams.",
  trello: "A visual project management tool based on boards and cards.",
  notion: "A productivity tool for documentation, notes, and project management.",
  slack: "A team communication platform used by developers and organizations.",

  figma: "A collaborative interface design tool used for UI/UX design.",
  adobeXD: "A design and prototyping tool for digital interfaces.",
  photoshop: "A powerful graphics editing software used for digital design.",
  illustrator: "A vector graphics design tool used for logos and illustrations.",

  tensorflow: "An open-source machine learning framework developed by Google.",
  pytorch: "A deep learning framework widely used in AI research.",
  scikitlearn: "A Python library for machine learning and data analysis.",
  pandas: "A Python library used for data manipulation and analysis.",
  numpy: "A Python library for numerical computing and array processing.",
  matplotlib: "A Python library for data visualization.",
  seaborn: "A statistical data visualization library based on matplotlib.",

  flutter: "A UI toolkit by Google for building cross-platform mobile apps.",
  reactnative: "A framework for building mobile apps using React.",
  ionic: "A framework for building hybrid mobile apps using web technologies.",
  electron: "A framework for building desktop apps using JavaScript and web technologies.",

  blockchain: "A decentralized ledger technology used for secure transactions.",
  solidity: "A programming language used for writing smart contracts on Ethereum.",
  web3: "A set of technologies enabling decentralized web applications.",

  testinglibrary: "A set of utilities for testing UI components in web applications.",
  jest: "A JavaScript testing framework developed by Facebook.",
  mocha: "A flexible JavaScript testing framework.",
  chai: "An assertion library used with JavaScript testing frameworks.",
  cypress: "An end-to-end testing framework for modern web applications.",
  playwright: "A browser automation library used for testing web apps."
};

export const getTechDescription = (tech: string) => {
  if (!tech) return "";
  return techDescriptions[tech.toLowerCase()] ?? "";
};
export const formatNumber=(number:number)=>{
  if(number>=1000000){
    return (number / 1000000 ).toFixed(1) + "M"
  }else if(number >=1000){
    return (number/1000).toFixed(1) + "K"
  }else{
    return number.toString()
  }
}
