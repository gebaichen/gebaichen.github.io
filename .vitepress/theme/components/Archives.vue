<template>
    <div v-for="yearList in data">
        <div class="year">
            {{ yearList[0].frontMatter.date.split('-')[0] }}
        </div>
        <a :href="withBase(article.regularPath)" v-for="(article, index) in yearList" :key="index" class="posts">
            <div class="post-container">
                <div class="post-dot"></div>
                {{ article.frontMatter.title }}
            </div>
            <div class="date-archives">{{ article.frontMatter.date.slice(5) }}</div>
        </a>
    </div>
</template>

<script lang="ts" setup>
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { useYearSort } from '../functions'

const { theme } = useData()
const data = computed(() => useYearSort(theme.value.posts))
</script>

<style scoped>
.year {
    padding: 14px 0 8px 0;
    font-size: 1.25rem;
    font-weight: 500;
}
/*tags and archives page style*/
.posts {
    padding: 4px 0 4px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.post-dot {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 3px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--vp-c-brand);
}

.post-container {
    color: var(--vp-c-text-2);
    font-size: 0.9375rem;
    font-weight: 400;
}

.post-container:hover {
    color: var(--vp-c-brand);
}
</style>
