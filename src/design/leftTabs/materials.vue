<template>
  <div>
    <div class="section-lazyonload">
      <div class="template-section-wrap">
        <div class="template-search">
          <el-input
            v-model="scSearch"
            placeholder="请输入要搜索的素材"
            @change="handleSearch"
          />
        </div>
        <div class="material" v-show="!isShowMore">
          <div
            class="material-list"
            v-for="(li, index) in sucaiList"
            :key="index"
          >
            <div class="material-item-title">
              {{ li.title }}
              <div
                class="material-item-title-more"
                @click="handleShowMore(li.materials, li.title)"
              >
                更多&gt;
              </div>
            </div>
            <div class="material-item">
              <div
                v-for="(item, index) in li.materials"
                :key="index"
                @click="handleAddImg(item)"
                class="material-item-img"
              >
                <img
                  :id="'youdo' + item.material_id"
                  :src="item.imgUrl + imgBottom"
                  class="swiper-lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="isShowMore" class="material">
          <div
            class="material-item-title"
            @click="isShowMore = false"
            style="cursor: pointer"
          >
            <span>&lt;{{ showTitle }}</span>
          </div>
          <div class="material-item">
            <div
              class="material-item-img"
              @click="handleAddImg(item)"
              v-for="(item, index) in listMaterials"
              :key="index"
            >
              <img
                :id="
                  'youdo1' + (item.material_id ? item.material_id : item.kindId)
                "
                :src="item.imgUrl + imgBottom"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import materialBoxList from "@/api/materialData/getList";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["tabHeight"],
  name: "p-material",
  data() {
    return {
      scSearch: "",
      isShowMore: false,
      imgBottom: "?x-oss-process=image/resize,w_300/format,webp",
      sucaiList: materialBoxList,
    };
  },
  created() {
    this.getMaterials();
  },
  computed: {
    ...mapGetters(["canvas", "selectedObj"]),
  },
  methods: {
    ...mapActions(["addImage"]),

    handleSearch(search) {
      if (search.length === 0) {
        this.sucaiList = materialBoxList.map((item) => ({
          ...item,
          materials: item.materials.slice(0, 4),
        }));
      } else {
        let listInfo = [];
        for (let item of materialBoxList) {
          let tempArray = [];
          for (let _item of item.materials) {
            if (_item.keywords.indexOf(search) > -1) {
              tempArray.push(_item);
            }
          }
          if (tempArray.length > 0) {
            let tempObj = JSON.parse(JSON.stringify(item));
            tempObj.materials = tempArray;
            listInfo.push(tempObj);
          }
        }
        this.sucaiList = listInfo;
      }
    },
    // 显示更多
    handleShowMore(list, title) {
      this.showTitle = title;
      this.isShowMore = true;
      this.listMaterials = materialBoxList.filter((item) => {
        return item.title == title;
      })[0].materials;
      console.log(this.listMaterials, "12");
    },
    getMaterials() {
      this.sucaiList = materialBoxList.map((item) => ({
        ...item,
        materials: item.materials.slice(0, 4),
      }));
    },
    handleAddImg(item) {
      this.addImage(item.imgUrl);
    },
  },
};
</script>
<style lang="less">
.section-lazyonload {
  width: 260px;
  position: relative;
  background: #202427;
  .template-search {
    padding: 10px;
  }
  .material {
    height: calc(100vh - 56px);
    .material-item-title {
      height: 18px;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      color: #fff;
      line-height: 18px;
      .material-item-title-more {
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: #ddd;
        }
      }
    }
    .material-item {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .material-item-img {
        width: 50px;
        height: 50px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
        margin: 6px;
        cursor: pointer;
        img {
          width: 100%;
          height: auto;
        }
      }
    }
  }
}
</style>
