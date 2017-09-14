<template lang='pug'>

  div.homeList
    .container
      .row
        h1 Welcome to Ad-Hunter!!!
        tabel.table.table-hover.table-bordered
          thead
            th No
            th URL
            th Created_At
            th Ready
            th Edit
          tbody
            tr
              td
              td
              td
              td: button.btn.btn-success(type='button' v-on:click='start') start
              td

        .col.text-right
          button.btn.btn-primary(type='button' v-on:click='goCreatePage') Create New

</template>

<script>
  /* eslint-disable */
  import { ipcRenderer } from 'electron';
  import router from '../router';

  export default {
    name: 'homeList',

    data() {
      return {
      };
    },

    mounted() {

    },

    methods: {
      start() {
        window.localStorage.setItem('now', new Date());
        ipcRenderer.send('crawlExec', 'From Hello');
        ipcRenderer.on('fromParent', (event, target) => {
          console.log(target, event);
        });
      },
      goCreatePage() {
        router.push('/set-hunter');
      }
    },

    computed: {},

    filters: {},

    watch: {},
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
