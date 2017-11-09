<template lang='pug'>

  div.homeList
    .container-fluid
      .form-group.row
        .col
          nav.navbar.navbar-toggleable-md.navbar-light.bg-faded
            .navbar-brand: h1 Welcome to Ad-Hunter!!!
            // div.collapse.navbar-collapse
            ul.navbar-nav.mr-auto
              li.nav-item.move
                router-link.nav-link(to='/user-agent' tag='a') UserAgent

      .row
        tabel.table.table-hover
          thead
            th No
            th URL
            th Start
            th
              tr Interval
              tr PV
            th Updated At
            th Log
              tr PV
              tr Click
            th Save
            th Edit
            th Remove
          tbody
            tr(v-for='(hunted, index) in htdList')
              td {{hunted.id}}
              td {{hunted.url}}
              td
                tr {{hunted.settings.start | formatDateTime}}
                tr: input(type='datetime-local' v-model='hunted.settings.start')
              td
                tr: input(type='number' step='1' v-model='hunted.settings.interval')
                tr: input(type='number' step='1' v-model='hunted.settings.pv')
              td {{hunted.updatedAt | formatDateTime}}
              td
                tr {{logList[index].pv}}
                tr {{logList[index].click}}
              td: button.btn.btn-warning(type='button' v-on:click='save(hunted)') save
              td: button.btn.btn-info(type='button' v-on:click='edit(hunted.id)') edit
              td: button.btn.btn-danger(type='button' v-on:click='remove(hunted.id)') remove

        .col.text-right
          button.btn.btn-primary(type='button' v-on:click='goCreatePage') create new
          button.btn.btn-success(type='button' v-on:click='ready') ready
          button.btn.btn-danger(type='button' v-on:click='stop') stop

</template>

<script>
  /* eslint-disable */
  import moment from 'moment';
  import router from '../router';
  import { HuntedObject } from '../model/Hunted';
  import ElectronClient from '../model/electron/ElectronClient';
  import { emptyCheck } from '../lib/utils/CheckUtils';

  export default {
    name: 'homeList',

    data() {
      return {
        htdList: [],
        logList: [],
        startFlag: false,
        intervalStartingList: new Map(),
        inProcessList: new Map(),
      };
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        this.getHtdList();
        this.htdList.forEach(h => {
          this.logList.push({
            id: h.id,
            pv: 0,
            click: 0,
          });
        });
      },

      getHtdList() {
        this.htdList = HuntedObject.getAll();
      },

      goCreatePage() {
        router.push({path: 'set-hunter'});
      },

      save(htd) {
        console.log(htd);
        HuntedObject.save(htd);
        this.init();
      },

      edit(id) {
        router.push({path: 'set-hunter', query: {id: id}});
      },

      remove(id) {
        HuntedObject.remove(id);
        this.init();
      },

      ready() {
        this.startFlag = true;
        this.htdList.forEach(htd => {
          const intervalNo = window.setInterval(() => this.startFlow(htd), htd.settings.interval * 1000);
          this.intervalStartingList.set(htd.id, intervalNo);
        });
      },

      startFlow(htd) {
        if (!this.startFlag) return;
        if (htd.settings.start === '' || moment(htd.settings.start) > moment()) return;
        let overSecondTimesPVFlag = false;
        this.inProcessList.set(htd.id, true);
        ElectronClient.executeBrowsing(HuntedObject.createBrowsingTuple(htd), (event, log) => {
          // console.log(log.type, `log.htdId: ${log.htdId} !== htd.id: ${htd.id}`, moment().format('HH:mm:ss.SSS'), htd.url);
          if (log.htdId !== htd.id) return;

          // console.log(`overSecondTimesFlag: ${overSecondTimesPVFlag}`);
          // 一気に1回以上PVのeventが飛んでくるので、最初の1回以外は弾く
          if (overSecondTimesPVFlag) return;

          // PVが一回きたらFlagを変更
          if (log.type.includes('PV')) overSecondTimesPVFlag = true;

          // 操作対象(htd)のログの順番を取得(Listの中の対象のObjectを取得するのにidキーが必要となるが、うまく取得する方法がなかったので、reduceで実装)
          const logListIdx = this.logList.reduce((prev, l, idx) => htd.id === l.id ? prev + idx : prev + 0, 0);
          // console.log(`htd.id: ${htd.id}`, `logListIdx: ${logListIdx}`, `this.logList[logListIdx].id: ${this.logList[logListIdx].id}`);

          if (log.type.includes('CLICKED')) this.logList[logListIdx].click += 1;

          if (log.type.includes('PV')) {
            this.logList[logListIdx].pv += 1;
            // メモリ節約のため、現在進行中のブランシングがなければ、Electronのwindowをリセットする
            console.log('Reset起動！！', `log.type: ${log.type}`);
            this.inProcessList.set(htd.id, false);
            this.reset();
          }

          // PV数の上限がセットされていなければ条件判定せずに無限で行う
          if (emptyCheck(htd.settings.pv)) return;

          // 上限のPV数に達したらIntervalをclear
          if (this.logList[logListIdx].pv >= htd.settings.pv) {
            window.clearInterval(this.intervalStartingList.get(htd.id));
            this.intervalStartingList.delete(htd.id);
          }
        });
      },

      stop() {
        this.startFlag = false;
        this.intervalStartingList.forEach(intervalNo => window.clearInterval(intervalNo));
        this.reset();
      },

      reset() {
        if (Array.from(this.inProcessList.values()).every(b => !b)) ElectronClient.resetBrowsing();
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
