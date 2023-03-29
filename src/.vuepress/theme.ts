import { navbar, sidebar } from "vuepress-theme-hope/perf";
import hopeTheme from "./theme/index.js";

const hostname = process.env.SITE_URL || "https://aklivity.gitub.io";

export default hopeTheme({
  hostname,
  author: {
    name: "Aklivity",
    url: "https://www.aklivity.io/",
  },
  
  pure: true,
  blog: {
    name: "blog name",
  },
  breadcrumb: false,
  favicon: "/favicon.ico",

  logo: "/aklivity-logo.svg",
  logoDark: "/aklivity-logo-source-white.svg",

  repo: "aklivity/blog",
  repoDisplay: false,

  locales: {
    "/": {
      // navbar
      navbar: navbar([
        { text: "Blog", icon: "book", link: "/blog/", },
      ]),

      // sidebar
      sidebar: sidebar({
        "/": [],
      }),
      // navbar: navbarConfig,
      // sidebar: sidebarConfig,

      footer:
        'Theme by <a href="https://theme-hope.vuejs.press">vuepress-theme-hope</a>',

      blog: {
        name:"Aklivity Blog",
        avatar: "/icon-gradient@2x.png",
        sidebarDisplay: "always",
      },
    },
  },

  plugins: {
    blog: {
      article: "/blog/",
      excerptLength: 0,
    },

    feed: {
      atom: true,
      json: true,
      rss: true,
    },

    mdEnhance: {
      align: true,
      attrs: true,
      chart: false,
      codetabs: true,
      container: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      tabs: true,
    },
  },
});
