<template>
    <div ref="gridContainer" class="article-wrapper test" :style="{'grid-template-columns': `repeat(${grid.cols})`, 'min-width': articleWidth }">
      <EmptyIcon v-if="!currentArticles.length"/>
      <ArticleItem v-for="({ info, path }, key) in currentArticles" 
        :key="path"
        :info="info"
        :path="path"
        :style="{ 'grid-column': gridColCalc(key, grid.cols), 'grid-row': gridRowCalc(key, grid.cols), 'min-width': articleWidth }"
      />
      <Pagination 
        :current="currentPage.value"
        :perPage="articlePerPage.value"
        :total="props.items.length"
        @onUpdateCurrentPage="updatePage"
      />
    </div>
  </template>
  
<script lang="ts" setup>
  import {
    type PropType,
    computed,
    ref,
    watch,
    onMounted,
    onUnmounted,
    reactive,
  } from "vue";
  import { useRoute, useRouter } from "vue-router";

  import ArticleItem from "@theme-hope/modules/blog/components/ArticleItem";
  import Pagination from "@theme-hope/modules/blog/components/Pagination";
  import { EmptyIcon } from "@theme-hope/modules/blog/components/icons/index";
  import { useBlogOptions } from "@theme-hope/modules/blog/composables/index";
  import { type ArticleInfo } from "./blog";

  const props = defineProps({
    items: {
      type: Array as PropType<{ path: string; info: ArticleInfo }[]>,
      default: () => [],
    }
  });
  const route = useRoute();
  const router = useRouter();

  const blogOptions = useBlogOptions();

  const currentPage = ref(1);

  const articlePerPage = computed(
    () => blogOptions.value.articlePerPage || 10
  );
  
  const currentArticles = computed(() =>
    props.items.slice(
      (currentPage.value - 1) * articlePerPage.value,
      currentPage.value * articlePerPage.value
    )
  );
  const updatePage = (page: number): void => {
    currentPage.value = page;

    const query = { ...route.query };

    if (query["page"] === page.toString() || (page === 1 && !query["page"]))
      return;
    if (page === 1) delete query["page"];
    else query["page"] = page.toString();

    void router.push({ path: route.path, query });
  };

  const gridContainer = ref(null);
  let cols = ref(1);
  let grid = reactive({ cols });
  const articleWidth = 300;
  const setColsOnWidth = (): void => {
    let width = gridContainer.value ? gridContainer.value.clientWidth : 1 ;

    if (width <= articleWidth) {
      grid.cols = 1;
    } else  {
      grid.cols = Math.floor(width/articleWidth);
    }
  };
  const gridRowCalc = (index: number, cols: number): number => Math.floor(index/cols) + 1;
  const gridColCalc = (index: number, cols: number): number => (index % cols) + 1;

  onMounted(() => {
    const { page } = route.query;

    updatePage(page ? Number(page) : 1);

    watch(currentPage, () => {
      // list top border distance
      const distance =
        document.querySelector("#article-list")!.getBoundingClientRect().top +
        window.scrollY;

      setTimeout(() => {
        window.scrollTo(0, distance);
      }, 100);
    });
    window.addEventListener("resize", setColsOnWidth);
    setColsOnWidth();
  });
  onUnmounted(() => {
    window.removeEventListener("resize", setColsOnWidth);
  });
</script>
<style lang="scss">
  
  .article-wrapper {
    text-align: center;
    display: grid;
    gap: 10px;
    grid-auto-rows: minmax(100px, auto);

    @media (max-width: 780px) {
      display: block;
    }
  }
  
  .article {
    position: relative;
  
    box-sizing: border-box;
  
    width: 100%;
    margin: 0 auto 1.25rem;
    padding: 1rem 1.25rem;
    border: 1px solid var(--c-border);
    border-radius: 0.4rem;
    color: var(--c-text);
  
    text-align: left;
  
    @media (max-width: 419px) {
      border-radius: 0;
    }
  
    &:hover {
      cursor: pointer;
    }
  
    .title {
      position: relative;
  
      display: inline-block;
  
      font-size: 1.28rem;
      line-height: 2rem;
  
      &::after {
        content: "";
  
        position: absolute;
        bottom: 0;
        left: 0;
  
        width: 100%;
        height: 2px;
  
        background: var(--c-brand);
  
        visibility: hidden;
  
        transition: transform 0.3s ease-in-out;
        transform: scaleX(0);
      }
  
      &:hover {
        &::after {
          visibility: visible;
          transform: scaleX(1);
        }
      }
  
      a {
        color: inherit;
      }
    }
  
    .article-info {
      display: flex;
      flex-shrink: 0;
  
      > span {
        margin-right: 0.5em;
        line-height: 1.8;
      }
    }
  
    .excerpt {
      h1 {
        display: none;
      }
  
      h2 {
        font-size: 1.2em;
      }
  
      h3 {
        font-size: 1.15em;
      }
    }
  }
</style>