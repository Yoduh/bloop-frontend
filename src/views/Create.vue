<template>
  <div
    id="create-container"
    class="flex flex-column justify-content-center align-items-center"
  >
    <h1 v-if="editSound" style="color: #f1f1f1">
      Editing Sound '{{ editSound.name }}'
    </h1>
    <div class="grid flex justify-content-center mb-3 w-full">
      <div class="sm:col-10 md:col-7 lg:col-6 xl:col-4">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search" />
          <InputText
            class="w-full"
            type="text"
            v-model="url"
            :disabled="editSound"
            placeholder="Enter Youtube URL"
            @keypress="getYoutube"
          />
        </span>
        <Button label="Load Video" class="sm:hidden mt-2" @click="getYoutube" />
      </div>
    </div>
    <div class="grid flex justify-content-center mb-3 w-full">
      <youtube-iframe
        :video-id="videoId"
        :width="500"
        :height="300"
        :cookie="false"
        :playerVars="playerOptions"
        @ready="onPlayerReady"
        @state-change="stateChange"
        @error="onError"
        ref="player"
        style="position: relative; left: 16px"
      ></youtube-iframe>
      <!-- <div
        class="px-3 grid flex-column justify-content-center align-items-center"
        style="position: relative; left: 16px"
      >
        <i class="pi pi-volume-up mb-2"></i>
        <Slider
          id="volumeSlider"
          v-model="volumeSlider"
          :min="0"
          :max="100"
          :step="1"
          orientation="vertical"
          direction="rtl"
          :tooltips="false"
          :lazy="false"
          @update="volumeChange"
        />
      </div> -->
    </div>
    <div class="grid mt-5 flex justify-content-center w-11">
      <div class="sm:col-10 md:col-7 lg:col-6 xl:col-4">
        <Slider
          id="rangeSlider"
          v-model="rangeSlider"
          :min="sliderMin"
          :max="sliderMax"
          :step="0.01"
          :options="sliderOptions"
          @start="start"
          @end="end"
        />
        <div class="grid justify-content-center mt-7">
          <ToggleButton
            id="togglePlay"
            class="p-button-outlined mx-5"
            v-model="togglePlay"
            onIcon="pi pi-pause"
            offIcon="pi pi-play"
            @click="togglePlayer"
          />
          <Button
            id="replayBtn"
            icon="pi pi-replay"
            class="p-button-rounded p-button-outlined p-button-lg mx-5"
            @click="replay"
          />
          <Button
            id="zoomIn"
            class="p-button-rounded p-button-outlined p-button-lg mx-5"
            icon="pi pi-search-plus"
            @click="sliderZoom(true)"
            v-tooltip.top="
              'Zoom in by setting slider bar length using current \'Start\' and \'End\' locations'
            "
          />
          <Button
            id="zoomOut"
            v-if="toggleZoom"
            class="p-button-rounded p-button-outlined p-button-lg mx-5"
            icon="pi pi-search-minus"
            @click="sliderZoom(false)"
            v-tooltip.top="'Zoom out to original scale'"
          />
        </div>
        <div
          class="p-fluid grid formgrid mt-3 start-end-inputs justify-content-center sm:justify-content-between align-items-start"
        >
          <div
            class="sm:col-5 lg:col-4 xl:col-5 flex flex-column justify-content-start"
          >
            <div>Start (seconds)</div>
            <InputNumber
              v-model="rangeSlider[0]"
              mode="decimal"
              :minFractionDigits="2"
              showButtons
              :step="0.01"
              :min="0"
              :max="rangeSlider[2] - 0.1"
              :useGrouping="false"
              @input="inputStart"
            />
          </div>
          <div
            class="sm:col-5 md:col-5 lg:col-4 xl:col-5 flex flex-column justify-content-start"
          >
            <div>End (seconds)</div>
            <InputNumber
              v-model="rangeSlider[2]"
              mode="decimal"
              :minFractionDigits="2"
              showButtons
              :step="0.01"
              :min="0"
              :max="duration"
              :useGrouping="false"
              @input="inputEnd"
            />
          </div>
        </div>
        <div class="grid justify-content-center my-3">
          <Button
            id="saveBtn"
            label="Save"
            icon="pi pi-save"
            class="p-button-rounded p-button-lg"
            @click="presave"
          />
        </div>
      </div>
    </div>
  </div>
  <Dialog
    v-if="editSound"
    :header="`Overwrite '${editSound.name}' with new clip?`"
    v-model:visible="modal"
    class="sm:w-full md:w-5 lg:w-3"
    :modal="true"
  >
    <template v-slot:footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-danger"
        @click="modal = false"
        autofocus
      />
      <Button label="OK" icon="pi pi-check" @click="save" autofocus />
    </template>
  </Dialog>
  <Dialog
    v-else
    header="Choose a name for your sound"
    v-model:visible="modal"
    class="sm:w-full md:w-5 lg:w-3"
    :modal="true"
  >
    <InputText
      type="text"
      v-model="soundName"
      class="w-full"
      maxlength="30"
      aria-describedby="soundName-help"
      @keypress.enter="save"
    />
    <small v-show="soundName.includes(' ')" id="soundName-help" class="p-error"
      >Sound name can not have a space.</small
    >
    <template v-slot:footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="modal = false"
        autofocus
      />
      <Button
        label="OK"
        :disabled="(soundName.includes(' ') || soundName === '') && !isLoading"
        icon="pi pi-check"
        @click="save"
        autofocus
      />
    </template>
  </Dialog>
  <DuplicateModal
    v-model="duplicateModal"
    :duplicates="dupes"
    @continueSave="modal = true"
  />
</template>

<script setup>
import DuplicateModal from '../components/DuplicateModal.vue';
import { ref, onUpdated, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/stores/user';
import { useGuildStore } from '@/stores/guild';
import { useSoundStore } from '@/stores/sound';
import { useLoadingStore } from '@/stores/loading';
import { storeToRefs } from 'pinia';
import axios from 'axios';

const guildStore = useGuildStore();
const soundStore = useSoundStore();

const resize = () => {
  if (window.innerWidth < 559) {
    let width = window.innerWidth * 0.85;
    player.value.instance.setSize(width, width / 1.6666);
  } else if (window.innerWidth >= 559) {
    player.value.instance.setSize(500, 300);
  }
};
onMounted(() => {
  window.addEventListener('resize', resize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  clearInterval(interval);
});

// move this to utility class
const toHHMMSS = val => {
  if (
    // yay floating point BS
    val.toString().includes('9999999') ||
    val.toString().includes('0000000')
  ) {
    val = Math.round(100 * val) / 100;
  }
  const h = Math.floor(val / 3600);
  const m = Math.floor((val % 3600) / 60);
  const s = Math.floor(val % 60);
  const ms = Math.round((val - Math.floor(val)) * 100);
  let res = [
    h > 0 ? h : '',
    h > 0 && m <= 9 ? '0' + m : m || '0',
    s > 9 ? s : '0' + s
  ]
    .filter(Boolean)
    .join(':');
  res += '.' + (ms > 9 ? ms : '0' + ms);
  return res;
};

const url = ref('');
const playerOptions = {
  controls: 0,
  enablejsapi: 1,
  fs: 0,
  modestbranding: 1,
  rel: 0
};
const sliderOptions = {
  animate: false,
  tooltips: [
    {
      to: val => {
        return toHHMMSS(val);
      }
    },
    {
      to: val => {
        return toHHMMSS(val);
      }
    },
    {
      to: val => {
        return toHHMMSS(val);
      }
    }
  ]
};
//const volumeSlider = ref(100);
const editSound = soundStore.details;
if (editSound) {
  url.value = editSound.link;
  // if (editSound.volume && editSound.volume < 1) {
  //   volumeSlider.value = editSound.volume * 100;
  // }
}

const player = ref(null);
const videoId = editSound ? editSound.link.slice(-11) : 'AtDij1C-704';
const duration = ref(editSound ? editSound.duration : 0);
const togglePlay = ref(false);

const rangeSlider = ref(
  editSound ? [editSound.start, editSound.start, editSound.end] : [0, 0, 9]
);
const sliderMin = ref(0);
const sliderMax = ref(editSound ? editSound.duration : 9);

let videoState = -1;
// let prevVideoState = null;

const getYoutube = e => {
  if (e.key === 'Enter' || e.type === 'click') {
    /*eslint no-useless-escape: "off"*/
    let regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
    let id = url.value.split(regex)[1];
    if (
      !id ||
      [':', '&', '?'].some(el => id.includes(el)) ||
      id.length !== 11
    ) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Not a valid Youtube link',
        life: 3000
      });
      return;
    }
    if (url.value.split(regex)[2]) {
      let startTime = url.value.split(regex)[2];
      if (startTime.includes('t=')) {
        let seconds = Number(startTime.match(/([0-9]+)/g)[0]);

        player.value.instance.cueVideoById(id, seconds);
        setTimeout(() => {
          rangeSlider.value[0] = seconds;
          rangeSlider.value[1] = seconds;
        }, 500);
        return;
      }
    }
    player.value.instance.cueVideoById(id);
  }
};

const onPlayerReady = () => {
  // console.log('ready');
  resize();
  duration.value = player.value.instance.getDuration();
  sliderMax.value = duration.value;
  if (editSound) {
    player.value.instance.setVolume(editSound.volume * 100);
  }
};
const start = () => {
  // console.log('start', e, i);
  player.value.instance.pauseVideo();
};
const end = (e, i) => {
  // console.log('end', e, i);
  // prevent overlapping sliders
  if (i === 0 && rangeSlider.value[0] >= rangeSlider.value[2]) {
    rangeSlider.value[0] =
      rangeSlider.value[0] - 0.1 >= sliderMin.value
        ? rangeSlider.value[0] - 0.1
        : sliderMin.value;
  } else if (i === 2 && rangeSlider.value[2] <= rangeSlider.value[0]) {
    rangeSlider.value[2] =
      rangeSlider.value[2] + 0.1 <= sliderMax.value
        ? rangeSlider.value[2] + 0.1
        : sliderMax.value;
  }
  if (i === 1) {
    player.value.instance.seekTo(rangeSlider.value[1], true);
    player.value.instance.playVideo();
  } else {
    rangeSlider.value[1] = rangeSlider.value[0];
    player.value.instance.seekTo(rangeSlider.value[1], true);
    player.value.instance.playVideo();
  }
};
// const volumeChange = () => {
//   player.value.instance.setVolume(volumeSlider.value);
// };
const inputStart = e => {
  if (e.value > rangeSlider.value[2]) return;
  rangeSlider.value[0] = e.value;
};
const inputEnd = e => {
  if (rangeSlider.value[1] >= rangeSlider.value[2]) {
    rangeSlider.value[1] = e.value;
  }
  rangeSlider.value[2] = e.value;
};

const onError = error => {
  console.log('youtube error', error);
};
/*
player states:
-1 (unstarted)
0 (ended)
1 (playing)
2 (paused)
3 (buffering)
5 (video cued)
*/
let interval = null;
const stateChange = state => {
  // prevVideoState = videoState;
  videoState = state.data;
  // console.log('state:', videoState);
  // console.log('prev state:', prevVideoState);
  if (videoState === -1 && editSound) {
    player.value.instance.seekTo(rangeSlider.value[0]);
  }
  if (videoState === 1) {
    togglePlay.value = true;
    interval = window.setInterval(() => {
      if (rangeSlider.value[1] >= rangeSlider.value[2]) {
        clearInterval(interval);
        player.value.instance.pauseVideo();
        player.value.instance.seekTo(rangeSlider.value[2], true);
        return;
      }
      rangeSlider.value[1] =
        Math.floor(player.value.instance.getCurrentTime() * 100) / 100;
    }, 5);
  }
  if (videoState !== 1) {
    togglePlay.value = false;
    clearInterval(interval);
  }
  // new video loaded
  if (videoState === 5) {
    duration.value = player.value.instance.getDuration();
    sliderMin.value = 0;
    sliderMax.value = duration.value;
    setTimeout(() => {
      rangeSlider.value[0] = sliderMin.value;
      rangeSlider.value[1] = sliderMin.value;
      rangeSlider.value[2] = sliderMax.value;
    }, 50);
  }
};

const replay = () => {
  rangeSlider.value[1] = rangeSlider.value[0];
  player.value.instance.seekTo(rangeSlider.value[0], true);
  player.value.instance.playVideo();
};

const togglePlayer = () => {
  if (videoState === 1) {
    player.value.instance.pauseVideo();
  } else if (videoState === 0) {
    player.value.instance.seekTo(rangeSlider.value[0], true);
    player.value.instance.playVideo();
  } else {
    if (
      rangeSlider.value[1] <= rangeSlider.value[0] ||
      rangeSlider.value[1] >= rangeSlider.value[2]
    ) {
      rangeSlider.value[1] = rangeSlider.value[0];
      player.value.instance.seekTo(rangeSlider.value[0], true);
    }
    player.value.instance.playVideo();
  }
};

const toggleZoom = ref(false);
const sliderZoom = toggleValue => {
  toggleZoom.value = toggleValue;
  if (toggleZoom.value) {
    sliderMin.value = rangeSlider.value[0];
    sliderMax.value = rangeSlider.value[2];
  } else {
    sliderMin.value = 0;
    sliderMax.value = duration.value;
  }
};

const toast = useToast();
const modal = ref(false);
const soundName = ref('');
const router = useRouter();
const user = useUserStore();

function isValidName(name) {
  return /^[a-zA-Z 0-9\~\!\@\$\^\(\)\_\+\-\=\[\]\{\}\,\.]*$/.test(name);
}

const duplicateModal = ref(false);
const dupes = ref([]);
const presave = () => {
  let regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
  let id = url.value.split(regex)[1];
  if (typeof id === 'string' && id !== '') {
    axios
      .post(
        `${import.meta.env.VITE_API}/duplicates`,
        {
          youtubeId: id
        },
        {
          headers: {
            Authorization: JSON.stringify({
              id: user.id,
              access_token: user.access_token
            })
          }
        }
      )
      .then(res => {
        if (!editSound && Array.isArray(res.data) && res.data.length > 0) {
          dupes.value = res.data;
          duplicateModal.value = true;
        } else {
          modal.value = true;
        }
      });
  }
};

const { isLoading } = storeToRefs(useLoadingStore());
const save = () => {
  if (isLoading.value) return; // user double clicked
  isLoading.value = true;
  if (!editSound && soundName.value === '') {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Can not submit blank name',
      life: 3000
    });
    isLoading.value = false;
  } else if (!isValidName(soundName.value)) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Invalid name, try sticking to alphanumeric characters',
      life: 3000
    });

    isLoading.value = false;
  } else {
    let payload = {
      args: [
        editSound ? editSound.name : soundName.value,
        player.value.instance.getVideoUrl(),
        String(rangeSlider.value[0]),
        String(rangeSlider.value[2])
      ],
      // volume: volumeSlider.value / 100,
      username: user.username
    };
    let endpoint = 'add';
    if (editSound) {
      endpoint = 'update';
    }
    axios
      .post(`${import.meta.env.VITE_API}/${endpoint}`, payload, {
        headers: {
          Authorization: JSON.stringify({
            id: user.id,
            access_token: user.access_token
          })
        }
      })
      .then(res => {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: res.data,
          life: 3000
        });
        guildStore.getSounds();
        router.push('/');
      })
      .catch(e => {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: e.response.data,
          life: 3000
        });
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
};

// ugly tooltip hack
onUpdated(() => {
  if (document.getElementsByClassName('slider-tooltip-bottom').length > 0) {
    return;
  }
  let slider = document.getElementsByClassName('slider-tooltip-top')[1];
  slider.classList.remove('slider-tooltip-top');
  slider.classList.add('slider-tooltip-bottom');
});

onBeforeRouteLeave(async () => {
  // player.value.instance.pauseVideo();
  if (editSound) {
    await soundStore.$reset();
  }
  return true;
});
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style scoped>
#create-container {
  margin-top: 2rem;
}
#replayBtn {
  color: #31d39d !important;
}
#zoomIn {
  color: #40b9ff !important;
}
#togglePlay {
  color: #ec7171;
}
#saveBtn {
  background-color: #40b9ff !important;
  color: #f1f1f1;
}
</style>
