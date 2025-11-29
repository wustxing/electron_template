

<script setup>
import { onMounted, ref } from "vue";
import AutoSizedDraggable from "./AutoSizedDraggable.vue";
const props = defineProps(["PageConfig", "pindex", "upath", "curIndex"]);
const emit = defineEmits(["draggingNotify"]);
const tpath = ref(configs.tempPath);
const cpath = `file:///${tpath.value.replace(/\\/g, "/")}`; // 注意使用三个斜杠和斜杠转换
console.log("000000cpath===", cpath);
// const PageConfig = computed(() => props.PageConfig)

onMounted(() => {
  console.log("PagePhone mounted");
});

const handleNotificationShare = (data) => {
  console.log("handleNotificationShare", data);
  emit("draggingNotify", { ...data, type: "share" });
};

const handleNotificationRule = (data) => {
  console.log("handleNotificationRule", data);
  emit("draggingNotify", { ...data, type: "rule" });
};
</script>
<template>
  <div class="page_phone">
    <template v-if="props.PageConfig.is_share_btn">
      <AutoSizedDraggable
        :pageconfig="props.PageConfig"
        :postion="props.PageConfig.share_postion"
        @draggingEvent="handleNotificationShare"
      >
        <div
          class="s_btn"
          :style="'background-image: url(' + cpath + '/images/share_btn.png' + ')'"
        ></div>
      </AutoSizedDraggable>
    </template>
    <template v-if="props.PageConfig.is_rule_btn">
      <AutoSizedDraggable
        @draggingEvent="handleNotificationRule"
        :pageconfig="props.PageConfig"
        :postion="props.PageConfig.rule_postion"
      >
         <div
          class="s_btn"
          :style="'background-image: url(' + cpath + '/images/rule_btn.png' + ')'"
        ></div>
      </AutoSizedDraggable>
    </template>

    <div
      class="imglist_container"
      :class="{ active: curIndex == index }"
      v-for="(item, index) in props.PageConfig.img_list"
      :key="index"
    >
      <div class="imglist" v-for="(img, index1) in item.list" :key="index1">
        <img :src="cpath + '/images/' + img.img_name" alt="" />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.page_phone {
  width: 375px;
  height: 667px;
  border: 1px red solid;
  // overflow: auto;
  position: relative;
  .s_btn {
    // width: 110px;
    // height: 85px;
    width: 100%; 
    height: 100%;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .imglist_container {
    display: flex;
  }
  .active {
    border: 1px red solid;
  }
  .imglist {
    display: flex;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>