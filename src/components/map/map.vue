<template>
  <div id="mapContent" class="mapContentClass">
  </div>
</template>
<script setup>
import L from 'leaflet'
import {onMounted, ref, defineEmits, defineExpose, defineProps, toRefs} from "vue";

const props = defineProps({
  //地图瓦片地址
  mapUrl: {
    type: Array,
    required: true,
  },
  //地图中心
  center: {
    type: Array,
    required: true
  },
  //最小缩放倍数
  minZoom: {
    type: Number,
    default: 1
  },
  //最大缩放倍数
  maxZoom: {
    type: Number,
    default: 20
  },
  //镜头跳转点
  panTo: {
    type: Array,
    default: [29.760258, 121.52454]
  },
  //城市轮廓
  cityPathList: {
    type: Array,
    default: []
  },
  //轮廓样式
  cityPathStyle: {
    type: Object,
    default: {
      color: '#68F994',
      weight: 3,
      opacity: 0.4,
      fillColor: 'transparent',
      fillOpacity: 0
    }
  },
  //热力图
  heatList: {
    type: Array,
    default: [],
  },
  //热力图样式规则
  heatListStyle: {
    type: Object,
    default: {
      radius: 30,
      minOpacity: 10,
      gradient: {
        0.2: '#00f',
        0.4: '#0ff',
        0.6: '#0f0',
        0.8: '#ff0',
        1: '#f00'
      }
    }
  },
  //路径图
  pathList: {
    type: Array,
    default: []
  },
  //路径样式
  pathListStyle: {
    type: Object,
    default: {
      color: '#0ff',
      weight: 3
    }
  },
  //标记点
  markList: {
    type: Array,
    default:[]
  },
  //标记样式
  markIconStyle: {
    type: Object,
    default: {
      iconUrl: '@/assets/vue.svg',
      iconSize:[70,70]
    }
  }
})
const {mapUrl, center, minZoom, maxZoom, panTo, heatList, pathList} = toRefs(props)
let map = null
// 初始化地图
const initMap = () => {
  map = L.map('mapContent', {
    center: props.center,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    attributionControl: false,
    zoomControl: false,
    zoom: 9
  }).panTo(props.panTo)
  //地图瓦片
  props.mapUrl.forEach((item) => {
    L.tileLayer(item.url, {
      minZoom: item.minZoom || props.minZoom,
      maxZoom: item.maxZoom || props.maxZoom,
    }).addTo(map)
  })
  //地图行政区域划分
  props.cityPathList.forEach((item) => {
    L.polygon(item, {style: props.cityPathStyle}).addTo(map)
  })
  //热力图
  L.heatLayer(props.heatList, props.heatListStyle).addTo(map)
  // 路径图
  let polyPathList = []
  let polyLine = null
  props.pathList.forEach((item) => {
    polyPathList.push([Number(item.lat), Number(item.lng)])
  })
  polyLine = L.polyline(polyPathList, props.pathListStyle).addTo(map)
  //定位到路径图位置
  // map.fitBounds(polyLine.getBounds())
  //标记点为
  const myIcon = L.icon(props.markIconStyle)
  props.markList.forEach((item) => {
    console.log('item',item);
    let marker = L.marker(item, { icon:myIcon }).on('click', function (e) {

    }).addTo(map)
  })
}
onMounted(() => {
  initMap()
})
</script>
<style lang="scss" scoped>
.mapContentClass {
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>