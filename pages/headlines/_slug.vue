<template>
  <v-container>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm9 md7>
        <v-card>
          <v-img
            :src="headline.urlToImage"
            :alt="headline.title"
            height="300px"
            aspect-ratio="1.777"
          />
          <v-card-title class="title">
            <a class="news-title" :href="headline.title" target="_blank">{{ headline.title }}</a>
            <v-layout column class="px-2 mt-3">
              <div>
                {{ headline.source.name }}
                <v-icon small>
                  book
                </v-icon>
              </div>
              <div v-if="headline.author" class="caption">
                {{ headline.author }}
                <v-icon small>
                  face
                </v-icon>
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            {{ headline.description }}
          </v-card-text>
        </v-card>

        <v-btn
          color="primary"
          fab
          bottom
          right
          fixed
          @click="$router.go(-1)"
        >
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: { ...mapGetters(['headline']) },
  async fetch({ store, params }) {
    await store.dispatch('loadHeadline', params.slug)
  }

}
</script>

<style scoped>
  .news-title {
    text-decoration: none;
  }
</style>
