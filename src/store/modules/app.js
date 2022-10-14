import { fabric } from "fabric";
import FontFaceObserver from "fontfaceobserver";
const app = {
  state: {
    // 画布
    canvas: null,
    type: "", //选择对象的类型
    // 选择的对象
    selectedObj: null,
    // 填充的颜色
    fillColor: "transparent",
    // 线框颜色
    strokeColor: "#000",
    // 选择的工具
    selectTool: "brush",
    lineSize: 50,

    // 画笔虚线长度
    dashLine: 0,
    dashBetween: 0,
    dashSmooth: 0,
    // 画布状态
    canvasState: null,
    // 复制
    _clipboard: null,
    // 阴影颜色
    shadowColor: "#ddd",
    // 模糊程度
    blur: 10,
    // 偏移量
    offsetValue: 10,
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
    //设置选择的工具
    SET_SELECTEDTOOL: (state, object) => {
      state.selectTool = object;
    },
    SET_TYPE: (state) => {
      state.type = "";
    },
    SET_FILLCOLOR: (state, color) => {
      state.fillColor = color;
    },
    SET_STROKECOLOR: (state, color) => {
      state.strokeColor = color;
    },
    SET_SHADOWCOLOR: (state, color) => {
      state.shadowColor = color;
    },
    SET_BLUR: (state, value) => {
      state.blur = value;
    },
    SET_OFFSETVALUE: (state, value) => {
      state.offsetValue = value;
    },
    SET_DASHLINE: (state, value) => {
      state.dashLine = value;
    },
    SET_DASHBETWEEN: (state, value) => {
      state.dashBetween = value;
    },
    SET_DASHSMOOTH: (state, value) => {
      state.dashSmooth = value;
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
    SET_LINESIZE: (state, value) => {
      state.lineSize = value;
    },
    SET_BAKCGROUNDIMG: (state, obj) => {
      state.canvas.setBackgroundColor("", undefined, {
        erasable: false,
      });
      state.canvas.setBackgroundImage(obj);
      state.canvas.backgroundImage = obj;
      console.log(obj, "obj", state.canvas.backgroundImage);
      state.canvas.requestRenderAll();
    },
    SET_BRUSH(state) {
      console.log(state.canvas);
      // state.canvas.freeDrawingBrush = new fabric.PencilBrush(state.canvas);
      state.canvas.isDrawingMode = true;
      state.canvas.requestRenderAll();
    },
    SET_CLEAR(state) {
      state.canvas.clear();
      state.canvas.setBackgroundColor("rgba(220,220,220,1)", undefined, {
        erasable: false,
      });
      state.canvas.requestRenderAll();
    },
  },
  actions: {
    //
    addWord({ state, commit }, px) {
      //得到屏幕的中心
      const textbox = new fabric.IText("双击修改文字", {
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
      commit("SET_SELECTEDOBJ", textbox);
      commit("SET_SELECTEDTOOL", "move");

      // 文本打开编辑模式
      // textbox.enterEditing();
      // textbox.hiddenTextarea.focus();
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
          commit("SET_SELECTEDOBJ", img);
          commit("SET_SELECTEDTOOL", "move");
        },
        { crossOrigin: "anonymous" }
      );
    },
    copy({ state }) {
      state.canvas.getActiveObject().clone((cloned) => {
        state._clipboard = cloned;
      });
    },
    paste({ commit, state }) {
      // clone again, so you can do multiple copies.
      if (state._clipboard == null) return;

      state._clipboard.clone((clonedObj) => {
        state.canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
          evented: true,
        });
        if (clonedObj.type === "activeSelection") {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = state.canvas;
          clonedObj.forEachObject((obj) => {
            state.canvas.add(obj);
          });
          // this should solve the unselectability
          clonedObj.setCoords();
        } else {
          state.canvas.add(clonedObj);
        }
        state._clipboard.top += 10;
        state._clipboard.left += 10;
        state.canvas.setActiveObject(clonedObj);
        state.canvas.requestRenderAll();
      });

      commit("ADD");
    },
    //删除
    del({ commit, state }, obj = null) {
      if (obj == null) {
        obj = state.canvas.getActiveObject();
      }
      if (obj) {
        if (obj.type == "group") {
          state.canvas.remove(obj);
        } else {
          let arr = obj._objects || [obj];
          arr.map((o) => {
            state.canvas.remove(o);
          });
        }

        //不要选择上对象
        commit("SET_SELECTEDOBJ", null);
        state.canvas.discardActiveObject();
        state.canvas.requestRenderAll();
      }
      // commit("ADD");
    },
    //改变字体
    font({ commit, state }, fname) {
      if (!state.canvas.getActiveObject()) return;

      console.time("字体加载用时");
      var ooo = new FontFaceObserver(fname);
      ooo.load(null, 60000).then(() => {
        //设置字体
        let arr = state.canvas.getActiveObject()._objects || [
          state.canvas.getActiveObject(),
        ];
        arr.map((item) => {
          item.set("fontFamily", fname);
        });
        state.canvas.requestRenderAll();

        //记录历史
        commit("ADD");

        console.timeEnd("字体加载用时");
      });
    },
  },
  getters: {
    selectTool: (state) => state.selectTool,
    selectedObj: (state) => state.selectedObj,
    canvas: (state) => state.canvas,
    changeImgMode: (state) => state.changeImgMode,
    fillColor: (state) => state.fillColor,
    strokeColor: (state) => state.strokeColor,
    lineSize: (state) => state.lineSize,
    shadowColor: (state) => state.shadowColor,
    blur: (state) => state.blur,
    offsetValue: (state) => state.offsetValue,
    dashLine: (state) => state.dashLine,
    dashBetween: (state) => state.dashBetween,
    dashSmooth: (state) => state.dashSmooth,
  },
};
export default app;
