<template>
  <div class="article-item">
    <article @click="$router.push(path)" class="article" vocab="https://schema.org/" typeof="Article">
      <StickyIcon v-if="sticky"/>
      <figure v-if="cover" class="cover">
        <img :src="cover" :alt="title">
      </figure>
      <header class="title">
        <span property="headline">{{ title }}</span>
        <meta v-if="cover" property="image" content="{{ cover }}">
      </header>
      <div v-if="excerpt" class="article-excerpt" :innerHTML="excerpt"/>
      <hr class="hr">
      <PageInfo :info="articleInfo" />
    </article>

  </div>
  
</template>
  
  <script lang="ts" setup>
  import { type PropType, toRef } from "vue";
  import { type ArticleInfo, ArticleInfoType } from "./blog";
import { useArticleInfo } from "@theme-hope/modules/blog/composables/index";
import {
  // SlideIcon,
  StickyIcon,
} from "@theme-hope/modules/blog/components/icons/index";
import PageInfo from "@theme-hope/modules/info/components/PageInfo";

  const props = defineProps({
    info: {
      type: Object as PropType<ArticleInfo>,
      required: true,
    },
    path: { type: String, required: true },
  },);
  const info = toRef(props, "info");
  const title = props.info[ArticleInfoType.title];
  const sticky = props.info[ArticleInfoType.sticky];
  const type = props.info[ArticleInfoType.type];
  const cover = props.info[ArticleInfoType.cover];
  const excerpt = props.info[ArticleInfoType.excerpt];

  const { info: articleInfo } = useArticleInfo(props);
  </script>
  <style lang="scss">
  .article-item {
    position: relative;
  
    box-sizing: border-box;
  
    width: 100%;
    margin: 0 auto 1.25rem;
  
    text-align: start;
    overflow-wrap: break-word;
  
    @media (max-width: hope-config.$pad) {
      margin: 0 auto 1rem;
    }
  
    &:last-child {
      margin-bottom: 0;
    }
  
    .article {
      display: block;
  
      padding: 0.75rem 1.25rem;
      border-radius: 0.4rem;
  
      background: var(--bg-color-float);
      color: inherit;
      box-shadow: 0 1px 3px 1px var(--card-shadow);
  
      transition: background var(--color-transition),
        box-shadow var(--color-transition);
  
      @media (max-width: hope-config.$pad) {
        padding: 0.75rem 1rem;
      }
  
      @media (max-width: hope-config.$mobile) {
        border-radius: 0;
      }
  
      &:hover {
        box-shadow: 0 2px 6px 2px var(--card-shadow);    
        opacity: 0.80;
      }
    }
  
    .sticky-icon {
      position: absolute;
      top: 0;
  
      // NOTE: Compatible with Android Wechat
      // inset-inline-end: 0;
      right: 0;
  
      width: 1.5rem;
      height: 1.5rem;
  
      color: var(--theme-color);
  
      #{hope-config.$rtl-selector} & {
        right: unset;
        left: 0;
      }
    }
    
    .cover {
      
      cursor: pointer;

      margin-block-start: 0;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      
      > img {
        max-width: 100%;
      }

    }

    .title {
      position: relative;
  
      display: inline-block;
  
      color: var(--text-color);
  
      font-size: 1.25rem;
      font-family: var(--font-family-heading);
      line-height: 1.6;
  
      cursor: pointer;
  
      &::after {
        content: "";
  
        position: absolute;
        bottom: 0;
        left: 0;
  
        width: 100%;
        height: 2px;
  
        background: var(--theme-color);
  
        visibility: hidden;
  
        transition: transform 0.3s ease-in-out;
        transform: scaleX(0);
      }

      a {
        color: inherit;
        font-weight: 600;
      }
  
      .lock-icon,
      .slides-icon {
        position: relative;
        bottom: -0.125em;
  
        display: inline-block;
        vertical-align: baseline;
  
        width: 1em;
        height: 1em;
        margin-inline-end: 0.25em;
  
        color: var(--theme-color);
      }
  
      > span {
        word-break: break-word;
      }
    }
  
    hr {
      margin-block-start: 0.375em;
      margin-block-end: 0.375em;
    }
  
    .page-info {
      > span {
        display: flex;
        flex-shrink: 0;
        align-items: center;
  
        margin-inline-end: 0.5em;
  
        line-height: 1.8;
  
        &::after {
          --balloon-font-size: 8px;
          padding: 0.3em 0.6em !important;
        }
      }
    }
  }
  
  .article-excerpt {
    overflow: hidden;
    line-height: 1.6;
    cursor: pointer;
  
    @media (max-width: hope-config.$pad) {
      font-size: 15px;
    }
  
    @media (max-width: hope-config.$mobile) {
      font-size: 14px;
    }
  
    h1 {
      display: none;
    }
  
    h2 {
      font-size: 1.4em;
    }
  
    h3 {
      font-size: 1.2em;
    }
  
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }
  
    // stylelint-disable selector-max-compound-selectors
    h1 + p {
      margin-top: 0.5em;
    }
    // stylelint-enable selector-max-compound-selectors
  
    p:first-child {
      margin-top: 0.5em;
    }
  
    p:last-child {
      margin-bottom: 0.5em;
    }
  
    // code block fix
    pre {
      margin: 0.85rem 0;
      padding: 1.25rem 1.5rem;
      line-height: 1.375;
    }
  
    // line number fix
    .line-numbers-mode {
      // stylelint-disable selector-max-compound-selectors
      pre {
        padding-left: calc(var(--line-numbers-width) + 1rem);
      }
      // stylelint-enable selector-max-compound-selectors
    }
  
    // hide code demo
    .code-demo-wrapper {
      display: none;
    }
  
    // hide external link
    .external-link-icon {
      display: none;
    }
  
    // footnote fix
    .footnote-anchor {
      display: none;
    }
  
    section.footnotes {
      display: none;
    }
  
    img {
      max-width: 100%;
    }
  
    figure {
      display: flex;
      flex-direction: column;
  
      width: auto;
      margin: 1rem auto;
  
      text-align: center;
  
      transition: transform var(--transform-transition);
  
      img {
        overflow: hidden;
        margin: 0 auto;
        border-radius: 8px;
      }
  
      figcaption {
        display: inline-block;
        margin: 6px auto;
        font-size: 0.8rem;
  
        &:only-child {
          display: none;
        }
      }
    }
  }
  </style>