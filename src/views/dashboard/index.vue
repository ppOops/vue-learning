<template>
  <div class="homeBox">
    <!-- :is用于绑定动态组件。 -->
    <components :is="componentOn" />
  </div>
</template>

<script>
import adminComponent from './admin'
import userComponent from './user'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userName']),
    componentOn() {
      if (this.userName === 'admin') {
        return 'adminComponent'
      } else {
        return 'userComponent'
      }
    }
  },
  components: {
    adminComponent,
    userComponent
  }
}
</script>
