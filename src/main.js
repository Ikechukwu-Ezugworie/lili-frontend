import {createApp} from 'vue'
import App from './App.vue'
import './css/app.css'
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
    //default options here
    position: "top-right",
    timeout: 2500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: false,
    draggable: false,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
};


const app = createApp(App);
app.use(router)
app.use(Toast, options);
app.mount('#app')