<template>
  <div class="box">
    <canvas
      id="canvas"
      width="600"
      height="600"
      style="border: 1px solid #ccc"
    ></canvas>
  </div>
</template>

<script>
import { fabric } from "fabric-with-erasing";
export default {
  name: "de-mo",
  data() {
    return {
      canvas: null,
    };
  },
  methods: {
    init() {
      this.canvas = new fabric.Canvas("canvas", {
        isDrawingMode: true, // 开启绘图模式
      });
      const rect = new fabric.Rect({
        top: 30, // 距离容器顶部 30px
        left: 30, // 距离容器左侧 30px
        width: 300, // 宽 100px
        height: 300, // 高 60px
        fill: "red", // 填充 红色
      });
      rect.set("selectable", true);
      // 在canvas画布中加入矩形（rect）。add是“添加”的意思
      this.canvas.add(rect);

      // 设置画笔颜色
      this.canvas.freeDrawingBrush.color = "#11999e";

      // // 设置画笔粗细
      this.canvas.freeDrawingBrush = new fabric.SprayBrush(this.canvas);

      // // 更推荐的写法
      // let sprayBrush = new fabric.SprayBrush(canvas);
      // canvas.freeDrawingBrush = sprayBrush;
      this.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: 10,
        offsetX: 10,
        offsetY: 10,
        affectStroke: true,
        color: "#30e3ca",
      });
      this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
      this.canvas.freeDrawingBrush.width = 60;
      this.canvas.freeDrawingBrush.color = "#fff";
      // canvas.freeDrawingBrush.width = 10;
      this.canvas.isDrawingMode = true;
      // // 画笔投影
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<!-- <style lang="less" scoped>
.box {
  width: 900px;
  height: 600px;
  display: flex;

  .tools__x {
    flex: 1;
    box-sizing: border-box;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    :deep(.el-button + .el-button) {
      margin-left: 0;
      margin-top: 10px;
    }
  }

  .control__x {
    width: 100%;
    flex: 1;
    margin-top: 10px;
    box-sizing: border-box;
    padding: 8px;
    background: #d6e6f2;
  }
} -->
<!-- </style> -->
