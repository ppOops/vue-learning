<template>
  <div class="pageMain">
    <transition name="fade-page" mode="out-in">
      <div v-if="$route.meta.noCache">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
      <router-view v-if="!$route.meta.noCache"></router-view>
    </transition>
  </div>
</template>
<script>
export default {}
</script>
