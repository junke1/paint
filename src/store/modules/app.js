import { fabric } from "fabric";
const app = {
  state: {
    // 画布
    canvas: null,
    type: "", //选择对象的类型
    // 选择的对象
    selectedObj: null,
    // 画布状态
    canvasState: null,

    // 撤销队列
    stateArr: [],
    stateIdx: -1,

    // 预览的图片
    previewImg: null,

    // 默认折叠状态
    leftState: false,
    rightState: false,

    zoom: 1, //当前缩放比例
    changeImgMode: -1, //更换图片类型 -1 正常操作 0 左侧素材更换 1 本地上传更换
  },
  mutations: {
    //初始化画布
    INIT_CANVAS: (state, fCanvas) => {
      state.canvas = fCanvas;
    },

    //左边状态
    SET_LEFTSTATE: (state, v) => {
      state.leftState = v;
    },

    //右边状态
    SET_RIGHTSTATE: (state, v) => {
      state.rightState = v;
    },

    //设置选择的对象
    SET_SELECTEDOBJ: (state, object) => {
      state.selectedObj = object;
      state.type = object ? object.type : "";
    },

    //设置状态
    SET_CANVASSTATE: (state, canvasState) => {
      state.canvasState = canvasState;
    },

    // 记录操作，方便撤销
    SET_STATEARR: (state, arrValue) => {
      state.stateArr = arrValue;
      state.stateIdx = 0;
    },
    ADD: (state) => {
      state.stateArr.push(JSON.stringify(state.canvas));
      state.stateIdx++;
      if (state.stateArr.length > 4) {
        state.stateArr.shift();
        state.stateIdx--;
      }
      console.log(state, state.stateArr, state.stateIdx, "add");
      state.canvas.requestRenderAll();
    },
    UNDO: (state) => {
      if (state.stateIdx > 0) {
        state.stateIdx = --state.stateIdx;
        state.canvas.loadFromJSON(state.stateArr[state.stateIdx]);
        if (state.canvas.getObjects().length > 0) {
          state.canvas.getObjects().forEach((item) => {
            item.set("selectable", false);
          });
        }
      }
      console.log(state.stateIdx, state.stateArr.length);
      state.canvas.requestRenderAll();
    },
    REDO: (state) => {
      if (state.stateIdx < state.stateArr.length - 1) {
        state.stateIdx = ++state.stateIdx;
        state.canvas.loadFromJSON(state.stateArr[state.stateIdx]);
        if (state.canvas.getObjects().length > 0) {
          state.canvas.getObjects().forEach((item) => {
            item.set("selectable", false);
          });
        }
      }
      console.log(state.stateIdx, state.stateArr.length);
      state.canvas.requestRenderAll();
    },
    KEEP_LENGTH: (state) => {
      state.stateArr.shift();
      state.stateIdx--;
      state.canvas.requestRenderAll();
    },
    // 仅设置颜色
    SET_BAKCGROUND: (state, obj) => {
      state.canvas.setBackgroundColor(obj, undefined, {
        erasable: false,
      });
      state.canvas.setBackgroundImage(
        null,
        state.canvas.renderAll.bind(state.canvas)
      );
      state.canvas.requestRenderAll();
    },
  },
  actions: {
    //
    addWord({ state, commit }, px) {
      //得到屏幕的中心
      const textbox = new fabric.Textbox("双击修改文字", {
        left:
          state.canvas.width / 2 / state.canvas.getZoom() -
          //减去内部偏移
          state.canvas.viewportTransform[4] / state.canvas.getZoom(),
        top:
          state.canvas.height / 2 / state.canvas.getZoom() -
          state.canvas.viewportTransform[5] / state.canvas.getZoom(),
        fontSize: px,
        hasControls: true,
        hasBorders: true,
        originX: "center",
        originY: "center",
        fontWeight: 400,
        charSpacing: 3,
        opacity: 1,
        lineHeight: 1.3,
      });
      state.canvas.add(textbox).setActiveObject(textbox);
      commit("ADD");

      // 文本打开编辑模式
      textbox.enterEditing();
      textbox.hiddenTextarea.focus();
    },
    //显示图片
    addImage({ state, commit }, url) {
      fabric.Image.fromURL(
        url,
        (img) => {
          img.set({
            angle: 0,
            left:
              state.canvas.width / 2 / state.canvas.getZoom() -
              //减去内部偏移
              state.canvas.viewportTransform[4] / state.canvas.getZoom(),
            top:
              state.canvas.height / 2 / state.canvas.getZoom() -
              state.canvas.viewportTransform[5] / state.canvas.getZoom(),
            opacity: 1,
            originX: "center",
            originY: "center",
            borderColor: "black",
            cornerColor: "black",
            cornerSize: 14,
            hasControls: true,
            hasBorders: true,
          });
          state.canvas.add(img).setActiveObject(img);
          img.set("selectable", true);
          commit("ADD");
        },
        { crossOrigin: "anonymous" }
      );
    },
  },
};
export default app;
