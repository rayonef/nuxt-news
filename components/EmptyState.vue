<template>
  <v-layout class="ma-3" column justify-center>
    <v-icon size="100" :color="color">
      {{ icon }}
    </v-icon>
    <span class="title my-3 text-xs-center">{{ title }}</span>
    <span class="text-xs-center">{{ description }}</span>
  </v-layout>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'bookmark'
    }

  }
}
</script>
