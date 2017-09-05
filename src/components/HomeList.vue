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
          router-link.btn.btn-primary(type='button' to='/set-hunter' tags="button") Create New

</template>

<script>
  import { ipcRenderer } from 'electron';

  export default {
    name: 'homeList',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      };
    },
    mounted() {},
    methods: {
      start() {
        window.localStorage.setItem('now', new Date());
        localStorage.setItem('OK', `Just Now!!${new Date()}`);
        // const res = ipcRenderer.sendSync('crawlExec', 'From Hello');
        ipcRenderer.send('crawlExec', 'From Hello');
        // console.log('res', res);

        ipcRenderer.on('fromParent', (event, target) => {
          console.log(target, event);
        });
      },
    },
    computed: {},
    filters: {},
    watch: {},
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
