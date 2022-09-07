<!--作用域插槽 https://juejin.cn/post/6844903848050589704 -->
<template>
  <ul>
    <li v-for="link in links" :key="link.key">
      <slot
        name="link"
        :link="link"
        :bookmark="bookmark"
        :bookmarkButtonAttrs="{
          style: [link.bookmarked ? { display: none } : {}]
        }"
        :bookmarkButtonEvents="{
          click: () => bookmark(link)
        }"
      ></slot>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      links: [
        { href: 'http://...', title: 'First Link', bookmarked: true, key: 0 },
        { href: 'http://...', title: 'Second Link', bookmarked: false, key: 1 }
      ]
    }
  },
  methods: {
    bookmark(link) {
      link.bookmarked = !link.bookmarked
    }
  }
}
</script>
