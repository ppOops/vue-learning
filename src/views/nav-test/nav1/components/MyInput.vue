<template>
  <div>
    <!-- @xxx= => v-on:xxx= -->
    <!-- :xxx= => v-bind:xxx= -->
    <input
      type="text"
      class="form-control"
      @focus="$emit('focus', $event)"
      v-on:input="$emit('input', $event)"
    />
    <button @click="onClick()">{{ label }}</button>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String
    },
    text: {
      type: String,
      default: 'default Text'
    }
  },
  data() {
    return {}
  },
  methods: {
    onClick() {
      console.log('$props:', this.$props, this.$props.label)
      console.log('$listeners:', this.$listeners)
      this.$emit('clicked')
    }
  }
}
</script>
