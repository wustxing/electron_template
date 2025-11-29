<script setup>
import { onMounted } from 'vue'
import PageConfig from './components/PageConfig.vue'

onMounted(async ()=>{
    console.log('App component is mounted',window.electron)
    console.log(window.nodePath)
    // await window.electron.ipcRenderer.invoke("dialog:openDirectory");
})
</script>

<template>
<PageConfig />

</template>

<style lang="less" scoped>


</style>
