<template>
  <div class="left-panel">
    <div class="left-panel-menu">
      <div
        :class="active == index ? 'active jello-horizontal' : ''"
        v-for="(item, index) in menuList"
        :key="index"
        @click="tabsClick(index, item.name)"
      >
        <div class="leftPanel-menu-button">{{ item.text }}</div>
      </div>
    </div>
    <div class="left-panel-content">
      <words
        @change="handleChangeContent"
        :class="activeTabName == 'word' ? 'fade-in-bottom' : ''"
        v-if="activeTabName == 'word'"
      ></words>
      <materials
        @change="handleChangeContent"
        :class="activeTabName == 'material' ? 'fade-in-bottom' : ''"
        v-if="activeTabName == 'material'"
      ></materials>
      <backgrounds
        @change="handleChangeContent"
        :class="activeTabName == 'background' ? 'fade-in-bottom' : ''"
        v-if="activeTabName == 'background'"
      ></backgrounds>
      <div class="left-panel-mainContent-toggle" @click="shousuo()">
        <div v-show="!openClose" style="color: #fff">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div v-show="openClose" style="color: #fff">
          <i class="el-icon-arrow-left"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import words from "@/design/leftTabs/words";
import materials from "@/design/leftTabs/materials";
import backgrounds from "@/design/leftTabs/backgrounds";
export default {
  name: "p-left-panel",
  components: {
    words,
    materials,
    backgrounds,
  },
  data() {
    return {
      active: -1,
      activeTabName: "material",
      openClose: false,
      menuList: [
        {
          text: "素材",
          name: "material",
        },
        {
          text: "文字",
          name: "word",
        },
        {
          text: "背景",
          name: "background",
        },
      ],
    };
  },
  methods: {
    tabsClick(index, name) {
      this.active = index;
      let leftctnt = document.getElementsByClassName("left-panel-content")[0];
      leftctnt.style.left = 72 + "px";
      this.activeTabName = name;
      this.openClose = true;
      // this.setLeftState(this.openClose);
      // this.$emit("openClose", this.openClose);
    },
    handleChangeContent(name) {
      let index = this.menuList.findIndex((x) => {
        return x["name"] === name;
      });
      if (index > -1) {
        this.tabsClick(index, name);
      }
    },
    shousuo() {
      this.openClose = !this.openClose;
      let leftctnt = document.getElementsByClassName("left-panel-content")[0];
      this.openClose
        ? (leftctnt.style.left = 72 + "px")
        : (leftctnt.style.left = -188 + "px");
      // this.setLeftState(this.openClose);
      this.$emit("openClose", this.openClose);
    },
  },
};
</script>
<style lang="less" scoped>
.left-panel {
  width: 72px;
  height: calc(100vh - 56);
  display: flex;
  position: relative;
  transition: all 0.3s linear;
  z-index: 3;
  .left-panel-menu {
    background: #2c3136;
    overflow: hidden;
    z-index: 2;
    height: 100%;
  }
  .leftPanel-menu-button {
    width: 72px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    color: #fff;
    font-size: 14px;
    &:hover {
      background: #4c535c;
      cursor: pointer;
      color: #ddd;
    }
  }
  .active {
    background: #4c535c;
    cursor: pointer;
    color: #ddd;
  }
}
.left-panel-content {
  width: 260px;
  height: 100%;
  position: absolute;
  // left: -188px;
  left: -188px;
  transition: 0.3s linear;
  .left-panel-mainContent-toggle {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    right: -20px;
    text-align: center;
    align-items: center;
    background: #24272a;
    border-radius: 0 4px 4px 0;
    box-shadow: 2px 0 10px 0 rgba(0, 0, 0, 0.532);
    line-height: 80px;
    width: 20px;
    cursor: pointer;
    opacity: 0.7;
  }
}

.left-panel-content:after {
  display: block;
  clear: both;
  height: 0;
  overflow: hidden;
}
// 动画
.jello-horizontal {
  animation: jello-horizontal 0.9s;
}
@keyframes jello-horizontal {
  0% {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}
</style>
