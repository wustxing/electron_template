<template>
  <vue-draggable-resizable
    :key="id"
    :x="x"
    :y="y"
    :w="width"
    :h="height"
    :resizable="true"
    :draggable="true"
    :parent="true"
    @dragging="onDragging"
    @drag-stop="onDragStop"
    @resizing="onResizing"
    @resize-stop="onResizeStop"
  >
    <div ref="contentRef" class="inner">
      <slot />
    </div>
  </vue-draggable-resizable>
</template>
  
  <script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";

const emit = defineEmits(["draggingEvent"]);
const props = defineProps(["pageconfig", "postion"]);
// const x = ref(375 - props.postion.right - props.postion.w);
const x = ref(props.postion.x);
const y = ref(props.postion.y);
const width = ref(props.postion.w);
const height = ref(props.postion.h);
const contentRef = ref(null);
const id = ref(new Date().getTime());

let observer;

const updateSize = () => {
  if (contentRef.value) {
    const rect = contentRef.value.getBoundingClientRect();
    width.value = rect.width;
    height.value = rect.height;
    console.log("更新尺寸:", width.value, height.value);
    id.value = new Date().getTime();
  }
};

onMounted(async () => {
  await nextTick();
  // updateSize()

  // observer = new ResizeObserver(updateSize)
  // observer.observe(contentRef.value)
});

onBeforeUnmount(() => {
  if (observer && contentRef.value) observer.unobserve(contentRef.value);
});

// 🟡 拖动/缩放事件（按需添加你自己的逻辑）
function onDragging(xPos, yPos) {
  console.log("正在拖动:", xPos, yPos);
  emit("draggingEvent", {
    x: xPos,
    y: yPos,
  });
}

function onDragStop(xPos, yPos) {
  console.log("拖动结束:", xPos, yPos);
  emit("draggingEvent", {
    x: xPos,
    y: yPos,
  });
}

function onResizing(xPos, yPos, w, h) {
  console.log("正在缩放:", w, h);
  emit("draggingEvent", {
    w: w,
    h: h,
    x: xPos,
    y: yPos,
  });
}

function onResizeStop(xPos, yPos, w, h) {
  console.log("缩放结束:", w, h);
  emit("draggingEvent", {
    w: w,
    h: h,
    x: xPos,
    y: yPos,
  });
}
</script>
  
  <style scoped>
.inner {
  display: inline-block;
  border: 1px red solid;
  width: 100%;
  height: 100%;
}
</style>
  