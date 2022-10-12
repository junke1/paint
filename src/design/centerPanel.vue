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
import { fabric } from "fabric-with-erasing";
import { mapGetters } from "vuex";
// import "./libs/eraser_brush.mixin"; //引入可以作为橡皮擦的插件
export default {
  name: "p-center-panel",
  data() {
    return {
      canvas: null,
      stateArr: [],
      stateIdx: -1,
      scaleValue: 100,
      isDrawing: false,
      mouseFrom: {},
      mouseTo: {},
      // lineSize: 50,
      drawingObject: null,
      freeDrawingBrush: null,
      eraser: null,
      painterBroad: null,
    };
  },
  computed: {
    ...mapGetters([
      "selectTool",
      "fillColor",
      "strokeColor",
      "lineSize",
      "shadowColor",
      "blur",
      "offsetValue",
    ]),
  },
  watch: {
    strokeColor: {
      handler(newValue) {
        if (this.canvas.freeDrawingBrush) {
          this.canvas.freeDrawingBrush.color = newValue;
        }
      },
    },
    selectTool: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue != "brush") {
            this.$set(this.canvas, "freeDrawingBrush", null);
            this.canvas.isDrawingMode = false;
          } else {
            this.$set(this.canvas, "freeDrawingBrush", this.freeDrawingBrush);
            this.canvas.isDrawingMode = true;
          }
        }
      },
      deep: true,
    },
    "$store.state.app.leftState"() {
      this.resizeHeight();
    },

    "$store.state.app.rightState"() {
      this.resizeHeight();
    },
  },
  methods: {
    // 初始化画布
    initDraw() {
      //画布大小
      this.painterBroad = document.getElementsByClassName("center-panel")[0];
      let canvasWidth = this.painterBroad.offsetWidth * 0.966;
      let canvasHeight = this.painterBroad.offsetHeight * 0.89;
      if (!this.canvas) {
        this.canvas = new fabric.Canvas("canvas", {
          width: canvasWidth,
          height: canvasHeight,
          isDrawingMode: true,
          selectionColor: "#fff",
          selectionLineWidth: 0,
          backgroundVpt: false, // 设置背景色不受缩放与平移的影响
          hoverCursor: "default", // 设置当前鼠标停留在
        });
        this.canvas.selection = false;
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.width = 50;
        this.canvas.freeDrawingBrush.selection = false;
        console.log(this.strokeColor);
        this.canvas.freeDrawingBrush.color = this.strokeColor;
        // 设置画布背景色 (背景色需要这样设置，否则拓展的橡皮功能会报错)
        this.canvas.setBackgroundColor("rgba(220,220,220,1)", undefined, {
          erasable: false,
        });
        this.initCanvasEvent();
        this.freeDrawingBrush = this.canvas.freeDrawingBrush;

        this.canvas.requestRenderAll();

        // 记录画布原始状态
        this.stateArr.push(JSON.stringify(this.canvas));
        this.stateIdx = 0;
        this.$store.commit("INIT_CANVAS", this.canvas);
        this.$store.commit("SET_STATEARR", this.stateArr);

        window.addEventListener("resize", () => {
          this.resizeHeight();
        });
        // this.initBruch(this.canvas);
      }
    },
    initCanvasEvent() {
      // 操作类型集合
      let toolTypes = [
        "brush",
        "line",
        "rect",
        "circle",
        "text",
        "move",
        "eraser",
      ]; //'eraser'
      // 监听鼠标按下事件
      this.canvas.on("mouse:down", (options) => {
        // 判断当前是否选择了集合中的操作
        if (toolTypes.indexOf(this.selectTool) != -1) {
          // 记录当前鼠标的起点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
          this.mouseFrom.x = options.e.clientX - this.canvas._offset.left;
          this.mouseFrom.y = options.e.clientY - this.canvas._offset.top;
          // 设置当前正在进行绘图 或 移动操作
          this.isDrawing = true;
        }
        if (this.selectTool == "move") {
          this.$store.commit("SET_SELECTEDOBJ", options.target);
          console.log(options.target);
        }
        if (this.selectTool == "eraser") {
          this.$set(this.canvas, "freeDrawingBrush", null);
          this.canvas.isDrawingMode = false;
          this.initEraser(options.target);
        }
      });

      this.canvas.on({
        // 鼠标滚动缩放
        "mouse:wheel": () => {
          this.tapScaleBtn(event.deltaY);
        },
      });

      // 监听鼠标移动事件
      this.canvas.on("mouse:move", (options) => {
        // 如果当前正在进行绘图或移动相关操作
        if (this.isDrawing) {
          // 记录当前鼠标移动终点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
          this.mouseTo.x = options.e.clientX - this.canvas._offset.left;
          this.mouseTo.y = options.e.clientY - this.canvas._offset.top;
          // this.mouseTo.x = options.e.clientX - this.canvas._offset.left;
          // this.mouseTo.y = options.e.clientY - this.canvas._offset.top;
          let self = this;
          this.canvas.isDrawingMode = false;
          if (!this.canvas.isDrawingMode) {
            switch (this.selectTool) {
              case "line":
                // 当前绘制直线，初始化直线绘制
                self.initLine();
                break;
              case "rect":
                // 初始化 矩形绘制
                self.initRect();
                break;
              case "circle":
                // 初始化 绘制圆形
                self.initCircle();
                break;
              case "move":
                // 初始化画布移动
                self.initMove();
                break;
              case "brush":
                // 初始化画笔
                self.initBruch(this.canvas);
                break;
            }
          }
        }
      });

      // 监听鼠标松开事件
      this.canvas.on("mouse:up", () => {
        // 如果当前正在进行绘图或移动相关操作
        if (this.isDrawing) {
          // 清空鼠标移动时保存的临时绘图对象
          this.drawingObject = null;
          // 重置正在绘制图形标志
          this.isDrawing = false;
          // 清空鼠标保存记录
          this.resetMove();
          // recordAdd();
          // 如果当前进行的是移动操作，鼠标松开重置当前视口缩放系数
          if (this.selectTool == "move") {
            this.canvas.setViewportTransform(this.canvas.viewportTransform);
          }
        }
        this.$store.commit("ADD");
      });
    },
    // 初始化画笔工具
    initBruch(canvas) {
      // 设置绘画模式画笔类型为 铅笔类型
      this.canvas.isDrawingMode = true;
      this.$set(canvas, "freeDrawingBrush", this.freeDrawingBrush);
      // 画笔投影
      canvas.freeDrawingBrush.shadow = this.createShadow();
    },
    createShadow() {
      let shadow = new fabric.Shadow({
        color: this.shadowColor,
        blur: this.blur * 10,
        offsetX: this.offsetValue * 50,
        offsetY: this.offsetValue * 60,
      });
      return shadow;
    },

    //初始化 绘制直线
    initLine() {
      // 根据保存的鼠标起始点坐标 创建直线对象
      let canvasObject = new fabric.Line(
        [
          this.getTransformedPosX(this.mouseFrom.x),
          this.getTransformedPosY(this.mouseFrom.y),
          this.getTransformedPosX(this.mouseTo.x),
          this.getTransformedPosY(this.mouseTo.y),
        ],
        {
          fill: this.fillColor,
          stroke: this.strokeColor,
          strokeWidth: Number(this.lineSize),
          shadow: this.createShadow(),
        }
      );
      // 绘制 图形对象
      this.startDrawingObject(canvasObject);
    },

    // 初始化 绘制矩形
    initRect() {
      // 计算矩形长宽
      let left = this.getTransformedPosX(this.mouseFrom.x);
      let top = this.getTransformedPosY(this.mouseFrom.y);
      let width = (this.mouseTo.x - this.mouseFrom.x) * 5;
      let height = (this.mouseTo.y - this.mouseFrom.y) * 5;
      // 创建矩形 对象
      let canvasObject = new fabric.Rect({
        left,
        top,
        width,
        height,
        stroke: this.strokeColor,
        fill: this.fillColor,
        strokeWidth: Number(this.lineSize),
        shadow: this.createShadow(),
      });
      // 绘制矩形
      this.startDrawingObject(canvasObject);
    },

    // 初始化绘制圆形
    initCircle() {
      let left = this.getTransformedPosX(this.mouseFrom.x);
      let top = this.getTransformedPosY(this.mouseFrom.y);
      // 计算圆形半径
      let radius =
        Math.sqrt(
          (this.getTransformedPosX(this.mouseTo.x) - left) *
            (this.getTransformedPosY(this.mouseTo.x) - left) +
            (this.getTransformedPosX(this.mouseTo.y) - top) *
              (this.getTransformedPosY(this.mouseTo.y) - top)
        ) / 2;
      // 创建 原型对象
      let canvasObject = new fabric.Circle({
        left,
        top,
        stroke: this.strokeColor,
        fill: this.fillColor,
        radius,
        strokeWidth: Number(this.lineSize),
        shadow: this.createShadow(),
      });
      // 绘制圆形对象
      this.startDrawingObject(canvasObject);
    },

    // 初始化画布移动
    initMove() {
      this.canvas.isDrawingMode = false;
      let drawObjects = this.canvas.getObjects();
      if (drawObjects.length > 0) {
        drawObjects.map((item) => {
          item.set("selectable", true);
        });
      }
      this.canvas.renderAll();
    },
    // 初始化橡皮擦功能
    initEraser(obj) {
      this.$store.dispatch("del", obj);
    },

    // 绘制图形
    startDrawingObject(canvasObject) {
      // 禁止用户选择当前正在绘制的图形
      canvasObject.selectable = false;
      // 如果当前图形已绘制，清除上一次绘制的图形
      if (this.drawingObject) {
        this.canvas.remove(this.drawingObject);
      }
      // 将绘制对象添加到 canvas中

      this.canvas.add(canvasObject);
      // 保存当前绘制的图形
      this.drawingObject = canvasObject;
    },
    // 计算画布移动之后的x坐标点
    getTransformedPosX(x) {
      let zoom = Number(this.canvas.getZoom());
      return (x - this.canvas.viewportTransform[4]) / zoom;
    },
    getTransformedPosY(y) {
      let zoom = Number(this.canvas.getZoom());
      return (y - this.canvas.viewportTransform[5]) / zoom;
    },
    // 清空鼠标移动记录 （起点 与 终点）
    resetMove() {
      this.mouseFrom = {};
      this.mouseTo = {};
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

        //设置最终视窗大小
        //注意border 1px
        this.canvas.setHeight(
          document.getElementsByClassName("center-panel")[0].offsetHeight * 0.88
        );
        this.canvas.setWidth(
          document.getElementsByClassName("center-panel")[0].offsetWidth * 0.966
        );
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
