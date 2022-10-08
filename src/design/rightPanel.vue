<template>
  <div class="right-panel" :style="{ width: rightWidth + 'px' }">
    <div class="page-list" v-if="rightShow">
      <!--文字操作区域-->
      <div class="wordless">
        <!-- <template v-if="!isImage">
          <div class="title-info">
            <span>文字</span>
          </div>
          <div class="word-item">
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
              <el-popover placement="bottom" width="250" trigger="click">
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

                  <el-col v-if="chnOrEng" :span="24" class="allFont">
                    <div
                      v-for="(li, index) in fontFamilyList.body.officialFonts"
                      :key="index"
                    >
                      <div v-if="li.kindId !== 23">
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
                  <el-col v-if="!chnOrEng" :span="24" class="allFont">
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
          <div class="word-item">
            <div class="title">字号：</div>
            <div class="content">
              <el-dropdown size="small" @command="selectFontSize">
                <div class="font-size-choose tips">
                  <input type="text" :value="selectedObj.fontSize" />
                  <div class="font-pop-icon"></div>
                </div>
                <el-dropdown-menu class="dropdownFont" slot="dropdown">
                  <el-dropdown-item
                    v-for="(font, index) in fontSizeList"
                    :command="font"
                    :key="index"
                    >{{ font }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </template> -->
        <!-- <template v-else>
          <div class="title-info">
            <span>{{ isCanvasImg ? "画布背景" : "图片" }}</span>
          </div>
          <template v-if="!isCanvasImg">
            <div class="word-item">
              <div class="title">宽度：</div>
              <div class="sizeClass">
                <el-input
                  size="small"
                  type="number"
                  v-model="sizewidth"
                  @keyup.enter.native="changeSize"
                >
                  <template v-slot:append>mm</template>
                </el-input>
              </div>
            </div>

            <div class="word-item">
              <div class="title">高度：</div>
              <div class="sizeClass">
                <el-input
                  size="small"
                  type="number"
                  v-model="sizeheight"
                  @keyup.enter.native="changeSize"
                >
                  <template v-slot:append>mm</template>
                </el-input>
              </div>
            </div>
          </template>

          <div class="word-item">
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

          <div class="word-item img-item">
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
          </div>
        </template> -->
        <div class="word-item word-item-style">
          <!-- <template v-if="!isImage"> -->
          <!--斜体-->
          <!-- <el-tooltip
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
            </el-tooltip> -->
          <!--下划线-->
          <!-- <el-tooltip
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
            </el-tooltip> -->
          <!--加粗-->
          <!-- <el-tooltip
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
            </el-tooltip> -->
          <!--对齐-->
          <!-- <el-tooltip
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
                  <ul class="align-check">
                    <li
                      v-for="(li, index) in fontAList"
                      :key="index"
                      :class="
                        getTextAlign() == li.class
                          ? `${li.class} active`
                          : `${li.class}`
                      "
                      @click="selectTextAlign(li.class)"
                    >
                      <span></span>
                    </li>
                  </ul>
                  <div class="style-info" slot="reference">
                    <div
                      :class="'icon align check-' + selectedObj.textAlign"
                    ></div>
                  </div>
                </el-popover>
              </div>
            </el-tooltip> -->
          <!--间距-->
          <!-- <el-tooltip
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
            </el-tooltip> -->
          <!--竖排-->
          <!-- <el-tooltip
              :enterable="false"
              effect="dark"
              content="竖排"
              placement="top"
            >
              <div class="style-item">
                <div class="style-info">
                  <div class="icon writingMode"></div>
                </div>
              </div>
            </el-tooltip> -->
          <!-- </template>
          <template v-if="!isCanvasImg"> -->
          <!--图层-->
          <!-- <el-tooltip
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
            </el-tooltip> -->
          <!--透明度-->
          <!-- <el-tooltip
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
            </el-tooltip> -->
          <!--翻转-->
          <!-- <el-tooltip
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
            </el-tooltip> -->
          <!--投影-->
          <!-- <el-tooltip
              :enterable="false"
              effect="dark"
              content="投影"
              placement="top"
            >
              <div class="style-item">
                <el-popover placement="bottom" width="300" trigger="click">
                  <div class="paddingPopover">
                    <el-row>
                      <el-col :span="5" style="line-height: 38px">
                        <span>投影</span>
                      </el-col>
                      <el-col :span="19">
                        <el-slider
                          v-model="selectedObj.shadowNum"
                          :min="0"
                          :max="1"
                          :step="0.1"
                          show-input
                          :show-input-controls="false"
                          input-size="mini"
                          @input="selectShadow"
                        >
                        </el-slider>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="style-info" slot="reference">
                    <div class="icon shadow"></div>
                  </div>
                </el-popover>
              </div>
            </el-tooltip> -->
          <!--锁定-->
          <!-- <el-tooltip
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
            </el-tooltip> -->
          <!-- </template> -->
        </div>
        <!--复制-->
        <!-- <el-button
          style="width: calc(100% - 40px); margin-left: 20px; margin-top: 30px"
          size="small"
          v-if="!isCanvasImg"
          @click="
            copy();
            paste();
          "
        >
          <span>复制并黏贴</span>
        </el-button> -->

        <!--删除-->
        <!-- <el-button
          style="width: calc(100% - 40px); margin-left: 20px; margin-top: 10px"
          type="info"
          size="small"
          @click="handleDelInfo"
        >
          <span>{{ isCanvasImg ? "取消背景图编辑" : "删除" }}</span>
        </el-button> -->
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
export default {
  name: "p-right-panel",
  data() {
    return {
      rightShow: false,
      rightWidth: 0,
    };
  },
  methods: {
    //右侧显示不显示
    shousuo() {
      // if (this.selectedObj === null || this.selectedObj === undefined) {
      //   this.$message.info("您当前未选择任何元素");
      //   return;
      // }
      this.rightShow = !this.rightShow;
      if (this.rightShow == false) {
        this.rightWidth = 0;
      } else {
        this.rightWidth = 248;
      }
      // this.setRightState(this.rightShow);
    },
  },
};
</script>
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
    left: -16px;
    text-align: center;
    align-items: center;
    background: #24272a;
    border-radius: 4px 0 0 4px;
    box-shadow: -2px 0 10px 0 rgba(0, 0, 0, 0.532);
    cursor: pointer;
    opacity: 0.7;
  }
}
</style>
