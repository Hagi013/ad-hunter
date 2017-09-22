electron/service/HuntedBrowsingService.js<template lang='pug'>

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
          input#start.form-control(type='date' v-model='hunted.settings.start')

        label.col-1.col-form-label.text-center(for='start') 〜

        label.col-1.col-form-label(for='end') End
        .col-4
          input#end.form-control(type='date' v-model='hunted.settings.end')

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
          tr(v-for='(item, index) in hunted.flow')
            td {{index+1}}

            td
              select.form-control(v-model='item.type' v-on:change='decideAction(index)')
                option(value='CLICK') CLICK
                option(value='SCROLL') SCROLL
                option(value='OPERATION') OPERATION

            td(v-bind:disabled='item.type !== "CLICK"')
              tr
                td Page Offset X
                td: input(v-model='item.item.pageXOffset')
              tr
                td Page Offset Y
                td: input(v-model='item.item.pageYOffset')
              tr
                td Page Client X
                td: input(v-model='item.item.x')
              tr
                td Page Client Y
                td: input(v-model='item.item.y')
              tr
                td Page Overall X
                td: input(v-model='item.item.pageX')
              tr
                td Page Overall Y
                td: input(v-model='item.item.pageY')
              tr
                td Event Id
                td: input(v-model='item.item.eventId')
              tr
                td Event Class
                td: input(v-model='item.item.eventClass')
              //tr
              //  td Event DOM
              //  td {{ item.item.eventDOM }}
              //tr
              //  td Event HTML
              //  td {{ item.item.eventHTML }}

            td(v-bind:disabled='item.type !== "SCROLL"')
              tr
                td Page Overall X
                td: input(v-model='item.scroll.pageX')
              tr
                td Page Overall Y
                td: input(v-model='item.scroll.pageY')
              tr
                td Event Id
                td: input(v-model='item.scroll.eventId')
              tr
                td Event Class
                td: input(v-model='item.scroll.eventClass')
              //tr
              //  td Event DOM
              //  td {{ item.scroll.eventDOM }}
              //tr
              //  td Event HTML
              //  td {{ item.scroll.eventHTML }}

            td
              tr.pb-2
                select.form-control(v-model='item.operation.opType' v-bind:disabled='item.type !== "OPERATION"')
                  option(value='BACK') BACK
                  option(value='FORWARD') FORWARD
                  option(value='WAIT') WAIT
                  option(value='CUSTOM') CUSTOM
              br
              tr(v-if='item.operation.opType ===  "BACK" || item.operation.opType ===  "FORWARD" || item.operation.opType ===  "WAIT"')
                input(type='number' v-model='item.operation.num' v-on:change='decideOperation(index)' v-bind:disabled='item.type !== "OPERATION"')
              tr(v-if='item.operation.opType ===  "CUSTOM"')
                textarea(rows=2 v-model='item.operation.funcStr' v-on:change='decideOperation(index)' v-bind:disabled='item.type !== "OPERATION"')

            td
              input.form-control(type='text' v-model='item.ctr' v-bind:disabled='item.type !== "CLICK"')

            td {{ item.log }}

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
            ctr: 0,
            start: '',
            end: '',
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
      this.hunted = HuntedObject.apply({ id: `#${moment().format('x')}` });
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

      save() {},

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
