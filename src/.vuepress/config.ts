import { defineUserConfig } from "@vuepress/cli";

import theme from "./theme.js";

export default defineUserConfig({

  locales: {
    "/": {
      lang: "en-US",
      title: "Blog",
      description: "The official aklivity blog",
    },
  },

  markdown: {
    code: {
      lineNumbers: 10,
    },
  },

  theme,
});
