<template>
  <div class="select" v-bind:class="{'mobile':isOnMobile || showAsModal}">
    <button
      ref="buttonClick"
      type="button"
      :class="`btn-select ${btnClass}`"
      :disabled="disabled"
      @click="toggleCheckboxes"
      >
      <div v-bind:class="{'buttonLabel':!showAsModal,'showModalLabel':showAsModal}">
        <span v-html="getBtnLabel"></span>
        <i v-if="showFilterIcon" class="fas fa-filter"></i>
        <span v-if="showFilterIcon" class="caret"></span>
      </div>
    </button>
    <div v-if="isOnMobile || showAsModal" style="display: contents;">
      <popup-modal style="width:200px;" class="overlay-tooltip" ref="popup">
        <div
          class="checkboxLayerMobile p-2"
          :class="`${isOpen ? 'show' : ''} ${popoverClass}`"
          v-click-outside="externalClick"
          style="top: 260px;" v-bind:style="{ 'left': showAsModal? !isOnMobile?'35%':'5%':'5%','width': showAsModal? !isOnMobile?'150px':'90%':'90%'}" >
          <div v-if="showAsModal">
            <span style="color:black;">Select</span><span class="close-modal" @click="close()">X</span>
          </div>  
          <div class="row">
            <div class="col-12">
              <div class="helperContainer">
                <div class="line">
                  <button
                    type="button" class="helperButton"
                    @click="selectCurrent(button)"
                    v-for="(button, index) in getButtonList"
                    :key="index">
                      {{button.selectAll ? button.nameNotAll : button.nameAll}}
                    </button>
                    <button v-if="historyButton && previousSelected.length && !showAsModal"
                      @click="historyBack"
                      class="historyButton">
                      {{ historyButtonText }}
                    </button>
                </div>
                <div v-if="search" class="line" style="position:relative">
                  <input
                    :placeholder="searchPlaceholder"
                    :emptyTabText="emptyTabText"
                    type="text"
                    v-model="searchInput"
                    @input="searchfn()"
                    class="inputFilter">
                  <button type="button" class="clearButton" @click="clearSearch()">×
                    </button>
                </div>
              </div>
            </div>
          </div>
          <div class="row">  
            <div class="col-12">
              <div v-if="groups === true">
                <ul class="tab tab-block">
                  <li class="tab-item"
                    v-for="(tab, index) in globalModel"
                    :key="index"
                    v-show="tab[list].length"
                    @click="selectTab(index)" :class="{active : idSelectedTab == index}">
                    <span class="pointer" style="font-size:16px;">{{tab[groupName]}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row">    
            <div class="col-12">
              <div class="checkBoxContainer" style="font-size: 16px !important;">
                <ul class="selectList"
                  v-for="(tab, index) in globalModel"
                  v-show="idSelectedTab == index"
                  :key="index">
                  <li v-for="(option, indexOptions) in tab[list]"
                    :key="indexOptions"
                    :class="[option[labelDisabled] ? 'disabled' : '', 'selectItem']"
                    v-show="option.visible"
                    @click="selectOption(option)"
                    :style="cssSelected(option)">
                    <div name="option" v-bind:option="option">
                      <span class="right margin-right-10" v-if="option[labelSelected]">✓</span>
                      <span class="margin-left-20" style="font-size:16px !important;">{{option[labelName]}}</span>
                    </div>
                  </li>
                </ul>
                <div v-if="!valueSelected  || optionsAllHide" class="empty-tab">{{ emptyTabText }}</div>
              </div>
            </div>
          </div>
          <div class="row" v-if="showAsModal">
            <div class="col-12 d-flex justify-content-center text-center">
              <slot></slot>
            </div>
          </div>
        </div>
      </popup-modal>
    </div>
    <div v-else
      class="checkboxLayer"
      :class="`${isOpen ? 'show' : ''} ${popoverClass}`"
      v-click-outside="externalClick"
      :style="getPosition">
      <div class="helperContainer">
        <div class="line">
          <button
            type="button" class="helperButton"
            @click="selectCurrent(button)"
            v-for="(button, index) in getButtonList"
            :key="index">
              {{button.selectAll ? button.nameNotAll : button.nameAll}}
            </button>
            <button v-if="historyButton && previousSelected.length"
              @click="historyBack"
              class="historyButton">
              {{ historyButtonText }}
            </button>
        </div>
        <div v-if="search" class="line" style="position:relative">
          <input
            :placeholder="searchPlaceholder"
            :emptyTabText="emptyTabText"
            type="text"
            v-model="searchInput"
            @input="searchfn()"
            class="inputFilter">
          <button type="button" class="clearButton" @click="clearSearch()">×
            </button>
        </div>
      </div>
      <div v-if="groups === true">
        <ul class="tab tab-block">
          <li class="tab-item"
            v-for="(tab, index) in globalModel"
            :key="index"
            v-show="tab[list].length"
            @click="selectTab(index)" :class="{active : idSelectedTab == index}">
            <span class="pointer" style="font-size:16px;">{{tab[groupName]}}</span>
          </li>
        </ul>
      </div>
      <div class="checkBoxContainer" style="font-size: 16px !important;">
        <ul class="selectList"
          v-for="(tab, index) in globalModel"
          v-show="idSelectedTab == index"
          :key="index">
          <li v-for="(option, indexOptions) in tab[list]"
            :key="indexOptions"
            :class="[option[labelDisabled] ? 'disabled' : '', 'selectItem']"
            v-show="option.visible"
            @click="selectOption(option)"
            :style="cssSelected(option)">
            <div name="option" v-bind:option="option">
              <span class="right margin-right-10" v-if="option[labelSelected]">✓</span>
              <span class="margin-left-20" style="font-size:16px !important;">{{option[labelName]}}</span>
            </div>
          </li>
        </ul>
        <div v-if="!valueSelected  || optionsAllHide" class="empty-tab">{{ emptyTabText }}</div>
      </div>
    </div>
  </div>
</template>

<script src="./FilterDropDown.js"></script>
<style scoped src="./FilterDropDown.css"></style>