<template>
  <div class="body">
    <leftPanel id="leftPanel"></leftPanel>
    <centerPanel id="centerPanel"></centerPanel>
    <rightPanel id="rightPanel"></rightPanel>
  </div>
</template>
<script>
import leftPanel from "./leftPanel";
import centerPanel from "./centerPanel";
import rightPanel from "./rightPanel";
export default {
  name: "p-body",
  components: {
    leftPanel,
    centerPanel,
    rightPanel,
  },
};
</script>
<style lang="less">
.body {
  display: flex;
  height: calc(100vh - 56px);
  #centerPanel {
    height: 100%;
  }
}
</style>
