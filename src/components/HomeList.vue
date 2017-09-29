<template lang='pug'>

  div.homeList
    .container
      .row
        h1 Welcome to Ad-Hunter!!!
        tabel.table.table-hover.table-responsive
          thead
            th No
            th URL
            th Start
            th Stop
            th Updated At
            th Ready
            th Save
            th Edit
          tbody
            tr(v-for='(hunted, index) in htdList')
              td {{hunted.id}}
              td {{hunted.url}}
              td
                tr {{hunted.settings.start | formatDateTime}}
                tr: input(type='datetime-local' v-model='hunted.settings.start')
              td
                tr {{hunted.settings.stop | formatDateTime}}
                tr: input(type='datetime-local' v-model='hunted.settings.stop')
              td {{hunted.updatedAt | formatDateTime}}
              td: button.btn.btn-success(type='button' v-on:click='ready') ready
              td: button.btn.btn-warning(type='button' v-on:click='save(hunted)') save
              td: button.btn.btn-info(type='button' v-on:click='edit(hunted.id)') edit

        .col.text-right
          button.btn.btn-primary(type='button' v-on:click='goCreatePage') Create New

</template>

<script>
  /* eslint-disable */
  import router from '../router';
  import { HuntedObject } from '../model/Hunted';
  import moment from 'moment';

  export default {
    name: 'homeList',

    data() {
      return {
        htdList: [],
      };
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        this.getHtdList();
        this.createFlagList();
      },

      getHtdList() {
        this.htdList = HuntedObject.getAll();
      },

      createFlagList() {
        this.htdList.forEach(() => {
          this.startEditFlagList.push(false);
          this.stopEditFlagList.push(false);
        });
      },

      goCreatePage() {
        router.push({ path: 'set-hunter' });
      },

      save(htd) {
        console.log(htd);
        HuntedObject.save(htd);
      },

      edit(id) {
        router.push({ path: 'set-hunter', query: { id: id }});
      },
    },

    computed: {
    },

    filters: {
      formatDateTime(value) {
        if (value === '') return '';
        return moment(value).format('YYYY/MM/DD HH:mm');
      },
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
