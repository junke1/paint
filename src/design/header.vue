<template>
  <div class="header">
    <div class="header-box">
      <div class="logo">随笔</div>
      <div class="header-right" style="margin-right: 10px">
        <div title="撤销" @click="_undo">
          <i class="el-icon-back"></i>
        </div>
        <div title="恢复" @click="_redo">
          <i class="el-icon-right"></i>
        </div>
        <div title="预览" @click="handlePreview">平面预览</div>
        <div title="导出" @click="convertToImagen">导出</div>
      </div>
    </div>
    <el-dialog title="平面预览" :visible.sync="isShowPreview" width="880px">
      <div style="height: 420px; padding-top: 10px">
        <img
          :src="previewImgPath"
          style="height: 100%; width: 100%; max-height: 880px"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
// import { fabric } from "fabric";
export default {
  name: "p-header",
  data() {
    return {
      previewImgPath: "",
      isShowPreview: false, //是否显示预览图片
    };
  },
  // computed: {
  //   ...mapGetters(["canvas", "undoList", "redoList"]),
  // },
  // watch: {
  //   isShowPreview: function (val) {
  //     if (!val) {
  //       let listLines = this.$store.state.app.listLines;
  //       for (let item of listLines) {
  //         item.set("stroke", "#FF1E00");
  //         this.canvas.requestRenderAll();
  //       }
  //       this.$store.state.app.centerRect.set("stroke", "#8f8e8e");
  //       this.canvas.requestRenderAll();
  //     }
  //   },
  // },
  methods: {
    convertToImagen() {
      // 导出
      this.handleExportImg().then((res) => {
        const link = document.createElement("a");
        link.download = "canvas.png";
        link.href = res;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    ...mapActions(["setPreviewImg"]),
    //撤销
    _undo() {
      this.$store.commit("UNDO");
    },
    //反撤销
    _redo() {
      this.$store.commit("REDO");
    },

    /**
     * 平面预览
     */
    handlePreview() {
      this.handleExportImg().then((res) => {
        this.previewImgPath = res;
        this.isShowPreview = true;
      });
    },
    /**
     * 导出图片信息
     */
    handleExportImg() {
      const canvas = this.$store.state.app.canvas;

      return new Promise((resolve) => {
        if (!canvas) {
          resolve("");
          return;
        }
        let top = 0;
        let left = 0;
        let width = canvas.width;
        let height = canvas.height;
        const dataURL = canvas.toDataURL({
          format: "png",
          left,
          top,
          width,
          height,
        });
        resolve(dataURL);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  min-width: 1120px;
  box-sizing: border-box;
  background-color: #343a40;
  box-shadow: 0 10px 10px 0 rgba(23, 23, 23, 0.378);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .header-box {
    height: 56px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .logo {
      color: #fff;
      font-size: 18px;
      margin-left: 20px;
      font-weight: bold;
    }
    .header-right {
      margin-left: 11px;
      display: flex;
      height: 100%;
      align-items: center;
      font-size: 14px;
      color: #fff;
      div {
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin: 0 5px;
        padding: 0 5px;
        cursor: pointer;
        &:hover {
          background: #4c535c;
          border-radius: 4px;
        }
      }
    }
  }
}
.v-modal {
  z-index: 0 !important;
}

/deep/ .el-dialog__body {
  padding-top: 0;
  padding-bottom: 12px;
}
/deep/ .el-dialog__header {
  background: rgb(241, 241, 241);
}
</style>
