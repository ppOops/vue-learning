export default {
  methods: {
    scrollToError() {
      const el = document.querySelectorAll('.el-form-item__error')[0]
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }
}
