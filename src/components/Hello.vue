<template lang='pug'>

  div.hello
    h1 {{ msg }}
    h2 Essential Links
    button.btn.btn-primary(type='button' v-on:click='start') aaa

</template>

<script>
  import { ipcRenderer } from 'electron';

  export default {
    name: 'hello',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      };
    },
    mounted() {},
    methods: {
      start() {
        window.localStorage.setItem('now', new Date());
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
