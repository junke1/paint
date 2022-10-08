<template>
  <div id="app">
    <onlineheader class="header"></onlineheader>
    <onlinebody class="body"></onlinebody>
  </div>
</template>
<script>
import onlineheader from "@/design/header";
import onlinebody from "@/design/body";
export default {
  name: "p-main",
  components: {
    onlineheader,
    onlinebody,
  },
};
</script>
<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #e7e8f1;
  position: relative;
}
.header {
  width: 100%;
  height: 56px;
  z-index: 3;
}
.body {
  width: 100%;
  height: calc(100vh - 56px);
}
</style>
