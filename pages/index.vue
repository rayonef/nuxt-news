<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex
        v-for="headline in headlines"
        :key="headline.id"
        xs12
        sm6
        md4
        lg3
      >
        <v-card hover ripple>
          <v-img v-if="headline.urlToImage" aspect-ratio="1.777" :src="headline.urlToImage" :alt="headline.title" />
          <v-card-title>
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
              <div class="caption">
                {{ headline.publishedAt }}
                <v-icon small>
                  alarm
                </v-icon>
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            {{ headline.description }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              icon
              @click="addHeadlineToFeed(headline)"
            >
              <v-icon :color="userFeed.findIndex(i => i.title === headline.title) > -1 ? 'green' : ''">
                bookmark
              </v-icon>
            </v-btn>
            <v-btn icon @click="saveHeadline(headline)">
              <v-icon>message</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['headlines', 'user', 'userFeed'])
  },
  async fetch({ store }) {
    await store.dispatch('loadHeadlines', `/api/top-headlines?country=${store.state.country}`)
    await store.dispatch('loadUserFeed')
  },
  methods: {
    async addHeadlineToFeed(headline) {
      if (this.user) {
        await this.$store.dispatch('addHeadlineToFeed', headline)
      }
    },
    async saveHeadline(headline) {
      await this.$store.dispatch('saveHeadline', headline)
        .then(() => {
          this.$router.push(`/headlines/${headline.slug}`)
        })
    }
  }
}
</script>

<style scoped>
  .news-title {
    text-decoration: none;
  }
</style>
