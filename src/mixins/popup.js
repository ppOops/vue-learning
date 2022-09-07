export default {
  model: {
    prop: 'show',
    event: 'toggle'
  },
  props: {
    show: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  computed: {
    visible: {
      get: function() {
        return this.show
      },
      set: function(val) {
        this.$emit('toggle', val)
      }
    }
  }
}
