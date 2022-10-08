<template>
  <div class="center-panel">
    <canvas id="canvas"></canvas>
    <!-- 底部按钮区域 -->
    <div class="bottom-btn">
      <div class="btn" title="缩放画布" @click="tapScaleBtn(0)">-</div>
      <div>{{ scaleValue }}%</div>
      <div class="btn" title="放大画布" @click="tapScaleBtn(1)">+</div>
    </div>
  </div>
</template>
<script>
import { fabric } from "fabric";
import "./utils/eraser_brush.mixin"; //引入可以作为橡皮擦的插件
export default {
  name: "p-center-panel",
  data() {
    return {
      canvas: null,
      stateArr: [],
      stateIdx: -1,
      scaleValue: 100,
    };
  },
  methods: {
    // 初始化画布
    initDraw() {
      //画布大小
      let canvasWidth =
        document.getElementsByClassName("center-panel")[0].offsetWidth * 0.97;
      let canvasHeight =
        document.getElementsByClassName("center-panel")[0].offsetHeight * 0.89;

      if (!this.canvas) {
        this.canvas = new fabric.Canvas("canvas", {
          width: canvasWidth,
          height: canvasHeight,
          isDrawingMode: false,
          selectionColor: "rgba(0,0,0,0)",
          selectionLineWidth: 0,
          backgroundVpt: false, // 设置背景色不受缩放与平移的影响
          hoverCursor: "default", // 设置当前鼠标停留在
          uniformScaling: false,
        });
        this.canvas.selection = true;

        // 设置画布背景色 (背景色需要这样设置，否则拓展的橡皮功能会报错)
        this.canvas.setBackgroundColor("rgba(220,220,220,1)", undefined, {
          erasable: false,
        });

        // 监听鼠标按下事件
        this.canvas.on("mouse:down", (options) => {
          console.log(options);
        });

        this.canvas.on({
          // 鼠标滚动缩放
          "mouse:wheel": () => {
            this.tapScaleBtn(event.deltaY);
          },
        });

        this.canvas.on({
          // 鼠标旋转
          "object:rotating": (e) => {
            console.log("rotato", e);
          },
        });
        this.canvas.requestRenderAll();

        // 记录画布原始状态
        this.stateArr.push(JSON.stringify(this.canvas));
        this.stateIdx = 0;
        this.$store.commit("INIT_CANVAS", this.canvas);
        this.$store.commit("SET_STATEARR", this.stateArr);
      }
    },
    // 缩放按钮点击
    tapScaleBtn(flag) {
      // flag -1 缩小 1 放大
      let zoom = this.canvas.getZoom();

      zoom = flag > 0 ? zoom + 0.05 : zoom - 0.05; //判断缩放
      // zoom 不能大于 3 不能小于0.1
      zoom = Math.max(0.01, zoom); //最小为原来的1/10
      zoom = Math.min(1, zoom); //最大是原来的3倍

      let zoomPoint = new fabric.Point(500, 500); // 中心点
      this.canvas.zoomToPoint(zoomPoint, zoom);
      this.scaleValue = Math.round(zoom * 500);
    },
    autoZoom() {
      let zoom = this.canvas.getZoom() / 5;
      let zoomPoint = new fabric.Point(500, 500); // 中心点
      this.canvas.zoomToPoint(zoomPoint, zoom);
      this.scaleValue = Math.round(zoom * 500);
    },
    // 试图调整
    resizeHeight() {
      const that = this;
      this.$nextTick(() => {
        that.$forceUpdate();

        let canvasWidth =
          document.getElementsByClassName("center-panel")[0].offsetWidth * 0.97;
        let canvasHeight =
          document.getElementsByClassName("center-panel")[0].offsetHeight *
          0.89;
        this.canvas.setHeight(canvasHeight);
        this.canvas.setWidth(canvasWidth);
      });
    },
  },
  mounted() {
    this.initDraw();
    this.autoZoom();
  },
};
</script>
<style lang="less">
.center-panel {
  width: 100%;
  height: calc(100vh - 56px);
  padding: 20px;
  background: #1d2023;
  position: relative;
  #canvas {
    box-shadow: 5px 0 10px 0 rgba(0, 0, 0, 0.532);
  }
  .bottom-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 120px;
    height: 38px;
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 20px;
    color: #fff;
    opacity: 0.8;
    z-index: 9999;
  }
  .btn {
    width: 40px;
    height: 38px;
    line-height: 38px;
    cursor: pointer;
    text-align: center;
    font-size: 20px;
    &:hover {
      background: rgba(221, 221, 221, 0.175);
    }
  }
}
</style>
