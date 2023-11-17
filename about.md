# 关于

## 关于
....



<script setup>
import { VPTeamMembers } from 'vitepress/theme';

const members = [
  {
    avatar: '/images/quqi.jpg',
    name: 'quqi',
    title: 'Creator Developer',
    links: [
      { icon: 'github',link:'https://github.com/gebaichen/'},
      { icon: 'twitter'}
    ]
  },
];
</script>

## 我们的团队

跟我们出色的团队打个招呼吧。

<VPTeamMembers size="small" :members="members" />

## 讨论 | 建议箱

<Comment/>