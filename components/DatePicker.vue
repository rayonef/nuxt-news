<template>
  <v-menu
    ref="dateMenu"
    v-model="dateMenu"
    :disabled="disabled"
    lazy
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    full-width
    :nudge-right="40"
    min-width="290px"
    :return-value.sync="date"
  >
    <v-text-field
      slot="activator"
      :disabled="disabled"
      :label="label"
      :value="formattedDate"
      append-icon="event"
      :error-messages="messages"
      required
      readonly
    />
    <v-date-picker
      v-model="date"
      no-title
      scrollable
      locale="es"
      :min="min"
      :max="max"
      @change="handleChange"
      @input="handleInput"
    >
      <!-- <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="expiresMenu = false">Cancelar</v-btn>
      <v-btn flat color="primary" @click="$refs.expiresMenu.save(editedItem.expiresAt)">OK</v-btn> -->
    </v-date-picker>
  </v-menu>
</template>

<script>
// import moment from 'moment'

export default {
  $_veeValidate: {
    // value getter
    value() {
      return this.$el.value
    },
    // name getter
    name() {
      return this.name
    }
  },
  props: ['name', 'value', 'label', 'messages', 'disabled', 'min', 'max'],
  data() {
    return {
      dateMenu: false,
      date: this.value
    }
  },
  computed: {
    formattedDate() {
      if (this.value) {
        return this.$moment(this.value).utc().format('L')
        // return this.value
      }
      return null
    }
  },
  mounted() {
    this.handleInput(this.date)
  },
  methods: {
    handleInput(value) {
      this.$refs.dateMenu.save(value)
      this.$emit('input', this.date)
    },
    handleChange() {
      this.$emit('change', this.date)
    }
  }
}
</script>
