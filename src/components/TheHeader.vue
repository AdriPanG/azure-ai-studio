<template>
  <header>
    <div class="header-wrapper">
      <div class="left-header">
        <img class="logo-repsol" src="@/assets/logo/repsol-logo.svg" />
        <div class="separator-title"></div>
        <span class="title">Expediciones</span>
      </div>

      <div class="right-header">
        <div class="search-wrapper">
          <input type="text" class="search-input" placeholder="Buscar albaranes" />
          <img class="search-icon" src="@/assets/icons/search.svg" />
        </div>

        <div class="separator"></div>

        <div class="user-wrapper">
          <div class="user">
            <span class="user-name">NN</span>
          </div>
        </div>
        <div class="wrapper-date-hour">
          <HeaderDate />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import HeaderDate from './HeaderDate.vue'
</script>

<style lang="scss" scoped>
header {
  display: flex;
  height: $header-height;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid $c-grey-30;
  padding: 0px 5%;
  position: relative;
  width: 100%;
  font-family: $roboto-400;

  .header-wrapper {
    width: 100%;
    max-width: 1504px;
    margin-left: 4rem;
    display: flex;
    justify-content: space-between;

    .left-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 22rem;
      color: $c-grey-70;
      & .title {
        font-size: 16px;
        font-family: $roboto-500;
        color: $c-grey-70;
      }

      & .separator-title {
        width: 1px;
        height: 1.5rem;
        border-left: 1px solid $c-grey-30;
      }
    }

    .right-header {
      display: flex;
      align-items: center;
      .separator {
        width: 1px;
        height: 1.5rem;
        border-left: 1px solid $c-grey-30;
      }

      & .search-wrapper {
        display: flex;
        align-items: center;
        padding: 0 0.2rem;
        border-radius: 0.5rem;
        margin-right: 42px;
        border: 1px solid $c-grey-30;
        position: relative;

        .search-input {
          width: 17.125rem;
          height: 2.5rem;
          border: none;
          outline: none;
          margin: 0;
          &::placeholder {
            color: $c-grey-50;
          }
        }

        .search-icon {
          border-radius: 4px;
          padding: 0.3rem;
          width: 2rem;
        }
      }

      .user-wrapper {
        & .user {
          display: flex;
          align-items: center;
          cursor: pointer;
          & .user-name {
            color: $c-white;
            margin: 0 3rem;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: $c-orange-70;
          }
        }
      }
    }
  }
}
</style>
