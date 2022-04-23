import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import DataView from 'primevue/dataview';
import InputText from 'primevue/inputtext';
import Image from 'primevue/image';

import 'primevue/resources/themes/md-dark-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import router from './router/index';
import store from './store/index';

const app = createApp(App);
app.use(PrimeVue).use(router).use(store).use(ToastService);
app.component('Button', Button);
app.component('Dropdown', Dropdown);
app.component('Toast', Toast);
app.component('Card', Card);
app.component('DataView', DataView);
app.component('InputText', InputText);
app.component('Image', Image);

app.mount('#app');
