<template lang='pug'>

  div.setHunter

    .container-fluid
      .form-group.row
        .col
          nav.navbar.navbar-toggleable-md.navbar-light.bg-faded
            // div.collapse.navbar-collapse
            ul.navbar-nav.mr-auto
              li.nav-item.move
                router-link.nav-link(to='/' tag='a') ←

      //----- Settings -----
      //- URL
      .form-group.row
        label.col-1.col-form-label(for='url') URL
        .col-11
          input#url.form-control(type='text' v-model='hunted.url')
          // small.form-control-feedback(v-show='hasInputError.email.value') {{ hasInputError.email.msg }}

      //- Start - End
      .form-group.row
        label.col-1.col-form-label(for='start') Start
        .col-4
          input#start.form-control(type='datetime-local' v-model='hunted.settings.start')

        label.col-1.col-form-label.text-center(for='start') 〜

        label.col-1.col-form-label(for='end') End
        .col-4
          input#end.form-control(type='datetime-local' v-model='hunted.settings.end')

      //- Interval
      .form-group.row
        label.col-1.col-form-label(for='interval') Interval
        .col-4
          input#interval.form-control(type='number' v-model='hunted.settings.interval')
        label.col-1.col-form-label(for='pv') PV
        .col-4
          input#pv.form-control(type='number' v-model='hunted.settings.pv')

      hr

      //----- Flow -----
      h1 Flow
      //- Flow Table
      tabel.table.table-hover.table-responsive
        thead
          th No
          th Type
          th Target
          th Scroll
          th Operation
          th CTR
          th Log
          th Simulate
          th Remove
        tbody
          tr(v-for='(action, index) in hunted.flow')
            td {{index+1}}

            td
              select.form-control(v-model='action.type' v-on:change='decideAction(index)')
                option(value='CLICK') CLICK
                option(value='SCROLL') SCROLL
                option(value='OPERATION') OPERATION

            td(v-bind:disabled='action.type !== "CLICK"')
              tr
                td Page Offset X
                td: input(v-model='action.item.pageXOffset')
              tr
                td Page Offset Y
                td: input(v-model='action.item.pageYOffset')
              tr
                td Page Client X
                td: input(v-model='action.item.x')
              tr
                td Page Client Y
                td: input(v-model='action.item.y')
              tr
                td Page Overall X
                td: input(v-model='action.item.pageX')
              tr
                td Page Overall Y
                td: input(v-model='action.item.pageY')
              tr
                td Event Id
                td: input(v-model='action.item.eventId')
              tr
                td Event Class
                td: input(v-model='action.item.eventClass')

            td(v-bind:disabled='action.type !== "SCROLL"')
              tr
                td Page Overall X
                td: input(v-model='action.scroll.pageX')
              tr
                td Page Overall Y
                td: input(v-model='action.scroll.pageY')
              tr
                td Event Id
                td: input(v-model='action.scroll.eventId')
              tr
                td Event Class
                td: input(v-model='action.scroll.eventClass')

            td
              tr.pb-2
                select.form-control(v-model='action.operation.opType' v-bind:disabled='action.type !== "OPERATION"')
                  option(value='BACK') BACK
                  option(value='FORWARD') FORWARD
                  option(value='WAIT') WAIT
                  option(value='CUSTOM') CUSTOM
              br
              tr(v-if='action.operation.opType ===  "BACK" || action.operation.opType ===  "FORWARD" || action.operation.opType ===  "WAIT"')
                input(type='number' v-model='action.operation.num' v-on:change='decideOperation(index)' v-bind:disabled='action.type !== "OPERATION"')
              tr(v-if='action.operation.opType ===  "CUSTOM"')
                textarea(rows=2 v-model='action.operation.funcStr' v-on:change='decideOperation(index)' v-bind:disabled='action.type !== "OPERATION"')

            td
              input.form-control(type='number' step='0.01' v-model='action.ctr' v-bind:disabled='action.type !== "CLICK"')

            td {{ action.log }}

            td
              button.btn.btn-info(v-on:click='simulateItem(index)') simulate

            td
              button.btn.btn-danger(v-on:click='removeFlowItem(index)') remove

      .form-group.row
        .col-11.text-center
          button.btn.btn-primary(type='button' v-on:click='addFlowItem') ＋


      button.btn.btn-success.m-2.pull-right(type='button' v-on:click='start') start
      button.btn.btn-warning.m-2.pull-right(type='button' v-on:click='save') save


</template>

<script>
  /* eslint-disable */
  import moment from 'moment';
  import { emptyCheck } from '../lib/utils/CheckUtils';
  import { HuntedObject }from '../model/Hunted';
  import { ActionObject } from '../model/Action';
  import { ElementObject} from '../model/Element';
  import { OperationObject } from '../model/Operation';
  import { CLICK, SCROLL, OPERATION } from '../model/type/HuntedActionType';
  import { BACK, FORWARD, WAIT, CUSTOM } from '../model/type/HuntedOperationType';
  import ElectronClient from '../model/electron/ElectronClient';
  import Tuple from '../lib/Tuple';

  export default {
    name: 'setHunter',
    props: {
      isNewFlag: false,
    },

    data() {
      return {
        hunted: {
          id: '0',
          url: '',
          settings: {
            pv: 0,
            timeout: 0,
            start: '',
            end: '',
            interval: 0,
          },
          flow: [],
          updatedAt: '',
          description: '',
        },
        action: {
          CLICK: 'searchItem',
          SCROLL: 'scrollScreen',
        },
      };
    },

    mounted() {
      console.log('this.$route.query', this.$route.query);
      if (this.$route.query.id) {
        this.hunted = HuntedObject.getById(this.$route.query.id);
        return;
      }

      this.hunted = HuntedObject.apply({ id: `${moment().format('x')}` });
      console.log(this.hunted);
    },

    methods: {

      addFlowItem() {
        this.hunted.flow.push(ActionObject.apply({id: `${this.hunted.id}#${this.hunted.flow.length + 1}`}));
      },

      removeFlowItem(idx) {
        this.hunted.flow.splice(idx, 1);
      },

      decideAction(idx) {
        if (this.hunted.flow[idx].type === 'OPERATION') return;
        this[this.action[this.hunted.flow[idx].type]](idx);
      },

      searchItem(idx) {
        if (emptyCheck(this.hunted.url)) return;
        const SettingTupleType = new Tuple(String, String);
        const settingTuple = new SettingTupleType(this.hunted.flow[idx].id, this.hunted.url);
        ElectronClient.searchItem(settingTuple, (event, settings) => {
          if (settings.actionId !== this.hunted.flow[idx].id) return;
          this.hunted.flow[idx].item = ElementObject.apply(settings.settings);
        });
      },

      scrollScreen(idx) {
        if (emptyCheck(this.hunted.url)) return;
        const SettingTupleType = new Tuple(String, String);
        const settingTuple = new SettingTupleType(this.hunted.flow[idx].id, this.hunted.url);
        ElectronClient.scrollScreen(settingTuple, (event, settings) => {
          if (settings.actionId !== this.hunted.flow[idx].id) return;
          this.hunted.flow[idx].scroll = ElementObject.apply(settings.settings);
        });
      },

      decideOperation(idx) {
        console.log(this.hunted.flow[idx].operation.opType);
        const obj = {
          opType: this.hunted.flow[idx].operation.opType,
          num: this.hunted.flow[idx].operation.opType !== 'CUSTOM' && this.hunted.flow[idx].operation.num && this.hunted.flow[idx].operation.num > 0 ? this.hunted.flow[idx].operation.num : undefined,
          funcStr: this.hunted.flow[idx].operation.opType === 'CUSTOM' && this.hunted.flow[idx].operation.funcStr ? this.hunted.flow[idx].operation.funcStr : undefined,
        };
        this.hunted.flow[idx].operation = OperationObject.apply(obj);
      },

      save() {
        HuntedObject.save(this.hunted);
      },

      simulateItem(idx) {
        if (emptyCheck(this.hunted.url)) return;
        const SimulateTupleType = new Tuple(String, ActionObject.apply().constructor);
        const simulateTuple = new SimulateTupleType(this.hunted.url, ActionObject.apply(this.hunted.flow[idx]));
        ElectronClient.simulateAction(simulateTuple);
      },

      start() {
        if (emptyCheck(this.hunted.url)) return;
        const ExecuteBrowsingTupleType = new Tuple(String, Array);
        const executeBrowsingTuple = new ExecuteBrowsingTupleType(this.hunted.url, HuntedObject.apply(this.hunted).flow);
        ElectronClient.executeBrowsing(executeBrowsingTuple, (event, log) => {
          console.log('log', log);
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
  .table {
    max-width: none;
    table-layout: fixed;
    word-wrap: break-word;
  }

</style>
