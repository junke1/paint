<template>
  <div class="section-lazyonload">
    <div class="text-scroll">
      <div class="text-section">
        <div class="text-section-top">
          <div class="large" @click="Add(300)">
            <span>点击添加标题文字</span>
          </div>
          <div class="middle" @click="Add(220)">
            <span>点击添加副标题文字</span>
          </div>
          <div class="small" @click="Add(180)">
            <span>点击添加正文文字</span>
          </div>
        </div>
        <hr class="leftPanel-hr" />
        <div class="text-list-ul">
          <div
            class="container-img"
            v-for="(item, index) in wordList"
            :key="index"
            @click="handleAddImg(item, $event)"
          >
            <img
              :src="item.imgUrl"
              :id="'img' + item.material_id"
              style="height: auto; width: 100%"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AllWord from "@/api/wordData/AllWord";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "p-words",
  data() {
    return {
      imgBottom: "?x-oss-process=image/resize,w_544/format,webp",
      wordList: AllWord,
    };
  },
  computed: {
    ...mapGetters(["canvas", "selectedObj"]),
  },
  methods: {
    ...mapActions(["addWord", "addImage"]),

    Add(px) {
      //增加文字，到屏幕中间
      this.addWord(px);
    },
    handleAddImg(item) {
      this.addImage(item.imgUrl);
    },
  },
};
</script>
<style lang="less">
.section-lazyonload {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #202427;
  .text-scroll {
    padding: 0 10px;
  }
  .text-section-top {
    text-align: center;
    color: #fff;
    font-family: Arial, Helvetica, sans-serif;
    .large {
      font-size: 24px;
      font-weight: bold;
      margin-top: 10px;
      cursor: pointer;
    }
    .middle {
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
      cursor: pointer;
    }
    .small {
      font-size: 14px;
      margin: 10px 0;
      cursor: pointer;
    }
  }
  .leftPanel-hr {
    border: 1px solid #fff;
    height: 1px;
    background: #fff;
  }
  .text-list-ul {
    width: 304px;
    display: flex;
    flex-wrap: wrap;
    .container-img {
      width: 100px;
      height: 100px;
      margin: 10px;
      border-radius: 4px;
      background: #fff;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      img {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
  }
}
</style>
