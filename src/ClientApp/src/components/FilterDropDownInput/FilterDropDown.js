import compareHelper from '../../common/helpers';
import PopupModal from '../Dialog/PopupModal.vue';
import vClickOutside from 'click-outside-vue3';
import { mapActions } from 'vuex';

export default {
  name: 'filter-drop-down',
  components: { PopupModal },
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },    
    filters: {
      type: Array,
      default: () => [],
    },
    selectOptions: {
      type: Array,
      default: () => [],
    },
    eventName: {
      type: String,
      default: 'selectionChanged',
    },
    reloadInit: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => ([]),
    },
    btnClass: {
      type: String,
      default: '',
    },
    popoverClass: {
      type: String,
      default: '',
    },
    btnLabel: {
      type: Function,
      default: () => ('filter-drop-down'),
    },
    search: {
      type: Boolean,
      default: false,
    },
    searchPlaceholder: {
      type: String,
      default: 'Search...',
    },
    historyButton: {
      type: Boolean,
      default: false,
    },
    historyButtonText: {
      type: String,
      default: '↶',
    },
    position: {
      type: String,
      default: 'bottom-left',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disabledUnSelect: {
      type: Boolean,
      default: false,
    },
    emptyTabText: {
      type: String,
      default: 'No Data',
    },
    showFilterIcon: {
      type: Boolean,
      default: false
    },
    showAsModal: {
      type: Boolean,
      default: false
    },
    isOnMobile: {
      type: Boolean,
      default: false
    },
    defaultOptions: {
      type: Array,
      default: () => [],
    },    
  },
  data() {
    return {
      valueSelected: [],
      simpleArray: false,
      DropDownSelectFilter: null,
      groups: null,
      isOpen: false,
      globalModel: [],
      idSelectedTab: 0,
      searchInput: '',
      optionsAllHide: false,
      previousSelected: [],
      opened: false
    };
  },
  created() {
    this.setConfig();
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  methods: { 
    ...mapActions(['setSelectedSports']),
    openDropDownSelectFilter() {
      this.manualClick = true;
      this.isOpen = true;      
      this.openStatus(this.isOpen);
    },
    closeDropDownSelectFilter() {
      if(this.showAsModal){
        //this.manualClick = true;
        //this.isOpen = false;      
        //this.openStatus(this.isOpen);
      }else{
        this.manualClick = true;
        this.isOpen = false;      
        this.openStatus(this.isOpen);
      }
    },
    close(){
      this.manualClick = true;
      this.isOpen = false;      
      this.openStatus(this.isOpen);
    },
    setConfig() {
      this.multi = typeof (this.options.multi) !== 'undefined'
        ? this.options.multi : false;
      this.groups = typeof (this.options.groups) !== 'undefined'
        ? this.options.groups : false;
      this.list = this.options.labelList || 'list';
      this.labelName = this.options.labelName || 'name';
      this.labelValue = this.options.labelValue || this.labelName;
      this.groupName = this.options.groupName || 'name';
      this.labelSelected = this.options.labelSelected || 'selected';
      this.labelDisabled = this.options.labelDisabled || 'disabled';
      this.cssSelected = this.options.cssSelected || (
        (option) => (option[this.labelSelected]
          ? {
            'font-weight': 'bold',
            color: '#E9E9E9',
          } : ''));
      this.init();
    },
    init() {
      const clone = this.cloneData(this.selectOptions);
      if (!this.groups) {
        if (typeof this.selectOptions[0] === 'string'
          || typeof this.selectOptions[0] === 'number') {
          this.simpleArray = true;
          this.globalModel = [{ [this.list]: this.prepareArray(clone) }];
        } else {
          this.globalModel = [{ [this.list]: clone }];
        }
      } else {
        if (typeof clone[0][this.list][0] === 'string'
        || typeof clone[0][this.list][0] === 'number') {
          for (let i = 0; i < clone.length; i += 1) {
            clone[i][this.list] = this.prepareArray(clone[i][this.list]);
          }
          this.simpleArray = true;
        }
        this.globalModel = clone;
      }
      this.initValues();
    },
    initValues() {
      //var vm = this;
      this.valueSelected = [];
      for (let i = 0; i < this.globalModel.length; i += 1) {
        for (let j = 0; j < this.globalModel[i][this.list].length; j += 1) {
          if (typeof this.globalModel[i][this.list][j][this.labelSelected]
            === 'boolean') {
            this.globalModel[i][this.list][j][this.labelSelected] = false;
          } else {
            this.globalModel[i][this.list][j][this.labelSelected] = false;
            this.globalModel[i][this.list][j]['visible'] = true;
          }
          for (let k = 0; k < this.value.length; k += 1) {
            if (this.simpleArray
              && this.globalModel[i][this.list][j][this.labelValue] === this.value[k]) {
              this.globalModel[i][this.list][j][this.labelSelected] = true;
              this.valueSelected.push(this.globalModel[i][
                this.list][j][this.labelValue]);
            } else if (!this.simpleArray
              && this.globalModel[i][this.list][j][this.labelValue]
              === this.value[k][this.labelValue]) {
              this.globalModel[i][this.list][j][this.labelSelected] = true;
              const opt = { ...this.globalModel[i][this.list][j] };
              delete opt[this.labelSelected];
              delete opt.visible;
              this.valueSelected.push(opt);
            }
          }
        }
      }
      this.filter();
      this.$emit('input', this.valueSelected.slice(0));
      this.$emit(this.eventName, this.valueSelected.slice(0));
    },
    toggleCheckboxes(event) {
      this.DropDownSelectFilter = event.target;
      if (this.DropDownSelectFilter.className === 'buttonLabel' || this.DropDownSelectFilter.className === 'showModalLabel') {
        this.DropDownSelectFilter = this.DropDownSelectFilter.parentNode;
      }
      if(this.showAsModal){
        this.isOpen = !this.isOpen;
        this.openStatus(this.isOpen);
      }else{
        this.isOpen = !this.isOpen;
        this.openStatus(this.isOpen);
      }
    },
    externalClick(event) {
      if (this.isOpen && !this.manualClick) {
        let elem = event.target;
        if (!!elem && elem.className === 'buttonLabel' || this.DropDownSelectFilter.className === 'showModalLabel') {
          elem = elem.parentNode;
        }
        if (!!elem && elem.isSameNode(this.DropDownSelectFilter)) {
          return;
        }
        if(this.showAsModal){
          //this.isOpen = !this.isOpen;
          //this.openStatus(this.isOpen);
        }else{
          this.isOpen = !this.isOpen;
          this.openStatus(this.isOpen);
        }
      }
      this.manualClick = false;
    },
    
    selectOption(option) {
      if (option[this.labelDisabled]) {        
        return;
      }
      if (!option[this.labelSelected]) {
        this.previousSelected.push(this.cloneData(this.valueSelected));
        if (!this.multi) {
          this.deselctAll();
          this.valueSelected = [];
          this.externalClick({ path: [] });
        }
        this.pushOption(option);
        this.$emit('input', this.valueSelected.slice(0));
        this.$emit(this.eventName, this.valueSelected.slice(0));
      } else {
        if (!this.multi && this.disabledUnSelect) {
          return;
        }
        this.previousSelected.push(this.cloneData(this.valueSelected));
        this.popOption(option);
        this.$emit('input', this.valueSelected.slice(0));
        this.$emit(this.eventName, this.valueSelected.slice(0));
      }
      option[this.labelSelected] = !option[this.labelSelected];
      this.filter();
      this.setSelectedSports(JSON.parse(JSON.stringify(this.valueSelected)));
    },


    selectOptionDefault(option) {
      if (option[this.labelDisabled]) {        
        return;
      }      
      this.pushOption(option);        
      this.$emit('input', this.valueSelected.slice(0));
      this.$emit(this.eventName, this.valueSelected.slice(0));
      option[this.labelSelected] = true;
      this.setSelectedSports(JSON.parse(JSON.stringify(this.valueSelected)));
      this.globalModel[this.idSelectedTab][this.list][this.getPositionGlobalMode(option.name)].selected = true;
      this.$forceUpdate();
    },

    getPositionGlobalMode(value){
      let position = 0;
      for (let i = 0; i < this.globalModel[this.idSelectedTab][this.list].length; i += 1) {
        if(this.globalModel[this.idSelectedTab][this.list][i].name === value){
          position = i;
        }
      }
      return position;
    },

    pushOption(option) {
      if (this.simpleArray) {
        this.valueSelected.push(option[this.labelValue]);
      } else {
        let founded = this.valueSelected.find(item => { return item.name === option.name });        
        let option_ = { ...option };
        option_['selected'] = true;
        const opt = { ...option_ };
        if(founded === undefined){
          this.valueSelected.push(opt);
        }
      }
    },
    popOption(opt) {
      for (let i = 0; i < this.valueSelected.length; i += 1) {
        if (this.valueSelected[i][this.labelValue] === opt[this.labelValue]
          || (this.simpleArray && this.valueSelected[i] === opt[this.labelValue])) {
          this.valueSelected.splice(i, 1);
          return;
        }
      }
    },
    selectTab(id) {
      this.idSelectedTab = id;
      this.searchfn();
    },
    searchfn() {
      let allHide = true;
      for (let i = 0; i < this.globalModel[this.idSelectedTab][this.list].length;
        i += 1) {
        if (~this.globalModel[this.idSelectedTab][this.list][i][this.labelName]
          .toLowerCase().indexOf(
            this.searchInput.toLowerCase(),
          )) {
          allHide = false;
          this.globalModel[this.idSelectedTab][this.list][i].visible = true;
        } else {
          this.globalModel[this.idSelectedTab][this.list][i].visible = false;
        }
      }
      this.optionsAllHide = allHide;
      this.filter();
    },
    clearSearch() {
      this.searchInput = '';
      this.searchfn();
    },
    selectCurrent(option) {
      this.previousSelected.push(this.cloneData(this.valueSelected));
      for (let i = 0; i < this.globalModel[this.idSelectedTab][this.list].length;
        i += 1) {
        if (this.globalModel[this.idSelectedTab][this.list][i].visible
          && !this.globalModel[this.idSelectedTab][this.list][i][this.labelDisabled]
          && option.func(this.globalModel[this.idSelectedTab][this.list][i])) {
          if (!option.selectAll) {
            if (!this.globalModel[this.idSelectedTab][this.list][i][this.labelSelected]) {
              this.globalModel[this.idSelectedTab][this.list][i][this.labelSelected] = true;
              this.pushOption(this.globalModel[this.idSelectedTab][this.list][i]);
            }
          } else if (this.globalModel[this.idSelectedTab][this.list][i][this.labelSelected]) {
            this.globalModel[this.idSelectedTab][this.list][i][this.labelSelected] = false;
            this.popOption(this.globalModel[this.idSelectedTab][this.list][i]);
          }
        }
      }
      this.$emit('input', this.valueSelected.slice(0));
      this.$emit(this.eventName, this.valueSelected.slice(0));
      option.selectAll = !option.selectAll;
      this.filter();

      this.setSelectedSports(JSON.parse(JSON.stringify(this.valueSelected)));
    },
    filter() {
      if(this.list){
        for (let i = 0; i < this.filters.length; i += 1) {
          let allSelected = true;
          for (let j = 0; j < this.globalModel[this.idSelectedTab][this.list].length;
            j += 1) {
            if (this.globalModel[this.idSelectedTab][this.list][j].visible
              && this.filters[i].func(
                this.globalModel[this.idSelectedTab][this.list][j],
              )
                && !this.globalModel[this.idSelectedTab][this.list][j][this.labelDisabled]
                && !this.globalModel[this.idSelectedTab][this.list][j][this.labelSelected]) {
              allSelected = false;
              break;
            }
          }
          this.filters[i].selectAll = allSelected;
        }
      }
    },
    deselctAll() {
      for (let i = 0; i < this.globalModel.length; i += 1) {
        for (let j = 0; j < this.globalModel[i][this.list].length; j += 1) {
          if (!this.globalModel[i][this.list][j][this.labelDisabled]) {
            this.globalModel[i][this.list][j][this.labelSelected] = false;
          }
        }
      }
    },
    prepareArray(value) {
      return value.map((elem) => ({ [this.labelValue]: elem }));
    },
    cloneData(value) {
      if (Array.isArray(value)) {
        return value.map(this.cloneData);
      } if (value && typeof value === 'object') {
        const res = {};
        const keys = Object.keys(value);
        for (let i = 0; i < keys.length; i += 1) {
          res[keys[i]] = this.cloneData(value[keys[i]]);
        }
        return res;
      }
      return value;
    },
    historyBack() {
      const previousValues = this.previousSelected.pop();
      this.$emit('input', previousValues);
      this.$emit(this.eventName, previousValues);
    },
    openStatus(status) {
      if(this.$refs.popup){
        status?this.$refs.popup.open():this.$refs.popup.close();
      }
      const event = status ? 'open' : 'close';
      this.$emit(event);
    },
    loadDefaultSelections(){
      let defaultOptions =  this.cloneData(this.defaultOptions);
      if(defaultOptions){
        for (let i = 0; i < Object.keys(defaultOptions).length; i += 1) {
          this.selectOptionDefault({name:defaultOptions[i].name,selected:true,visible:true});
        }
      }
    }
  },
  computed: {
    getBtnLabel() {
      return this.btnLabel(this.valueSelected);
    },
    getPosition() {
      if (this.DropDownSelectFilter) {
        const btnHeight = this.DropDownSelectFilter.offsetHeight;
        const positions = this.position.split('-');
        const style = {
          [positions[1]]: 0,
        };
        if (positions[0] === 'top') {
          style.bottom = `${btnHeight}px`;
        }
        return style;
      }
      return {};
    },
    getButtonList() {
      return !!this.filters && this.multi && this.filters;
    },
  },
  watch: {
    defaultOptions(newValue, oldValue) {
      if(newValue !== oldValue){
        this.loadDefaultSelections();
      }
    },
    selectOptions: {
      handler() {
        this.setConfig();
      },
      deep: true,
    },
    reloadInit: {
      handler(value) {
        if (value) {
          this.initValues();
          this.$emit('vueDropDownSelectFilterInited');
        }
      },
    },
    value: {
      handler(newVal, oldval) {
        if (oldval && newVal && this.valueSelected) {
          if (this.simpleArray
            && !compareHelper.compareSimpleArray(newVal, this.valueSelected)) {
            this.initValues();
          } else if (!compareHelper.compareArrayObject(
            newVal, this.valueSelected, this.labelName,
          )) {
            this.initValues();
          }
        }
      },
      deep: true,
    },
  },
  mounted(){
    //this.loadDefaultSelections();
  }
};
