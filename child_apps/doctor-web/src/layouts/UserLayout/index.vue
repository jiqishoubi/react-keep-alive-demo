<template>
  <div class="userlayout">
    <el-row class="content">
      <el-col :span="14" class="img_content_wrap">
        <img class="img_content" src="./assets/userLayout_img_content_bg.png" />
      </el-col>
      <el-col :span="10" class="form_content">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
@import url('~@/common/styles.less');

.userlayout {
  width: 100vw;
  height: 100vh;
  background: url('./assets/userLayout_bg.png') no-repeat center center/100% 100%;
  background-size: cover;
  position: relative;

  .content {
    .positionCenter;
    min-width: 800px;
    max-width: 1400px;
    width: 80%;
    max-height: 800px;
    min-height: 550px;
    height: 80%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 0 18px 0px rgba(0, 0, 0, 0.2);
    overflow: hidden;

    .img_content_wrap {
      background-color: #eef3f9;
      position: relative;

      .img_content {
        .positionCenter;
        min-width: 430px;
        max-width: 740px;
        width: 83%;
      }
    }

    .form_content {
      position: relative;
    }
  }
}
</style>
