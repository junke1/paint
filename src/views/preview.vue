<template>
  <div class="pre">
    <!-- <div class="logo-after">随 笔</div> -->
    <div class="pre-logo">
      <div style="pre-l"><span>随</span> <span>笔</span></div>
      <div class="pre-title">随心落笔，设计心中所想</div>
    </div>
    <div class="pre-button" @click="start">开始创作</div>
  </div>
  <!-- <div class="gradient"></div> -->
</template>
<script>
export default {
  name: "p-preview",
  components: {},
  methods: {
    start() {
      this.$router.replace("/main");
    },
  },
};
</script>
<style lang="less">
.pre {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, #464d55, #000000);
  .logo-after,
  .pre-logo,
  .pre-l,
  .pre-title,
  .pre-button {
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-family: Muyao-Softbrush;
  }
  .logo-after {
    width: 40%;
    height: 50%;
    color: transparent;
    background: linear-gradient(0deg, #000000, #1d2023ad);
    background-clip: text;
    font-size: 120px;

    -webkit-background-clip: text;
  }
  .pre-logo {
    width: 40%;
    height: 40%;
    color: transparent;
    background: linear-gradient(0deg, #000000, #ffffff);
    background-clip: text;
    font-size: 80px;
    -webkit-background-clip: text;
    background-size: 600% 600%;
    &:hover {
      cursor: pointer;
      .pre-title {
        font-size: 20px;
        opacity: 1;
        bottom: -50px;
      }
    }

    /* 循环动画 - 原理4 */
    animation: gradientBG 5s ease infinite;
    span {
      margin: 0 10px;
    }
  }
  .pre-title {
    width: 40%;
    height: 40%;
    font-size: 0px;
    top: 10px;
    color: #fff;
    opacity: 0;
    transition: 1s;
  }
  .pre-button {
    position: absolute;
    top: 30%;
    width: 20%;
    height: 50px;
    background: rgb(95, 95, 95);
    color: #fff;
    line-height: 50px;
    border-radius: 4px;
    font-size: 40px;
    cursor: pointer;
    transition: 0.5s;
    &:hover {
      color: #1d2023;
      background: #ddd;
    }
  }
}
.gradient {
  /* 设置容器尺寸 - 原理1 */
  width: 100%;
  height: 100%;
  /* 背景渐变色 - 原理2 */
  background: linear-gradient(0deg, #ffffff, #000000);
  /* 背景尺寸 - 原理3 */
  background-size: 600% 600%;
  /* 循环动画 - 原理4 */
  animation: gradientBG 5s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}
</style>
