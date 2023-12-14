<template>
  <div id="container" class="mapDisplay" ref="gaoMap"></div>
  <div class="search-box">
    <el-select
      class="position-search"
      v-model="state.keywords"
      clearable
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词进行搜索"
      :remote-method="handleSearch"
      :loading="state.searchLoading"
      @change="handlePositonChange"
    >
      <template #prefix>
        <SvgIcon name="ele-Search" class="Search"/>
      </template>
      <el-option
        v-for="item in state.searchList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>
<script setup>
import {ref, reactive, onMounted} from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader';
import {initMap} from "@/components/gaoMap/index.js";

window._AMapSecurityConfig = {
  securityJsCode: '74e427f7dfbb1c487a70019992e8277f',
}
const gaoMap = ref()
const state = reactive({
  AMap: null,
  map: null,
  marker: null,
  address: '',
  searchAuto: null,
  geocoder: null,
  keywords: '',
  searchLoading: false,
  searchList: [],
  //卫星图
  satellite: '',
  //路网图
  roadNet: ''
})
const init = () => {
  initMap().then((AMap) => {
    state.satellite = new AMap.TileLayer.Satellite();// 卫星图
    state.roadNet = new AMap.TileLayer.RoadNet();// 路网图
    state.AMap = AMap
    state.map = new AMap.Map(gaoMap.value, {
      zoom: 10,
      zoomToAccuracy: true,
      resizeEnable: true,

    });
    state.map.on('click', handleMapClick);
    //输入提示
    state.searchAuto = new AMap.AutoComplete({
      city: '全国'
    });
    // 坐标 解析 位置
    state.geocoder = new AMap.Geocoder();

  }).catch(e => {
    console.log(e);
  })
}
const handleMapClick = (e) => addMarker([e.lnglat.lng, e.lnglat.lat])
const addMarker = (position) => {
  console.log('position', position)
  if (state.marker) {
    state.marker.setMap(null);
    state.marker = null;
  }
  state.marker = new state.AMap.Marker({
    imageSize: new state.AMap.Size(20, 20),
    image: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
    position,
  });
  state.marker.setMap(state.map);
  // 坐标解析地址
  // state.geocoder.getAddress(position,(status, result) => {
  //   if (status === 'complete'&& result.regeocode) {
  //     state.address = result.regeocode.formattedAddress
  //   }
  // })
}
const handleSearch = (query) => {
  if (query) {
    state.searchLoading = true
    // console.log('state.searchAuto',state.searchAuto)
    state.searchAuto.search(query, function (status, result) {
      state.searchLoading = false
      if (status === 'complete') {
        state.searchList = result.tips ?? []
      }
    })
  }
}
const handlePositonChange = (v) => {
  const position = state.searchList.find(item => item.id === v)
  addMarker([position.location.lng, position.location.lat])
  state.map.setZoomAndCenter(12, [position.location.lng, position.location.lat]); //设置地图中心点
}
onMounted(() => {
  init()
})
</script>
<style lang='scss' scoped>
.mapDisplay {
  width: 100%;
  height: 100%;
}

.search-box {
  padding: 2px;
  background-color: #e9e9e9;
  position: absolute;
  top: 70px;
  right: 10px;

  .position-search {
    width: 250px;
  }
}

.address {
  position: absolute;
  bottom: 70px;
  right: 10px;
  background-color: #ffffff;
  padding: 4px 15px;
}
</style>
