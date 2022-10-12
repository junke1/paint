<template>
  <div class="section-lazyonload">
    <div class="background-section">
      <p class="colors-title">主题颜色</p>
      <div class="background-colors">
        <span
          :title="selectColor"
          class="color-item-select"
          :style="'background:' + selectColor"
        ></span>
        <span title="取色器" class="color-item-select add-color">
          <el-color-picker
            size="mini"
            show-alpha
            v-model="selectColor"
            @change="handleChoiceColor"
          ></el-color-picker>
        </span>
      </div>

      <p class="colors-title">预设颜色</p>
      <div class="background-colors">
        <div v-for="item in listColorInfo" :key="item">
          <div
            v-if="item == ''"
            title="透明"
            class="color-item transparent"
            @click="handleChoiceColor(null)"
          ></div>
          <div
            v-else
            :title="item"
            :style="'background:' + item"
            class="color-item"
            @click="handleChoiceColor(item)"
          ></div>
        </div>
      </div>
      <div class="background-custom-top">
        <div id="ss-upload">
          <input
            type="file"
            id="uploadBackground"
            @change="handleChoiceFile($event)"
            accept="image/svg+xml,image/jpeg,image/png,image/gif,image/psd"
            style="display: none"
          />
        </div>
        <button class="left-panel-button" @click="AddBeiJing">
          自定义背景
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { fabric } from "fabric-with-erasing";
export default {
  name: "p-background",
  data() {
    return {
      selectColor: "",
      listColorInfo: [
        "",
        "#ffffff",
        "#000000",
        "#545454",
        "#737373",
        "#a6a6a6",
        "#d9d9d9",
        "#ff1716",
        "#ff5757",
        "#ff66c3",
        "#cc6de5",
        "#8c52ff",
        "#5e17eb",
        "#02989d",
        "#5de0e6",
        "#39b7ff",
        "#5371fe",
        "#024aad",
        "#008038",
        "#7ed957",
        "#cae265",
        "#ffde59",
        "#ffbd58",
        "#ff904d",
      ],
    };
  },
  computed: {},
  methods: {
    /**
     * 颜色改变
     */
    handleChoiceColor(color) {
      if (color == null) {
        this.selectColor = "";
      }
      this.$store.commit("SET_BAKCGROUND", color);
      this.$store.commit("ADD");
    },
    AddBeiJing() {
      document.getElementById("uploadBackground").click();
    },
    handleChoiceFile(event) {
      let val = event.target.value;
      if (val === undefined || val === null || val.length === 0) {
        return;
      }
      let file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      let canvas = this.$store.state.app.canvas;
      let commit = this.$store.commit;
      console.log(file);
      reader.onload = function () {
        // 转换成base64格式
        const base64Img = reader.result;
        fabric.Image.fromURL(base64Img, function (img) {
          img.set({
            scaleX: canvas.getWidth() / img.width,
            scaleY: canvas.getHeight() / img.height,
            originX: "left",
            originY: "top",
          });
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
          });
          canvas.backgroundImage = img;
          console.log(img, canvas.backgroundImage);
          canvas.setBackgroundColor("", undefined, {
            erasable: false,
          });
          canvas.renderAll.bind(canvas);
          commit("ADD");
        });
      };
    },
  },
};
</script>
<style lang="less">
.section-lazyonload {
  width: 260px;
  height: calc(100vh -56px);
  position: relative;
  background: #202427;
  .background-section {
    padding: 10px;
    .colors-title {
      color: #fff;
    }
    .background-colors {
      min-height: 50px;
      padding: 10px 0;
      display: flex;
      flex-wrap: wrap;
    }
    .color-item-select {
      width: 30px;
      height: 30px;
      position: absolute;
      background: #fff;
      border-radius: 4px;
    }
    .add-color {
      opacity: 0;
    }
    .color-item {
      width: 30px;
      height: 30px;
      border-radius: 4px;
      margin: 4px;
      cursor: pointer;
      border: 1px solid #ddd;
    }
    .transparent {
      background: url("https://www.chuangkit.com/designdist/leftpanel-transparent.png?a63ff4a199ba56dfa71e875fd7c79144")
        no-repeat;
      background-size: 36px 36px;
      background-position: center;
    }
    .left-panel-button {
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #fff;
      width: 100%;
      height: 30px;
      &:active {
        background: #ddd;
      }
    }
  }
}
</style>
