<template lang='pug'>

  div.setHunter
    .container
      .row
        h1 Target Setting Page
        .col
          router-link.btn.btn-link(to='/' tag='a') ←

</template>

<script>
  import { ipcRenderer } from 'electron';

  export default {
    name: 'setHunter',
    data() {
      return {
      };
    },
    mounted() {},
    methods: {
      start() {
        window.localStorage.setItem('now', new Date());
        localStorage.setItem('OK', `Just Now!!${new Date()}`);
        const res = ipcRenderer.sendSync('crawlExec', 'From Hello');
        console.log('res', res);
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
