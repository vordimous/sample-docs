import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "vuepress-theme-hope",
      description: "A VuePress theme with tons of features✨",
    },
  },

  theme,
});
