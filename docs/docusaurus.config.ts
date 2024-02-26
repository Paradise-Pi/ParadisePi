// eslint-disable-next-line import/no-unresolved
import { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const production = process.env.CONTEXT === "production"; //Netlify/Cloudflare Pages set environment variable "CONTEXT" to "production"/"deploy-preview"
const baseUrl = process.env.BASEURL ?? "/"; //Netlify/Cloudflare Pages set environment variable "BASEURL" to the base URL of the site

const config: Config = {
  title: "ParadisePi",
  tagline: "Facility control panel for sACN & OSC, in Electron.",
  url: process.env.CF_PAGES_URL ?? "http://localhost",
  baseUrl: baseUrl,
  noIndex: !production,
  onBrokenLinks: production ? "warn" : "throw",
  onBrokenMarkdownLinks: production ? "warn" : "throw",
  onDuplicateRoutes: production ? "warn" : "throw",
  favicon: "img/favicon.ico",
  organizationName: "Paradise-Pi",
  projectName: "ParadisePi",

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/Paradise-Pi/ParadisePi/tree/main/docs/",
          editCurrentVersion: true,
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          versions: {
            current: {
              label: "v2",
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themeConfig:
    {
      navbar: {
        title: "ParadisePi",
        logo: {
          alt: "ParadisePi Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "user-guide/intro",
            position: "left",
            label: "User Guide",
          },
          {
            href: "https://github.com/Paradise-Pi/ParadisePi/releases/latest",
            label: "Download",
            position: "left",
          },
          {
            href: "https://github.com/Paradise-Pi/ParadisePi",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [],
        copyright: `©2020-${new Date().getFullYear()} James Bithell & John Cherry`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      ...(!production && {
        announcementBar: {
          id: "dev_build", // Any value that will identify this message.
          content: "This is a draft version of our website",
          backgroundColor: "#fafbfc", // Defaults to `#fff`.
          textColor: "#091E42", // Defaults to `#000`.
          isCloseable: false,
        },
      }),
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
    },
  plugins: [
    [
      "@docusaurus/plugin-pwa",
      {
        debug: !production,
        offlineModeActivationStrategies: ["standalone", "queryString"],
        pwaHead: [
          {
            tagName: "link",
            rel: "icon",
            href: "/img/docusaurus.png",
          },
          {
            tagName: "link",
            rel: "manifest",
            href: "/manifest.json", // your PWA manifest
          },
          {
            tagName: "meta",
            name: "theme-color",
            content: "rgb(37, 194, 160)",
          },
        ],
      },
    ],
  ],
};

export default config;
