import { getDirname, path } from "@vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";
import type { ThemeOptions } from "vuepress-theme-hope";

const __dirname = getDirname(import.meta.url);

export default (options: ThemeOptions) => ({
  name: "vuepress-theme-local",

  extends: hopeTheme(options),

  alias: {
    // set alias for replaceable components
    '@theme-hope/modules/blog/components/ArticleList': path.resolve(__dirname, './components/ArticleList.vue'),
    '@theme-hope/modules/blog/components/ArticleItem': path.resolve(__dirname, './components/ArticleItem.vue'),
  },

});