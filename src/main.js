import { createApp } from 'vue';
import YoutubeIframe from '@techassi/vue-youtube-iframe';
import Slider from '@vueform/slider';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';
import Dropdown from 'primevue/dropdown';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import DataView from 'primevue/dataview';
import InputText from 'primevue/inputtext';
import Tooltip from 'primevue/tooltip';
import InputNumber from 'primevue/inputnumber';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';

import 'primevue/resources/themes/md-dark-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import router from './router/index';
import store from './store/index';

const app = createApp(App);
app.use(PrimeVue).use(router).use(store).use(ToastService).use(YoutubeIframe);
app.component('Slider', Slider);
app.component('Button', Button);
app.component('ToggleButton', ToggleButton);
app.component('Dropdown', Dropdown);
app.component('Toast', Toast);
app.component('Card', Card);
app.component('DataView', DataView);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('Dialog', Dialog);
app.component('Textarea', Textarea);

app.directive('tooltip', Tooltip);

app.mount('#app');
