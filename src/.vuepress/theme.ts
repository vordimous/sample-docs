import { hopeTheme, navbar, sidebar } from "vuepress-theme-hope";


export default hopeTheme({
  hostname: "localhost",

  blog: {
    name: "VuePress Theme Hope",
  },

  locales: {
    "/": {
      // navbar
      navbar: navbar([
        { text: "Articles", icon: "book", link: "/articles/", },
      ]),

      // sidebar
      sidebar: sidebar({
        "/": [
        ],
      }),
    },
  },

  plugins: {
    blog: true,
  },
});
