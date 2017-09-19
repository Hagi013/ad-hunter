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
          input#start.form-control(type='date' v-model='hunted.start')

        label.col-1.col-form-label.text-center(for='start') 〜

        label.col-1.col-form-label(for='end') End
        .col-4
          input#end.form-control(type='date' v-model='hunted.end')

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
                td Page X Offset
                td: input(v-model='item.item.pageXOffset')
              tr
                td Page Y Offset
                td: input(v-model='item.item.pageYOffset')
              tr
                td Page X
                td: input(v-model='item.item.x')
              tr
                td Page Y
                td: input(v-model='item.item.y')
              tr
                td Page X
                td: input(v-model='item.item.pageX')
              tr
                td Page Y
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
                td Page X
                td: input(v-model='item.scroll.pageX')
              tr
                td Page Y
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
              button.btn.btn-danger(v-on:click='simulateItem(index)') simulate

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
          url: '',
          start: '',
          end: '',
          pv: 0,
          timeout: 0,
          ctr: 0,
          flow: [],
        },
        action: {
          CLICK: 'searchItem',
          SCROLL: 'scrollScreen',
          WAIT: '',
          OPERATION: '',
        }
      };
    },

    mounted() {
      // this.hunted = HuntedObject.apply();
    },

    methods: {

      addFlowItem() {
        this.hunted.flow.push(ActionObject.apply());
      },

      simulateItem(idx) {
        console.log(this.hunted.flow[idx], idx, this.hunted.flow);
        if (emptyCheck(this.hunted.url)) return;
        const SimulateTupleType = new Tuple(String, ActionObject.apply().constructor);
        const simulateTuple = new SimulateTupleType(this.hunted.url, ActionObject.apply(this.hunted.flow[idx]));
        ElectronClient.simulateAction(simulateTuple);
      },

      removeFlowItem(idx) {
        this.hunted.flow.splice(idx, 1);
      },

      decideAction(idx) {
        this[this.action[this.hunted.flow[idx].type]](idx);
      },

      searchItem(idx) {
        if (emptyCheck(this.hunted.url)) return;
        ElectronClient.searchItem(this.hunted.url, (event, target) => {
          this.hunted.flow[idx].item = ElementObject.apply(target);
        });
      },

      scrollScreen(idx) {
        if (emptyCheck(this.hunted.url)) return;
        ElectronClient.scrollScreen(this.hunted.url, (event, target) => {
          this.hunted.flow[idx].scroll = ElementObject.apply(target);
        });
      },

      decideOperation(idx) {
        const obj = {
          opType: this.hunted.flow[idx].operation.opType,
          num: this.hunted.flow[idx].operation.num ? this.hunted.flow[idx].operation.num : undefined,
          funcStr: this.hunted.flow[idx].operation.funcStr ? this.hunted.flow[idx].operation.funcStr : undefined,
        };

        this.hunted.flow[idx].operation = OperationObject.apply(obj);
      },

      save() {},

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
  .table {
    max-width: none;
    table-layout: fixed;
    word-wrap: break-word;
  }

</style>
