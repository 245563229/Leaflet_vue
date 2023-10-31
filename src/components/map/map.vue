<template>
  <div id="mapContent" class="mapContentClass">
  </div>
</template>
<script setup>
import L from 'leaflet'
import {onMounted, ref, defineExpose, defineProps, toRefs} from "vue";

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
    default: []
  },
  //标记样式
  markIconStyle: {
    type: Object,
    default: {
      iconUrl: '@/assets/vue.svg',
      iconSize: [70, 70]
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
    console.log('item', item);
    let marker = L.marker(item, {icon: myIcon}).on('click', function (e) {

    }).addTo(map)
  })
  //聚类图层组
  const iconGroup = L.markerClusterGroup({
    howCoverageOnHover: false,//当您将鼠标悬停在集群上时，它会显示其标记的边界。
    zoomToBoundsOnClick: true,//当您单击一个集群时，我们会缩放到其边界。
    spiderfyOnMaxZoom: true,//当您单击底部缩放级别的集群时，我们会对其进行蜘蛛化，以便您可以看到其所有标记。
    removeOutsideVisibleBounds: true,//为了提高性能，从地图中删除离视口太远的集群和标记。
    chunkedLoading: true, //布尔值，将 addLayer的处理分成小间隔，以便页面不会冻结
    maxClusterRadius: 100,/*集群将从中心标记覆盖的最大半径（以像素为单位）。
  默认 80。减少将产生更多、更小的集群。您还可以使用接受当前地图缩放并返回最大聚类半径（以像素为单位）的函数。*/
    /*spiderLegPolylineOptions://指定PolylineOptions来设计蜘蛛腿的样式。
     默认情况下，它们是{ weight: 1.5, color: '#222', opacity: 0.5 }*/
  })
  iconGroup.addTo(map)
  const iconGroupListIcon = L.icon(props.markIconStyle)
  const iconGroupList = []
  const iconList = [
    [29.524,120.154],[29.487,120.454],[29.121,120.154],[29.458,120.154],[29.874,120.487],
  ]
  iconList.forEach((item)=>{
    const marker = L.marker(item,{icon:iconGroupListIcon})
    iconGroupList.push(marker)
  })
  iconGroup.addLayers(iconGroupList)
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