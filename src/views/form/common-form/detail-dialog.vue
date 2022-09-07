<template>
  <el-dialog
    title="我是标题"
    :visible.sync="visible"
    :direction="direction"
    :before-close="handleClose"
  >
    <span>我来啦!</span>
  </el-dialog>
</template>

<script>
import popup from '@/mixins/popup'

export default {
  mixins: [popup],
  data() {
    return {
      direction: 'rtl'
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          this.visible = false
          done()
        })
        .catch(() => {})
    }
  }
}
</script>
