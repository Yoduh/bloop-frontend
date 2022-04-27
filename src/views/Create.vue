<template>
  <div id="create-container">
    <div class="grid mt-5 flex justify-content-center">
      <div class="sm:col-10 md:col-7 lg:col-6 xl:col-4">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search" />
          <InputText
            class="w-full mb-2"
            type="text"
            v-model="url"
            placeholder="Enter Youtube URL"
            @keypress="getYoutube"
          />
        </span>
      </div>
    </div>
    <youtube-iframe
      :video-id="'AtDij1C-704'"
      :player-width="500"
      :player-height="300"
      :no-cookie="true"
      :playerParameters="playerOptions"
      @ready="onPlayerReady"
      @state-change="stateChange"
      @error="onError"
      ref="player"
    ></youtube-iframe>
    <div class="grid mt-5 flex justify-content-center">
      <div class="sm:col-10 md:col-7 lg:col-6 xl:col-4">
        <Slider
          v-model="rangeSlider"
          show-tooltip="always"
          :min="0"
          :max="duration"
          :step="0.01"
          :options="sliderOptions"
          @start="start"
          @end="end"
        />
        <div class="grid justify-content-center mt-7">
          <ToggleButton
            id="toggleBtn"
            class="p-button-outlined mx-5"
            v-model="toggleBtn"
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
        </div>
        <div
          class="p-fluid grid formgrid mt-3 start-end-inputs justify-content-between align-items-start"
        >
          <div
            class="sm:col-5 lg:col-4 xl:col-5 flex flex-column justify-content-start"
          >
            <div>Start</div>
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
            <div>End</div>
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
        <div class="grid justify-content-center mt-6">
          <Button
            id="saveBtn"
            label="Save"
            icon="pi pi-save"
            class="p-button-rounded p-button-lg"
            @click="modal = true"
          />
        </div>
      </div>
    </div>
  </div>
  <Dialog
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
      @keypress="save"
    />
    <template v-slot:footer>
      <Button label="OK" icon="pi pi-check" @click="save" autofocus />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onUpdated, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';
import axios from 'axios';

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
const player = ref(null);
const duration = ref(0);

const rangeSlider = ref([0, 0, 9]);
const toggleBtn = ref(false);

let videoState = -1;
let prevVideoState = null;

const getYoutube = e => {
  if (e.key === 'Enter') {
    let id = url.value.slice(-11);
    player.value.cueVideoById(id);
  }
};

const onPlayerReady = () => {
  duration.value = player.value.getDuration();
};
const start = () => {
  player.value.pauseVideo();
};
const end = (e, i) => {
  if (i === 1) {
    player.value.seekTo(rangeSlider.value[1], true);
  }
  // prevent overlapping sliders
  if (i === 0 && rangeSlider.value[0] >= rangeSlider.value[2]) {
    rangeSlider.value[0] =
      rangeSlider.value[0] - 0.1 >= 0 ? rangeSlider.value[0] - 0.1 : 0;
  } else if (i === 2 && rangeSlider.value[2] <= rangeSlider.value[0]) {
    rangeSlider.value[2] =
      rangeSlider.value[2] + 0.1 <= duration.value
        ? rangeSlider.value[2] + 0.1
        : duration.value;
  }
};
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
const onError = error => {
  console.log('youtube error', error);
};
// to-do: refactor this mess
const stateChange = state => {
  prevVideoState = videoState;
  videoState = state.data;
  // console.log('state:', videoState);
  // console.log('prev state:', prevVideoState);
  if (videoState === 3 && prevVideoState === 3) {
    // wtf are you doing (reset to start because youtube messed up)
    player.value.seekTo(rangeSlider.value[0], true);
  }
  if (videoState === 3 && prevVideoState === -1) {
    player.value.seekTo(rangeSlider.value[1], true);
  }
  // play back from beginning
  if (videoState === 1 && prevVideoState === 0) {
    rangeSlider.value[1] = rangeSlider.value[0];
    player.value.seekTo(rangeSlider.value[0], true);
  }
  if (videoState === 1) {
    toggleBtn.value = true;
    if (rangeSlider.value[1] >= rangeSlider.value[2]) {
      rangeSlider.value[1] = rangeSlider.value[0];
      player.value.seekTo(rangeSlider.value[0], true);
      return;
    }
    interval = window.setInterval(() => {
      if (rangeSlider.value[1] >= rangeSlider.value[2]) {
        clearInterval(interval);
        player.value.pauseVideo();
        player.value.seekTo(rangeSlider.value[2], true);
        return;
      }
      rangeSlider.value[1] =
        Math.floor(player.value.getCurrentTime() * 100) / 100;
    }, 5);
  }
  if (videoState !== 1 && interval) {
    clearInterval(interval);
  }
  if (videoState === 2 || videoState === 0) {
    toggleBtn.value = false;
  }
  // new video loaded
  if (videoState === 5) {
    duration.value = player.value.getDuration();
    setTimeout(() => {
      rangeSlider.value[0] = 0;
      rangeSlider.value[1] = 0;
      rangeSlider.value[2] = duration.value;
    }, 50);
  }
};

const replay = () => {
  rangeSlider.value[1] = rangeSlider.value[0];
  player.value.seekTo(rangeSlider.value[0], true);
  player.value.playVideo();
};

const togglePlayer = () => {
  if (videoState === 1) {
    player.value.pauseVideo();
  } else {
    if (rangeSlider.value[1] >= rangeSlider.value[2]) {
      rangeSlider.value[1] = rangeSlider.value[0];
      player.value.seekTo(rangeSlider.value[0], true);
    }
    player.value.playVideo();
  }
};

const toast = useToast();
const modal = ref(false);
const soundName = ref('');
const store = useStore();
const router = useRouter();
const user = computed(() => store.state.user);

const save = e => {
  if (e.key === 'Enter' || e.type === 'click') {
    if (soundName.value === '') {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Can not submit blank name',
        life: 3000
      });
    } else {
      let payload = {
        args: [
          soundName.value,
          player.value.getVideoUrl(),
          String(rangeSlider.value[0]),
          String(rangeSlider.value[2])
        ],
        userId: user.value.id
      };
      axios
        .post(`${import.meta.env.VITE_API}/add`, payload, {
          headers: {
            Authorization: JSON.stringify({
              id: user.value.id,
              access_token: user.value.access_token
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
          router.push('/');
        })
        .catch(e => {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: e.response.data,
            life: 3000
          });
        });
    }
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
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style scoped>
#create-container {
  margin-top: 100px;
}
#toggleBtn,
#replayBtn {
  color: #40b9ff !important;
}
#saveBtn {
  background-color: #40b9ff !important;
  color: #f1f1f1;
}
</style>