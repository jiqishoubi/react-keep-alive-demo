<template>
  <slot></slot>
</template>

<script>
import useDocumentTitle from '@/hooks/router/useDocumentTitle'

export default {
  setup() {
    useDocumentTitle()
  },
}
</script>
