import { createApp } from 'vue';
import { createManager } from '@vue-youtube/core';
import { YoutubeIframe } from '@vue-youtube/component';
import Slider from '@vueform/slider';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';
import Dropdown from 'primevue/dropdown';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import InputText from 'primevue/inputtext';
import Tooltip from 'primevue/tooltip';
import InputNumber from 'primevue/inputnumber';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';

import 'primevue/resources/themes/md-dark-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import router from './router/index';
import { createPinia } from 'pinia';

const app = createApp(App);
app
  .use(PrimeVue)
  .use(router)
  .use(createPinia())
  .use(ToastService)
  .use(createManager())
  .use(ConfirmationService);
app.component('YoutubeIframe', YoutubeIframe);
app.component('Slider', Slider);
app.component('Button', Button);
app.component('ToggleButton', ToggleButton);
app.component('Dropdown', Dropdown);
app.component('Toast', Toast);
app.component('Card', Card);
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('Dialog', Dialog);
app.component('Textarea', Textarea);
app.component('ConfirmDialog', ConfirmDialog);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);

app.directive('tooltip', Tooltip);

app.mount('#app');
