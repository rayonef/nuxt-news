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

      <!-- Default Markup (if Feed Empty) -->
      <EmptyState
        v-if="userFeed.length === 0 && !user"
        icon="bookmark_border"
        color="primary"
        title="Nothing in Feed"
        description="Login to bookmark headlines"
      />

      <EmptyState
        v-else-if="userFeed.length === 0"
        icon="bookmark_border"
        color="primary"
        title="Nothing in Feed"
        description="Anything you bookmark will be safely stored here"
      />

      <!-- Feed content -->
      <v-list v-else three-line>
        <v-list-tile v-for="headline in userFeed" :key="headline.id" avatar>
          <v-list-tile-avatar>
            <img :src="headline.urlToImage" :alt="headline.title">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ headline.title }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ headline.source.name }}</v-list-tile-sub-title>
            <v-list-tile-sub-title style="cursor: pointer;" @click="saveHeadline(headline)">
              View Comments
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon ripple @click="removeHeadlineFromFeed(headline)">
              <v-icon color="grey lighten-1">
                delete
              </v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
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
          <v-btn flat @click="logoutUser">
            Logout
          </v-btn>
        </template>
        <template v-else>
          <v-btn flat nuxt to="/login">
            Login
          </v-btn>
          <v-btn flat nuxt to="/register">
            Register
          </v-btn>
        </template>

        <v-btn flat @click="showSearchDialog = true">
          Search
        </v-btn>
        <v-btn flat @click="rightDrawer = true">
          Categories
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-dialog v-model="showSearchDialog" max-width="350">
      <v-card>
        <v-card-title class="title">
          Search Headlines
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="query"
            label="search Term(s)"
            placeholder="Use quotes for exact matches, AND / OR / NOY for multiple terms"
            counter="30"
          />
          <DatePicker
            v-model="fromDate"
            label="Starting date (optional)"
          />
          <DatePicker
            v-model="toDate"
            label="Ending date (optional)"
          />
          <v-select
            v-model="sortBy"
            :items="sortingOptions"
            label="Sort by"
            item-text="name"
            item-value="value"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="showSearchDialog = false">
            Cancel
          </v-btn>
          <v-btn flat color="primary" @click="searchHeadlines">
            Search
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  components: {
    EmptyState: () => import('@/components/EmptyState'),
    DatePicker: () => import('@/components/DatePicker')
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      rightDrawer: false,
      showSearchDialog: false,
      query: '',
      fromDate: null,
      toDate: null,
      sortBy: null,
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
      ],
      sortingOptions: [
        { name: 'Newest (Default)', value: 'publishedAt' },
        { name: 'Relevant', value: 'relevancy' },
        { name: 'Popular', value: 'popularity' }
      ]
    }
  },
  computed: {
    ...mapGetters(['category', 'loading', 'country', 'isAuthenticated', 'user', 'userFeed'])
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
    },
    async removeHeadlineFromFeed(headline) {
      await this.$store.dispatch('removeHeadlineFromFeed', headline)
    },
    async searchHeadlines() {
      await this.$store.dispatch('loadHeadlines', `/api/everything?q=${this.query}&from=${this.dateToISOString(this.fromDate)}$to=${this.dateToISOString(this.toDate)}&sortBy=${this.sortBy}`)
      this.showSearchDialog = false
    },
    async saveHeadline(headline) {
      await this.$store.dispatch('saveHeadline', headline)
        .then(() => {
          this.$router.push(`/headlines/${headline.slug}`)
        })
    },
    logoutUser() {
      this.$store.dispatch('logoutUser')
    },
    dateToISOString(date) {
      if (date) {
        return new Date(date).toISOString()
      }
    }
  }
}
</script>
