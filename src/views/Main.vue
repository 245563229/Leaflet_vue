<template>
  <div class="content">
    <Map
      :mapUrl="state.urlList"
      :center="state.center"
      :cityPathList="cityPath"
      :heatList="state.heatList"
      :pathList="pathList"
      :markList="state.markList"
      :markIconStyle="{ iconUrl: markIcon, iconSize: [70, 70] }"
    ></Map>
<!--    <GaoMap></GaoMap>-->
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import Map from "@/components/map/map.vue";
import GaoMap from '@/components/gaoMap/index.vue'
import cityPath from "@/assets/ningboCity.js";
import pathList from "@/assets/pathDate.js";
import markIcon from "@/assets/vue.svg";
const state = reactive({
  urlList: [
    {
      url: "https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    },
  ],
  center: [29.760258, 121.52454],
  heatList: [
    {
      lat: 29.94515,
      lon: 121.2684,
      val: 0.5,
    },
    {
      lat: 29.93515,
      lon: 121.1684,
      val: 0.8,
    },
    {
      lat: 29.92515,
      lon: 121.1684,
      val: 1,
    },
    {
      lat: 29.91515,
      lon: 121.1684,
      val: 0.2,
    },
  ],
  markList: [
    [29.76025, 121.50121],
    [29.56025, 121.40121],
    [29.16025, 121.40121],
  ],
});
onMounted(() => {});
</script>
<style lang="scss" scoped>
.content {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: red;
  //padding: 10px;
  position: absolute;
}
</style>
