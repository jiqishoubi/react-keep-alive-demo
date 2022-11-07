<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/views/common/404/404_images/404.png" alt="404" />
      </div>

      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__info">All rights reserved</div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">Please check that the URL you entered is correct, or click the button below to return to the homepage.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.wscn-http404 {
  position: relative;
  padding: 100px 100px;
  overflow: hidden;
  .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    overflow: hidden;
    &__parent {
      width: 100%;
    }
    &__child {
      position: absolute;
      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
      }
      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
      }
      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
      }
    }
  }
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      margin-bottom: 20px;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      margin-bottom: 10px;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      margin-bottom: 30px;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
    }
  }
}
</style>
