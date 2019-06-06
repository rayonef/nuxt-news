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
      </v-flex>
      <v-flex xs12 sm9 md7 class="mt-3">
        <!-- Comment form -->
        <v-form @submit.prevent="sendComment">
          <v-textarea
            v-model="text"
            box
            label="Enter your comment"
            :disabled="loading || !user"
          />
          <v-btn color="primary" type="submit" :disabled="loading || !user">
            Send Comment
          </v-btn>
        </v-form>
      </v-flex>

      <!-- Comments -->
      <v-flex xs12 sm9 md7 class="mt-3">
        <v-list three-line>
          <v-list-tile v-for="comment in headline.comments" :key="comment.id" avatar>
            <v-list-tile-avatar>
              <v-img :src="comment.user.avatar" :alt="comment.user.username" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ comment.user.username }} - <span class="caption">{{ comment.publishAt | timeAgo }}</span>
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ comment.text }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>{{ comment.likes }} likes</v-list-tile-action-text>
              <v-btn icon :disabled="loading || !user" @click="likeComment(comment.id)">
                <v-icon color="grey ligthen-1">
                  thumb_up
                </v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>

      <!-- FAB -->
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
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import uuid from 'uuid/v4'

export default {
  data() {
    return {
      text: ''
    }
  },
  computed: { ...mapGetters(['headline', 'user', 'loading']) },
  async fetch({ store, params }) {
    await store.dispatch('loadHeadline', params.slug)
  },
  methods: {
    async sendComment() {
      const comment = {
        id: uuid(),
        text: this.text,
        user: this.getCommentUserData(),
        publishAt: Date.now(),
        likes: 0
      }
      await this.$store.dispatch('sendComment', comment)
      this.text = ''
    },
    async likeComment(commentId) {
      await this.$store.dispatch('likeComment', commentId)
    },
    getCommentUserData() {
      const commentUserData = { ...this.user }
      commentUserData.username = commentUserData.email.split('@')[0]
      return commentUserData
    }
  }

}
</script>

<style scoped>
  .news-title {
    text-decoration: none;
  }
</style>
