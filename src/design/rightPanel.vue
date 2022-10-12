<template>
  <div class="right-panel" :style="{ width: rightWidth + 'px' }">
    <div class="page-list" v-if="rightShow">
      <!--文字操作区域-->
      <div class="wordless">
        <template v-if="objType == 'text'">
          <div class="title-info">
            <span>文字</span>
          </div>
          <div class="word-item" v-if="selectedObj">
            <div class="title">颜色：</div>
            <div class="content">
              <el-color-picker
                size="mini"
                show-alpha
                :predefine="predefineColors"
                v-model="selectedObj.fill"
                @change="selectFontColor"
              ></el-color-picker>
            </div>
          </div>
          <div class="word-item">
            <div class="title">字体：</div>
            <div class="content">
              <el-popover
                class="content-popover"
                style="height: 340px; overflow: auto"
                placement="bottom"
                width="250"
                trigger="click"
              >
                <el-row class="fontClass">
                  <el-col :span="24">
                    <el-input
                      placeholder="搜索字体"
                      prefix-icon="el-icon-search"
                      v-model="fontSearch"
                      size="small"
                      style="
                        margin: 12px;
                        margin-bottom: 0;
                        width: calc(100% - 24px);
                      "
                    ></el-input>
                    <el-col
                      :span="24"
                      style="margin: 10px 0; text-align: center"
                    >
                      <el-radio-group
                        @change="fontChange"
                        size="mini"
                        v-model="chnAndEng"
                      >
                        <el-radio-button label="中文"></el-radio-button>
                        <el-radio-button label="英文"></el-radio-button>
                      </el-radio-group>
                    </el-col>
                  </el-col>

                  <el-col v-if="chnOrEng" :span="24" class="all-font">
                    <div
                      v-for="(li, index) in fontFamilyList.body.officialFonts"
                      :key="index"
                    >
                      <div v-if="li.kindId !== 23">
                        <div
                          class="font-fontfamily-dividing-line"
                          style="text-align: center"
                        >
                          {{ li.kindName }}...
                        </div>
                        <div
                          class="font-fontfamily-selector-inner-li"
                          v-for="(item, index) in li.fonts"
                          :key="index"
                        >
                          <span
                            :style="{ fontFamily: item.fontFamily }"
                            @click="handleChoiceFont(item)"
                            >{{ item.fontName }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </el-col>

                  <el-col v-if="!chnOrEng" :span="24" class="all-font">
                    <div
                      v-for="(li, index) in fontFamilyList.body.officialFonts"
                      :key="index"
                    >
                      <div v-if="li.kindId == 23">
                        <div
                          class="font-fontfamily-dividing-line"
                          style="text-align: center"
                        >
                          {{ li.kindName }}
                        </div>
                        <div
                          class="font-fontfamily-selector-inner-li"
                          v-for="(item, index) in li.fonts"
                          :key="index"
                        >
                          <span
                            :style="{ fontFamily: item.fontFamily }"
                            @click="handleChoiceFont(item)"
                            >{{ item.fontName }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <div
                  slot="reference"
                  style="width: 172px"
                  :style="{ fontFamily: selectFont.fontFamily }"
                >
                  {{ selectFont.fontName }}
                </div>
              </el-popover>
            </div>
          </div>
          <div class="word-item" v-if="selectedObj">
            <div class="title">字号：</div>
            <el-select
              class="select-item"
              v-model="selectedObj.fontSize"
              placeholder="请选择"
              @change="selectFontSize"
            >
              <el-option
                v-for="(font, index) in fontSizeList"
                :key="index"
                :label="font"
                :value="font"
              >
              </el-option>
            </el-select>
          </div>
        </template>
        <template v-if="objType == 'image'">
          <div class="title-info">
            <span>图片</span>
          </div>
          <div class="word-item">
            <div class="title">宽度：</div>
            <div class="size-class">
              <el-input
                size="small"
                type="number"
                v-model="sizewidth"
                @keyup.enter.native="changeSize"
                @blur="changeSize"
              >
                <template v-slot:append>mm</template>
              </el-input>
            </div>
          </div>

          <div class="word-item" v-if="selectedObj">
            <div class="title">高度：</div>
            <div class="size-class">
              <el-input
                size="small"
                type="number"
                v-model="sizeheight"
                @keyup.enter.native="changeSize"
                @blur="changeSize"
              >
                <template v-slot:append>mm</template>
              </el-input>
            </div>
          </div>
          <!-- <div class="word-item img-item">
            <div class="title">换图：</div>
            <div class="content img-info">
              <div
                class="img-btn"
                :class="changeImgMode === 0 ? 'active' : ''"
                @click="handleChangeImg(0)"
              >
                左侧选择
              </div>
              <span style="padding-left: 4px; padding-right: 4px">或</span>
              <div
                class="img-btn"
                :class="changeImgMode === 1 ? 'active' : ''"
                @click="handleChangeImg(1)"
              >
                本地上传
              </div>
            </div>
          </div> -->
        </template>
        <template v-if="objType == 'paint'">
          <div class="title-info">
            <span>属性设置</span>
          </div>
          <div class="word-item" v-if="!selectedObj">
            <div class="title">笔宽：</div>
            <div class="size-class">
              <el-input
                size="small"
                type="number"
                v-model="paintwidth"
                @keyup.enter.native="changePaintSize"
                @blur="changePaintSize"
              >
                <template v-slot:append>mm</template>
              </el-input>
            </div>
          </div>
          <div class="word-item" v-if="selectedObj">
            <div class="title">宽度：</div>
            <div class="size-class">
              <el-input
                size="small"
                type="number"
                v-model="sizewidth"
                @keyup.enter.native="changeSize"
                @blur="changeSize"
              >
                <template v-slot:append>mm</template>
              </el-input>
            </div>
          </div>

          <div class="word-item" v-if="selectedObj">
            <div class="title">高度：</div>
            <div class="size-class">
              <el-input
                size="small"
                type="number"
                v-model="sizeheight"
                @keyup.enter.native="changeSize"
                @blur="changeSize"
              >
                <template v-slot:append>mm</template>
              </el-input>
            </div>
          </div>

          <div class="word-item">
            <div class="title">填充颜色：</div>
            <div class="content">
              <el-color-picker
                size="mini"
                show-alpha
                :predefine="predefineColors"
                v-model="fillColor"
                @change="selectFillColor"
              ></el-color-picker>
            </div>
          </div>
          <div class="word-item">
            <div class="title">线框颜色：</div>
            <div class="content">
              <el-color-picker
                size="mini"
                show-alpha
                :predefine="predefineColors"
                v-model="strokeColor"
                @change="selectStrokeColor"
              ></el-color-picker>
            </div>
          </div>
          <div class="word-item" v-if="this.selectTool == 'brush'">
            <div class="title">线长：</div>
            <div class="content" style="width: 50%">
              <el-slider
                v-model="dashLine"
                :show-input-controls="false"
                input-size="mini"
                :min="0"
                :max="100"
                :step="10"
                @change="changeDashLine"
              />
            </div>
          </div>
          <div class="word-item" v-if="this.selectTool == 'brush'">
            <div class="title">间断：</div>
            <div class="content" style="width: 50%">
              <el-slider
                v-model="dashBetween"
                :show-input-controls="false"
                input-size="mini"
                :min="0"
                :max="200"
                :step="10"
                @change="changeDashBetween"
              />
            </div>
          </div>
        </template>
        <div class="word-item">
          <div class="title">阴影颜色：</div>
          <div class="content">
            <el-color-picker
              size="mini"
              show-alpha
              :predefine="predefineColors"
              v-model="shadowColor"
              @change="selectShadowColor"
            ></el-color-picker>
          </div>
        </div>
        <div class="word-item">
          <div class="title">模糊度：</div>
          <div class="content" style="width: 50%">
            <el-slider
              v-model="blur"
              :show-input-controls="false"
              input-size="mini"
              :min="0"
              :max="20"
              :step="1"
              @change="selectBlur"
            />
          </div>
        </div>
        <div class="word-item">
          <div class="title">偏移量：</div>
          <div class="content" style="width: 50%">
            <el-slider
              v-model="offsetValue"
              :show-input-controls="false"
              input-size="mini"
              :min="0"
              :max="10"
              :step="0.1"
              @change="selectOffsetValue"
            />
          </div>
        </div>
        <div class="word-item word-item-style" v-if="selectedObj">
          <template v-if="objType == 'text'">
            <!--斜体-->
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="斜体"
              placement="top"
            >
              <div
                class="style-item"
                @click="selectFontItalic"
                :class="selectedObj.fontStyle == 'italic' ? 'active' : ''"
              >
                <div class="style-info">
                  <div class="icon italic"></div>
                </div>
              </div>
            </el-tooltip>
            <!--下划线-->
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="下划线"
              placement="top"
            >
              <div
                class="style-item"
                @click="selectFontUnderline"
                :class="selectedObj.underline ? 'active' : ''"
              >
                <div class="style-info">
                  <div class="icon underline"></div>
                </div>
              </div>
            </el-tooltip>
            <!--加粗-->
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="加粗"
              placement="top"
            >
              <div
                class="style-item"
                :class="selectedObj.fontWeight > 100 ? 'active' : ''"
              >
                <el-popover placement="bottom" width="300" trigger="click">
                  <el-row class="paddingPopover">
                    <el-col :span="5" style="line-height: 38px">
                      <span>加粗</span>
                    </el-col>
                    <el-col :span="19">
                      <el-slider
                        v-model="selectedObj.fontWeight"
                        show-input
                        :show-input-controls="false"
                        input-size="mini"
                        :min="100"
                        :max="900"
                        :step="100"
                        @change="selectFontWeight"
                      >
                      </el-slider>
                    </el-col>
                  </el-row>
                  <div class="style-info" slot="reference">
                    <div class="icon weight"></div>
                  </div>
                </el-popover>
              </div>
            </el-tooltip>
            <!--对齐-->
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="对齐"
              placement="top"
            >
              <div class="style-item">
                <el-popover
                  class="font-a-choose"
                  placement="bottom"
                  width="205"
                  trigger="click"
                >
                  <div
                    class="align-check"
                    v-for="(li, index) in fontAList"
                    :key="index"
                    style="display: inline-block"
                    :class="
                      getTextAlign() == li.class
                        ? `${li.class} active`
                        : `${li.class}`
                    "
                    @click="selectTextAlign(li.class)"
                  ></div>
                  <div class="style-info" slot="reference">
                    <div
                      :class="'icon align check-' + selectedObj.textAlign"
                    ></div>
                  </div>
                </el-popover>
              </div>
            </el-tooltip>
            <!--间距-->
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="间距"
              placement="top"
            >
              <div class="style-item">
                <el-popover placement="bottom" width="300" trigger="click">
                  <div class="paddingPopover">
                    <el-row>
                      <el-col :span="5" style="line-height: 38px">
                        <span>字间距</span>
                      </el-col>
                      <el-col :span="19">
                        <el-slider
                          :max="1600"
                          :min="3"
                          :step="1"
                          show-input
                          v-model="selectedObj.charSpacing"
                          :show-input-controls="false"
                          input-size="mini"
                          @change="selectCharSpacing"
                        >
                        </el-slider>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="5" style="line-height: 38px">
                        <span>行间距</span>
                      </el-col>
                      <el-col :span="19">
                        <el-slider
                          v-model="selectedObj.lineHeight"
                          :max="20"
                          :min="1"
                          :step="0.1"
                          show-input
                          :show-input-controls="false"
                          input-size="mini"
                          @change="selectLineHeight"
                        >
                        </el-slider>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="style-info" slot="reference">
                    <div class="icon space"></div>
                  </div>
                </el-popover>
              </div>
            </el-tooltip>
          </template>
          <!--图层-->
          <el-tooltip
            :enterable="false"
            effect="dark"
            content="图层"
            placement="top"
          >
            <div class="style-item">
              <el-dropdown
                :hide-on-click="false"
                @command="selectZindex"
                size="medium"
                trigger="click"
              >
                <div class="style-info">
                  <div class="icon layer"></div>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, index) in getZindexList()"
                    :key="index"
                    :disabled="!item.enabled"
                    :command="item.fun"
                    >{{ item.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tooltip>
          <!--透明度-->
          <el-tooltip
            :enterable="false"
            effect="dark"
            content="透明度"
            placement="top"
          >
            <div class="style-item">
              <el-popover placement="bottom" width="300" trigger="click">
                <div class="paddingPopover">
                  <el-row>
                    <el-col :span="5" style="line-height: 38px">
                      <span>透明度</span>
                    </el-col>
                    <el-col :span="19">
                      <el-slider
                        v-model="selectedObj.opacity"
                        :min="0"
                        :max="1"
                        :step="0.1"
                        show-input
                        :show-input-controls="false"
                        input-size="mini"
                        @input="selectOpacity"
                      >
                      </el-slider>
                    </el-col>
                  </el-row>
                </div>
                <div class="style-info" slot="reference">
                  <div class="icon opacity"></div>
                </div>
              </el-popover>
            </div>
          </el-tooltip>
          <!--翻转-->
          <el-tooltip
            :enterable="false"
            effect="dark"
            content="翻转"
            placement="top"
          >
            <div class="style-item">
              <el-dropdown
                :hide-on-click="false"
                @command="selectScale"
                size="medium"
                trigger="click"
              >
                <div class="style-info">
                  <div class="icon reverse"></div>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="z">纵向翻转</el-dropdown-item>
                  <el-dropdown-item command="h">横向翻转</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tooltip>
          <!--锁定-->
          <el-tooltip
            :enterable="false"
            effect="dark"
            content="锁定"
            placement="top"
          >
            <div
              class="style-item"
              @click="selectEvent"
              :class="selectedObj.lockMovementX ? 'active' : ''"
            >
              <div class="style-info">
                <div class="icon lock"></div>
              </div>
            </div>
          </el-tooltip>
        </div>
        <!--复制-->
        <el-button
          style="width: calc(100% - 40px); margin-left: 20px; margin-top: 30px"
          size="small"
          v-if="selectTool == 'move'"
          @click="
            copy();
            paste();
          "
        >
          <span>复制并黏贴</span>
        </el-button>

        <!--删除-->
        <el-button
          style="width: calc(100% - 40px); margin-left: 20px; margin-top: 10px"
          type="info"
          size="small"
          v-if="selectTool == 'move'"
          @click="handleDelInfo"
        >
          <span>删除</span>
        </el-button>
      </div>
    </div>
    <div class="right-panel-mainContent-toggle" @click="shousuo()">
      <div v-show="rightShow" style="color: #fff">
        <i class="el-icon-arrow-right"></i>
      </div>
      <div v-show="!rightShow" style="color: #fff">
        <i class="el-icon-arrow-left"></i>
      </div>
    </div>
    <!-- <input
      type="file"
      id=""
      @change="handleChoiceFile($event)"
      accept="image/svg+xml,image/jpeg,image/png,image/gif,image/psd"
      style="display: none"
    />
    <img
      :src="uploadImgPath"
      id="uploadImgPath"
      style="position: absolute; left: 0; top: 0; z-index: -999"
    /> -->
  </div>
</template>
<script>
import FontFamilys from "@/api/FontInfo/getFontInfo.js";
import { fabric } from "fabric";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "p-right-panel",
  data() {
    return {
      fontFamilyList: FontFamilys,
      fillColor: "#fff",
      strokeColor: "#000",
      shadowColor: "#ddd",
      dashLine: 0,
      dashBetween: 0,
      blur: 1,
      offsetValue: 1,
      paintwidth: 0,
      fontSearch: "", //字体搜索
      chnAndEng: "中文",
      selectFont: {
        fontFamily: "宋体", //字体
        fontName: "宋体", //字体名称
      },
      chnOrEng: true, //当前显示的是中文还是英文
      transition: "left 0.3s linear",
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577",
      ], //颜色
      fontSizeList: [
        6, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 64,
        72, 80, 88, 96, 104, 120, 144, 200, 250, 300, 350, 400, 500, 600, 700,
        800, 900, 1000,
      ], //字体大小
      fontAList: [
        { class: "check-left" }, //左对齐
        { class: "check-center" }, //居中对齐
        { class: "check-right" }, //右对齐
        { class: "check-justify" }, //两端对齐
      ], //对齐文本
      jiacu: 0, //加粗大小
      zijianju: 1600, //字间距
      hangjianju: 1600, //行间距
      isImage: false, //是否是图像
      objType: "image",
      sizewidth: 0, //当前图片宽度
      sizeheight: 0, //当前图片高度
      uploadImgPath: "", //上传的文件地址信息
      rightShow: false,
      rightWidth: 0,
      scaleX: 1,
      scaleY: 1,
    };
  },
  computed: {
    ...mapGetters([
      "canvas",
      "selectedObj",
      "changeImgMode",
      "selectTool",
      "lineSize",
    ]),
  },
  watch: {
    selectedObj: {
      handler(val, oldValue) {
        if (val !== oldValue) {
          let type = "";
          if (val === null || val === undefined) {
            type = "";
          } else {
            type = val.type;
          }
          this.$store.state.app.changeImgMode = -1;
          let fontFamily = "";
          switch (type) {
            case "i-text":
              this.isImage = false;
              this.objType = "text";
              this.rightShow = true;
              this.selectFont = {
                fontFamily: "宋体", //字体
                fontName: "宋体", //字体名称
              };
              if (this.selectedObj.fontFamily !== undefined) {
                fontFamily = this.selectedObj.fontFamily;
              }
              for (let item of this.fontFamilyList.body.officialFonts) {
                let tempIndex = -1;
                for (let _item of item.fonts) {
                  if (_item.fontFamily === fontFamily) {
                    this.selectFont = {
                      fontFamily: fontFamily, //字体
                      fontName: _item.fontName, //字体名称
                    };
                    tempIndex = 0;
                    break;
                  }
                }
                if (tempIndex !== -1) {
                  break;
                }
              }
              break;
            case "image":
              this.isImage = true;
              this.objType = "image";
              this.rightShow = true;
              break;
            case "path":
            case "line":
            case "rect":
            case "circle":
              if (this.selectTool != "eraser") {
                this.isImage = false;
                this.objType = "paint";
                this.rightShow = true;
              }
              break;
            default:
              this.rightShow = false;
              break;
          }
          if (!this.rightShow) {
            this.rightWidth = 0;
          } else {
            this.rightWidth = 248;
          }
          this.$store.commit("SET_RIGHTSTATE", this.rightShow);
          this.getSize();
        }
        if (val && (val.scaleX != this.scaleX || val.scaleY != this.scaleY)) {
          this.getSize();
          this.scaleX = val.scaleX;
          this.scaleY = val.scaleY;
        }
      },
      deep: true,
    },
    selectTool: {
      handler(newValue) {
        if (newValue != "eraser" && newValue != "move") {
          this.rightShow = true;
          this.rightWidth = 248;
          this.objType = "paint";
        } else if (this.selectedObj != null) {
          this.rightShow = true;
          this.rightWidth = 248;
        } else {
          this.rightShow = false;
          this.rightWidth = 0;
        }
        this.$nextTick(function () {
          if (this.canvas.freeDrawingBrush) {
            this.paintwidth = this.canvas.freeDrawingBrush.width;
          } else {
            this.paintwidth = this.lineSize;
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions(["del", "copy", "paste"]),
    handleChangeImg(mode) {
      if (mode === 0) {
        if (this.changeImgMode !== 0) {
          this.$message.success("您点击右侧图片素材即可替换");
          this.$store.state.app.changeImgMode = 0;
        } else {
          this.$store.state.app.changeImgMode = -1;
        }
      } else {
        this.$store.state.app.changeImgMode = 1;
        document.getElementById("uploadBackground").click();
      }
    },
    /**
     * 获取当前图片大小
     */
    getSize() {
      if (this.objType == "image") {
        this.sizewidth =
          this.selectedObj && this.selectedObj.width * this.selectedObj.scaleX;
        this.sizeheight =
          this.selectedObj && this.selectedObj.height * this.selectedObj.scaleY;
      } else if (this.objType == "paint") {
        this.sizewidth =
          this.selectedObj && this.selectedObj.width * this.selectedObj.scaleX;
        this.sizeheight =
          this.selectedObj && this.selectedObj.height * this.selectedObj.scaleY;
      }
    },
    /**
     * 调整当前图片大小
     */
    changeSize() {
      if (this.objType == "image") {
        this.selectedObj.scaleX =
          this.sizewidth / this.selectedObj._element.naturalWidth; //原始的图片大小
        this.selectedObj.scaleY =
          this.sizeheight / this.selectedObj._element.naturalHeight;
      } else if (this.objType == "paint") {
        this.selectedObj.scaleX = this.sizewidth / this.selectedObj.width; //原始的图片大小
        this.selectedObj.scaleY = this.sizeheight / this.selectedObj.height;
      }
      this.$forceUpdate();
      this.canvas.requestRenderAll();
    },
    changePaintSize() {
      if (this.selectTool != "brush") {
        this.$store.commit("SET_LINESIZE", this.paintwidth);
      } else {
        this.canvas.freeDrawingBrush &&
          this.$set(
            this.canvas.freeDrawingBrush,
            "width",
            Number(this.paintwidth)
          );
      }
    },
    changeDashLine() {
      if (this.selectTool == "brush") {
        this.$store.commit("SET_DASHLINE", this.dashLine);
      }
    },
    changeDashBetween() {
      if (this.selectTool == "brush") {
        this.$store.commit("SET_DASHBETWEEN", this.dashBetween);
      }
    },

    //右侧显示不显示
    shousuo() {
      if (this.selectedObj == null || this.selectTool == "eraser") {
        this.$message.info("请选择任一元素进行编辑");
        this.rightWidth = 0;
        return;
      }
      this.rightShow = !this.rightShow;
      if (this.rightShow == false) {
        this.rightWidth = 0;
      } else {
        this.rightWidth = 248;
      }
      // this.setRightState(this.rightShow);
    },
    // 字体颜色
    selectFontColor(color) {
      if (this.selectedObj.shadow) {
        this.selectedObj.shadow.color = color;
      } else {
        let shadow = new fabric.Shadow({
          color: color,
        });
        this.selectedObj.shadow = shadow;
      }
      this.selectedObj.set("fill", color);
      this.canvas.requestRenderAll();
      this.$store.commit("ADD");
    },
    // 填充
    selectFillColor(color) {
      this.$store.commit("SET_FILLCOLOR", color);
      this.selectedObj && this.selectedObj.set("fill", color);
      this.canvas.requestRenderAll();
      this.$store.commit("ADD");
    },
    // 线宽
    selectStrokeColor(color) {
      this.$store.commit("SET_STROKECOLOR", color);
      this.selectedObj && this.selectedObj.set("stroke", color);
      this.canvas.requestRenderAll();
      this.$store.commit("ADD");
    },
    // 设置阴影颜色
    selectShadowColor(color) {
      this.$store.commit("SET_SHADOWCOLOR", color);
      if (this.selectedObj && this.selectedObj.shadow) {
        this.selectedObj.shadow.color = color;
      } else if (this.selectedObj) {
        let shadow = new fabric.Shadow({
          color: color,
          blur: this.blur * 10,
          offsetX: this.offsetValue * 50,
          offsetY: this.offsetValue * 60,
        });
        this.selectedObj.shadow = shadow;
      }
      this.canvas.requestRenderAll();
      this.$store.commit("ADD");
    },
    // 设置模糊度
    selectBlur(value) {
      this.$store.commit("SET_BLUR", value);
      if (this.selectedObj && this.selectedObj.shadow) {
        this.selectedObj.shadow.blur = value;
      } else if (this.selectedObj) {
        let shadow = new fabric.Shadow({
          color: this.shadowColor,
          blur: value * 10,
          offsetX: this.offsetValue * 50,
          offsetY: this.offsetValue * 60,
        });
        this.selectedObj.shadow = shadow;
      }
      this.canvas.requestRenderAll();
      this.$store.commit("ADD");
    },
    // 设置偏移量
    selectOffsetValue(value) {
      this.$store.commit("SET_OFFSETVALUE", value);
      if (this.selectedObj && this.selectedObj.shadow) {
        this.selectedObj.shadow.offsetX = value * 50;
        this.selectedObj.shadow.offsetY = value * 60;
      } else if (this.selectedObj) {
        let shadow = new fabric.Shadow({
          color: this.shadowColor,
          blur: this.blur * 10,
          offsetX: value * 50,
          offsetY: value * 60,
        });
        this.selectedObj.shadow = shadow;
      }
      this.canvas.requestRenderAll();
      this.$store.commit("ADD");
    },
    /**
     * 字体大小改变
     */
    selectFontSize(font) {
      this.selectedObj.fontSize = font;
      this.canvas.requestRenderAll();
    },
    /**
     * 删除操作
     */
    handleDelInfo() {
      this.$store.dispatch("del", this.selectedObj);
      this.rightShow = false;
    },

    /**
     * 字体选择改变
     */
    fontChange() {
      if (this.chnAndEng == "中文") {
        this.chnOrEng = true;
      } else {
        this.chnOrEng = false;
      }
    },
    /**
     * 选择对应的字体
     * @param item 当前字体
     */
    handleChoiceFont(item) {
      this.selectFont = {
        fontFamily: item.fontFamily, //字体
        fontName: item.fontName, //字体名称
      };
      this.$store.dispatch("font", item.fontFamily);
    },

    /**
     * 斜体
     */
    selectFontItalic() {
      this.selectedObj.fontStyle =
        this.selectedObj.fontStyle == "italic" ? "" : "italic";
      //强制刷新
      this.$forceUpdate();
      this.canvas.requestRenderAll();
    },

    /**
     * 下划线
     */
    selectFontUnderline() {
      this.selectedObj.set("underline", !this.selectedObj.underline);
      //强制刷新
      this.$forceUpdate();
      this.canvas.requestRenderAll();
    },

    /**
     * 间距 当前选择数值
     */
    selectCharSpacing(value) {
      this.selectedObj.charSpacing = value;
      this.$forceUpdate();
      this.canvas.requestRenderAll();
    },

    /**
     * 加粗
     */
    selectFontWeight(value) {
      this.selectedObj.fontWeight = value;
      this.$forceUpdate();
      this.canvas.requestRenderAll();
    },

    /**
     * 获取对齐文本
     */
    getTextAlignText() {
      if (this.selectedObj.textAlign == "justify") return "两端对齐";
      if (this.selectedObj.textAlign == "right") return "右对齐";
      if (this.selectedObj.textAlign == "center") return "居中对齐";
      return "左对齐";
    },

    /**
     * 获取对齐class
     */
    getTextAlign() {
      return "check-" + (this.selectedObj.textAlign || "left");
    },

    /**
     * 设置对齐方式
     */
    selectTextAlign(cls) {
      this.selectedObj.textAlign = cls.split("-")[1];
      //强制刷新
      this.$forceUpdate();
      this.canvas.requestRenderAll();
    },

    /**
     * 行高
     * 当前选择数值
     */
    selectLineHeight(value) {
      this.selectedObj.lineHeight = value;
      this.$forceUpdate();
      this.canvas.requestRenderAll();
    },
    bringForward() {
      this.selectedObj.bringForward();

      this.canvas.requestRenderAll();
    },

    sendBackwards() {
      this.selectedObj.sendBackwards();

      this.canvas.requestRenderAll();
    },

    sendToBack() {
      this.selectedObj.sendToBack();

      this.canvas.requestRenderAll();
    },

    bringToFront() {
      this.selectedObj.bringToFront();

      this.canvas.requestRenderAll();
    },
    /**
     * 图层变化
     */
    selectZindex(cmd) {
      //执行方法
      this[cmd]();
      this.$store.commit("ADD");
    },
    /**
     * 翻转变化
     */
    selectScale(cmd) {
      if (cmd == "z") {
        this.selectedObj.set({
          scaleX: -this.selectedObj.scaleX,
        });
      }
      if (cmd == "h") {
        this.selectedObj.set({
          scaleY: -this.selectedObj.scaleY,
        });
      }

      this.canvas.requestRenderAll();
      this.$store.commit("ADD");
    },

    /**
     * 透明度变化
     */
    selectOpacity(value) {
      this.selectedObj.opacity = value;
      this.canvas.requestRenderAll();
    },

    /**
     * 获取图层操作
     */
    getZindexList() {
      let list = this.canvas._objects;
      //查找对应的索引
      let index = list.indexOf(this.selectedObj);
      let arr = [];
      arr.push({
        name: "上移一层",
        enabled: index < list.length - 2,
        fun: "bringForward",
      });
      arr.push({ name: "下移一层", enabled: index > 1, fun: "sendBackwards" });
      arr.push({
        name: "置顶图层",
        enabled: index < list.length - 2,
        fun: "bringToFront",
      });
      arr.push({ name: "置底图层", enabled: index > 1, fun: "sendToBack" });

      return arr;
    },

    /**
     * 获取事件
     */
    selectEvent() {
      if (this.selectedObj.lockMovementX) {
        this.selectedObj.lockMovementX = false;
        this.selectedObj.lockMovementY = false;
        this.selectedObj.lockRotation = false;
        this.selectedObj.lockScalingX = false;
        this.selectedObj.lockScalingY = false;
        this.selectedObj.hasControls = true;
      } else {
        this.selectedObj.lockMovementX = true;
        this.selectedObj.lockMovementY = true;
        this.selectedObj.lockRotation = true;
        this.selectedObj.lockScalingX = true;
        this.selectedObj.lockScalingY = true;
        this.selectedObj.hasControls = false;
      }
      this.$forceUpdate();
      this.canvas.requestRenderAll();
    },
    // 投影
    selectShadow(value) {
      let shadow = new fabric.Shadow({
        color: this.selectedObj.fill,
        blur: value * 10,
        offsetX: value * 50,
        offsetY: value * 60,
      });
      this.selectedObj.shadow = shadow;
      this.canvas.requestRenderAll();
    },
  },
};
</script>
<style>
.align-check {
  z-index: 1;
  width: auto;
  width: 50px;
  height: 20px;
  cursor: pointer;
}
.active[class~="check-left"] {
  background: url(https://www.chuangkit.com/designdist/left_align_active.svg)
    no-repeat;
}
.active[class~="check-center"] {
  background: url(https://www.chuangkit.com/designdist/center_align_active.svg)
    no-repeat;
}
.active[class~="check-right"] {
  background: url(https://www.chuangkit.com/designdist/right_align_active.svg)
    no-repeat;
}
.active[class~="check-justify"] {
  background: url(https://www.chuangkit.com/designdist/justify_align_active.svg)
    no-repeat;
}
.check-left {
  background: url(https://www.chuangkit.com/designdist/left_alignment_new.svg)
    no-repeat;
}
.check-center {
  background: url(https://www.chuangkit.com/designdist/center_alignment_new.svg)
    no-repeat;
}
.check-right {
  background: url(https://www.chuangkit.com/designdist/right_alignment_new.svg)
    no-repeat;
}

.check-justify {
  background: url(https://www.chuangkit.com/designdist/justify_alignment_new.svg)
    no-repeat;
}
.el-popover {
  max-height: 340px;
  overflow: auto;
  padding: 4px;
  border: none;
}
.font-fontfamily-selector-inner-li {
  color: #000;
  font-size: 18px;
  font-weight: 600;
  height: 36px;
  width: 100%;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  box-sizing: border-box;
  padding: 7px 20px 6px 20px;
}

.font-fontfamily-selector-inner-li:hover {
  background: #f4f4f4;
}

.font-fontfamily-selector-inner-li:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 36px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff);
}

.font-fontfamily-selector-inner-li .font-fontfamily-selector-inner-li-img {
  height: 20px;
  width: 100%;
  position: absolute;
}
</style>

<style lang="less">
.right-panel {
  height: calc(100vh - 56px);
  background: #2c3136;
  position: absolute;
  right: 0;
  z-index: 3;
  transition: 0.3s linear;
  .right-panel-mainContent-toggle {
    line-height: 80px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: -14px;
    text-align: center;
    align-items: center;
    background: #24272a;
    border-radius: 4px 0 0 4px;
    box-shadow: -2px 0 10px 0 rgba(0, 0, 0, 0.532);
    cursor: pointer;
    opacity: 0.7;
  }
  .wordless {
    width: 100%;
    color: #fff;
    .title-info {
      height: 30px;
      background: #54595e;
      line-height: 30px;
      text-align: center;
      color: #fff;
    }
    .word-item-style {
      display: flex;
      flex-wrap: wrap;
    }
    .word-item {
      display: flex;
      padding: 8px 0 0 8px;
      width: 100%;
      min-height: 40px;
      font-size: 14px;
      line-height: 30px;
      .size-class {
        width: 78%;
      }
      .el-popover .el-popper {
        max-height: 340px;
        overflow: auto;
      }
    }
    .select-item {
      width: 70%;
      height: 20px;
    }
    .all-font {
      height: 200px;
      overflow: auto;
    }
  }
}
.style-item {
  height: 44px;
  width: 20%;
  display: flex;
  margin-top: 8px;
  margin-right: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .el-popover {
    height: auto;
  }
  & > span {
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  .el-dropdown {
    height: calc(100% - 8px);
    width: calc(100% - 8px);
    margin: 4px;
    background-color: #ffffff;
    border-radius: 4px;

    &:hover {
      background-color: #f2f3f6;

      .style-info {
        background-color: #f2f3f6;
      }
    }
  }
  .style-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: calc(100% - 8px);
    width: calc(100% - 8px);
    margin: 4px;
    background-color: #ffffff;
    border-radius: 4px;

    &:hover {
      background-color: #f2f3f6;
    }

    .icon {
      width: 20px;
      height: 20px;
      background-image: url(https://www.chuangkit.com/designdist/tools-bar-icon.svg);
    }

    .icon[class~="italic"] {
      background-position: 0 0;
    }

    .icon[class~="underline"] {
      background-position: -20px 0;
    }

    .icon[class~="weight"] {
      background-position: -40px 0;
    }

    .icon[class~="align"] {
      background-position: -60px 0;
    }

    .icon[class~="space"] {
      background-position: -80px 0;
    }

    .icon[class~="writingMode"] {
      background-image: url(https://www.chuangkit.com/designdist/tools-bar-writingMode-icon.svg);
    }

    .icon[class~="layer"] {
      background-position: -100px 0;
    }

    .icon[class~="opacity"] {
      background-position: -120px 0;
    }

    .icon[class~="reverse"] {
      background-position: -120px -20px;
    }

    .icon[class~="shadow"] {
      background-position: 0 -20px;
    }

    .icon[class~="lock"] {
      background-position: -40px -20px;
    }

    .icon[class~="delete"] {
      background-position: -60px -20px;
    }

    .icon[class~="imgSize"] {
      background: url(https://www.chuangkit.com/designdist/left-tool-size.svg);
    }
  }

  &.active {
    .style-info {
      background-color: #f3f4f9;
    }
  }
}
</style>
