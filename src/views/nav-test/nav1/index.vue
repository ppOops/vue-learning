<template>
  <div class="className">
    <el-card style="marginTop: 20px">
      <h3>作用域插槽</h3>
      <links-list @hook:mounted="doSomething">
        <div
          slot="link"
          slot-scope="{ link, bookmarkButtonAttrs, bookmarkButtonEvents }"
        >
          <span v-if="link.bookmarked">icon</span>
          <a :href="link.href">{{ link.title }}</a>
          <button v-bind="bookmarkButtonAttrs" v-on="bookmarkButtonEvents">
            Bookmark
          </button>
        </div>
      </links-list>
    </el-card>

    <el-card style="marginTop: 20px">
      <h3>事件监听</h3>
      <my-input
        required
        placeholder
        class="theme-dark"
        :label="'Click Label'"
        @focus="onFocus"
        @input="onInput"
        @clicked="clickEvent"
      >
      </my-input>
    </el-card>

    <el-card style="marginTop: 20px">
      <h3>路由跳转</h3>
      <router-link
        :to="{
          path: '/table/complex-table',
          query: { orderId: '123', status: 1 }
        }"
        >复杂表单</router-link
      >
      <button @click="goToTable">复杂表单method跳转</button>
    </el-card>
  </div>
</template>

<script>
import LinksList from './components/LinksList.vue'
import MyInput from './components/MyInput.vue'

export default {
  name: 'Nav1',
  components: {
    LinksList,
    MyInput
  },
  methods: {
    // 监听@hook监听子组件的生命周期
    doSomething() {
      console.log('子组件挂载')
    },
    onFocus(e) {
      console.log(e.target.value)
    },
    onInput(e) {
      console.log(e.target.value)
    },
    clickEvent() {
      console.log('click event')
    },
    goToTable() {
      this.$router.push({
        // path: '/table/complex-table',
        name: 'ComplexTable', // name就是路由上配置的name属性
        query: {
          orderId: '123',
          status: '2'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
