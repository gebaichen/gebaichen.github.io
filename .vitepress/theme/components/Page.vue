<script setup>
import {useData, withBase} from 'vitepress';
import {ref} from 'vue';

const {theme} = useData();
const posts_all = theme.value.posts;
const total = parseInt(posts_all.length);
console.log(total);
const pageSize = 6;
const page_num = total % pageSize === 0 ? total / pageSize : parseInt(total / pageSize) + 1;
const show_num = ref(1);
const posts_now = ref(theme.value.posts.slice(pageSize * (show_num.value - 1), pageSize * show_num.value));
const cut_page = (pageNum) => {
  show_num.value = pageNum;
  posts_now.value = theme.value.posts.slice(pageSize * (show_num.value - 1), pageSize * show_num.value);
};
</script>
<template>
  <div v-for="num in page_num">
    <div v-if="show_num === num">
      <div v-for="(article, index) in posts_now" :key="index" class="post-list">
        <div class="post-header">
          <div class="post-title">
            <a :href="withBase(article.regularPath)"> {{ article.frontMatter.title }}</a>
          </div>
        </div>
        <p class="describe" v-html="article.frontMatter.description"></p>
        <div class='post-info'>
          {{ article.frontMatter.date }} <span v-for="item in article.frontMatter.tags"><a
            :href="withBase(`/tags.html?tag=${item}`)"> {{ item }}</a></span>
        </div>
      </div>
      <div class="home-wrapper">
        <a
            class="home-item"
            :class="{ active: show_num === i }"
            v-for="i in page_num"
            :key="i"
            href="javascript:;"
            @click="cut_page(i)"
        >{{ i }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-list {
  border-bottom: 1px dashed var(--vp-c-divider-light);
  padding: 14px 0 14px 0;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-title {
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0.1rem 0;
}

.post-info {
  font-size: 12px;
}

.post-info span {
  display: inline-block;
  padding: 0 8px;
  background-color: var(--vp-c-bg-alt);
  margin-right: 10px;
  transition: 0.4s;
  border-radius: 2px;
  color: var(--vp-c-text-1);
}

.describe {
  font-size: 0.9375rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: var(--vp-c-text-2);
  margin: 10px 0;
  line-height: 1.5rem;
}

.home-item.active {
  background: var(--vp-c-text-1);
  color: var(--vp-c-text-inverse-1);
  border: 1px solid var(--vp-c-text-1) !important;
}

.home-item:first-child {
  border-bottom-left-radius: 2px;
  border-top-left-radius: 2px;
}

.home-item:last-child {
  border-bottom-right-radius: 2px;
  border-top-right-radius: 2px;
  border-right: 1px var(--vp-c-divider-light) solid;
}

.home-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.home-item {
  vertical-align: middle;
  margin: 4px 4px 10px;
  padding: 4px 8px;
  font-weight: bolder;
  display: inline-block;
  cursor: pointer;
  border-radius: 2px;
  line-height: 13px;
  font-size: 13px;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
}


@media screen and (max-width: 768px) {
  .post-list {
    padding: 14px 0 14px 0;
  }

  .post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .post-title {
    font-size: 1.0625rem;
    font-weight: 400;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    width: 17rem;
  }

  .describe {
    font-size: 0.9375rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    margin: 0.5rem 0 1rem;
  }
}
</style>