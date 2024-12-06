<template>
    <div v-if="showControl">
        <FilterDropDown
            :ref="filterName"
            v-model="values"
            :options="options"
            :filters="filters"
            :btnLabel="btnLabel"
            :showAsModal="showAsModal"
            search
            historyButton
            :searchPlaceholder="search"
            :emptyTabText="emptyTabText"
            :selectOptions="dataFilter"
            :btnClass="showAsModal?'showModalClass':''"
            :showFilterIcon="showFilterIcon"
            :isOnMobile="isOnMobile"
            :defaultOptions="defaultValues"
            >
            <template v-slot:option="{option}">
                <div>
                    <input type="checkbox" :checked="option.selected" />
                    <span>{{option.name}}</span>
                </div>
            </template>
            <slot></slot>
        </FilterDropDown>
        <!-- <button type="button" @click="open">Open</button> -->
    </div>
</template>

<script>
      
  import FilterDropDown from './FilterDropdown.vue';
 
  export default {
    name: 'FilterDD',
    components: { FilterDropDown },
    props:{
        filterName: {
            type: String,
            default: ''
        },
        dataFilter: {
            type: Array,
            default: function() { return [] }              
        },
        defaultValues: {
            type: Array,
            default: function() { return [] }              
        },
        multi: {
            type: Boolean,
            default: true
        },
        applyExternalFilters: {
            type: Boolean,
            default: true
        },
        showFilterIcon: {
            type: Boolean,
            default: true
        },
        showAsModal: {
            type: Boolean,
            default: false
        },
        isOnMobile: {
            type: Boolean,
            default: false
        }
    },
    watch:{
        values(newValue, oldValue){
            if(newValue !== oldValue){
                this.refresValues();
            }
        },
        async defaultValues(newValue, oldValue){
            if(newValue !== oldValue){
                this.showControl = false;                
                this.values = newValue;
                //await new Promise(resolve => setTimeout(resolve, 1000));                 
                this.showControl = true;
            }
        },
    },
    data () {
        return {        
            search: 'search ...',
            emptyTabText: 'No Data...',
            btnLabel: (values) => `${this.filterName} ${this.multi?'('+(values.length)+')':values.length>0?'':''}`,
            name: 'GENERIC FILTER',
            values: [],            
            filters: [{
                nameAll: 'Select all',
                nameNotAll: 'Deselect all',
                func() { return true; }               
            }
            ],
            options: {
                multi: this.multi,
                groups: true,
                cssSelected: option => (option.selected ? { 'background-color': '#FF4A70', 'color': 'white' } : ''),                
            },
            showControl: true
        }
    },    
    methods: {
        open() {
            this.$refs.filterdropdown.openDropDownSelectFilter();
        },
        refresValues() {
            if(this.applyExternalFilters){
                if(this.filterName.length>0){   
                    if(this.$parent && this.$parent.refreshFilters){                 
                        this.$parent.refreshFilters(this.values);                    
                    }
                }
            }
        }
    },
    mounted(){
    }
  }
</script>

<style lang="scss">
  
</style>
