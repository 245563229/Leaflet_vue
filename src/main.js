import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// 地图插件样式
import "leaflet/dist/leaflet.css";
// 热力图
import "leaflet.heat";
// 图标样式
import "./assets/iconfont/iconfont.css";
// 聚合物样式以及基础属性
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster";
createApp(App).mount("#app");
