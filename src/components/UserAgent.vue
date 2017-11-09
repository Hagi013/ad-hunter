<template lang='pug'>

  div.userAgent
    .container-fluid
      .form-group.row
        .col
          nav.navbar.navbar-toggleable-md.navbar-light.bg-faded
            .navbar-brand: h1 UserAgent
            // div.collapse.navbar-collapse
            ul.navbar-nav.mr-auto
              li.nav-item.move
                router-link.nav-link(to='/' tag='a') ←


      .form-group.row
        label.col-1.col-form-label(for='label') Label
        .col-11
          input#label.form-control(type='text' v-model='label')

        label.col-1.col-form-label(for='value') Value
        .col-11
          input#value.form-control(type='text' v-model='value')
        .col
          button.btn.btn-success.m-2.pull-right(type='button' v-on:click='save') save

      tabel.table.table-hover
          thead
            th No
            th Id
            th Key
            th Value
          tbody
            tr(v-for='(ua, index) in userAgentList')
              td {{index}}
              td {{ua.id}}
              td: input(type='text' v-model='ua.label')
              td: input(type='text' v-model='ua.value')
              td: button.btn.btn-warning(type='button' v-on:click='update(ua)') update
              td: button.btn.btn-danger(type='button' v-on:click='remove(ua.id)') remove


</template>

<script>
  /* eslint-disable */
  import moment from 'moment';
  import router from '../router';
  import { emptyCheck } from '../lib/utils/CheckUtils';
  import { UserAgentObject } from '../model/UserAgent';
  import ResultClass from '../lib/tuple/Result';

  export default {
    name: 'userAgent',

    data() {
      return {
        label: '',
        value: '',
        userAgentList: [],
      };
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        const res = UserAgentObject.getAll();
        this.userAgentList = res.constructor === ResultClass ? [] : res;
        this.label = '';
        this.value = '';
      },

      save() {
        const forSavings = {
          id: moment().format('x'),
          label: this.label,
          value: this.value,
        };
        UserAgentObject.save(forSavings);
        this.init();
      },

      update(ua) {
        UserAgentObject.save(ua);
        this.init();
      },

      remove(id) {
        UserAgentObject.remove(id);
        this.init();
      },
    },

    computed: {
    },

    filters: {
    },

    watch: {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .table {
    max-width: none;
    table-layout: fixed;
    word-wrap: break-word;
  }
</style>
