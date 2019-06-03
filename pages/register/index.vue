<template>
  <v-layout column fill-height justify-center align-center>
    <v-card width="350">
      <v-card-title class="title">
        Register
      </v-card-title>
      <v-form @submit.prevent="validateForm">
        <v-card-text>
          <v-text-field
            v-model="email"
            v-validate="'required|email'"
            data-vv-name="email"
            :error-messages="errors.collect('email')"
            label="Email"
            append-icon="person"
          />
          <v-text-field
            v-model="password"
            v-validate="'required|min:6|max:20'"
            data-vv-name="password"
            :error-messages="errors.collect('password')"
            label="Password"
            append-icon="lock"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat nuxt to="/login" :disabled="loading">
            Go to Login
          </v-btn>
          <v-btn color="primary" type="submit" :loading="loading">
            Submit
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <v-snackbar
      v-model="isAuthenticated"
      :timeout="1500"
      bottom
    >
      Email succesfully registered
    </v-snackbar>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  $_veeValidate: {
    validator: 'new'
  },
  middleware: 'auth',
  data() {
    return {
      email: null,
      password: null
    }
  },
  computed: { ...mapGetters(['loading', 'isAuthenticated']) },
  watch: {
    isAuthenticated(val) {
      if (val) {
        setTimeout(() => this.$router.push('/'), 1500)
      }
    }
  },
  methods: {
    validateForm() {
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.registerUser()
        }
      })
    },
    async registerUser() {
      await this.$store.dispatch('authenticateUser', {
        action: 'register',
        email: this.email,
        password: this.password,
        returnSecureToken: true
      })
    }
  }
}
</script>
