<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      app
    >
      <v-toolbar>
        <v-toolbar-title>Personal Feed</v-toolbar-title>
      </v-toolbar>
      <v-progress-linear v-if="loading" class="mt-0" indeterminate height="5" />
      <v-container>
        <v-select
          :items="countries"
          label="Country"
          :value="country"
          item-text="name"
          item-value="value"
          @change="changeCountry"
        />
      </v-container>
      <!-- <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list> -->
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />

      <v-toolbar-title class="py-3 px-2" style="cursor: pointer;" @click="$router.push('/')">
        NuxtNews
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <template v-if="isAuthenticated">
          <v-btn flat class="text-lowercase">
            <v-avatar class="mr-2" size="28">
              <v-img :src="user.avatar" />
            </v-avatar>
            {{ user.email }}
          </v-btn>
          <v-btn flat>
            Logout
          </v-btn>
        </template>
        <template v-else>
          <v-btn flat nuxt to="login">
            Login
          </v-btn>
          <v-btn flat nuxt to="register">
            Register
          </v-btn>
        </template>

        <v-btn flat @click="rightDrawer = true">
          Categories
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
    <v-navigation-drawer
      v-model="rightDrawer"
      right
      temporary
      fixed
    >
      <v-toolbar>
        <v-toolbar-title>
          Categories
        </v-toolbar-title>
      </v-toolbar>
      <v-progress-linear v-if="loading" class="mt-0" indeterminate height="5" />

      <v-list>
        <v-list-tile
          v-for="(newsCategory, i) in newsCategories"
          :key="i"
          @click="loadCategory(newsCategory.path)"
        >
          <v-list-tile-action>
            <v-icon :color="newsCategory.path === category ? 'primary' : ''">
              {{ newsCategory.icon }}
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{ newsCategory.name }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      rightDrawer: false,
      newsCategories: [
        { name: 'Top Headlines', path: '', icon: 'today' },
        { name: 'Technology', path: 'technology', icon: 'keyboard' },
        { name: 'Business', path: 'business', icon: 'business_center' },
        { name: 'Entertainment', path: 'entertainment', icon: 'weekend' },
        { name: 'Health', path: 'health', icon: 'fastfood' },
        { name: 'Science', path: 'science', icon: 'fingerprint' },
        { name: 'Sports', path: 'sports', icon: 'golf_course' }
      ],
      countries: [
        { name: 'México', value: 'mx' },
        { name: 'United States', value: 'us' },
        { name: 'Canada', value: 'ca' },
        { name: 'Germany', value: 'de' },
        { name: 'Russia', value: 'ru' }
      ]
    }
  },
  computed: {
    ...mapGetters(['category', 'loading', 'country', 'isAuthenticated', 'user'])
  },
  methods: {
    async loadCategory(category) {
      this.$store.commit('setCategory', category)
      await this.$store.dispatch('loadHeadlines', `/api/top-headlines?country=${this.country}&category=${this.category}`)
      this.rightDrawer = false
    },
    async changeCountry(country) {
      this.$store.commit('setCountry', country)
      await this.$store.dispatch('loadHeadlines', `/api/top-headlines?country=${this.country}&category=${this.category}`)
      this.drawer = false
    }
  }
}
</script>
