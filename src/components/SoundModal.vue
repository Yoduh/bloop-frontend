<template>
  <Dialog
    id="soundModal"
    v-model:visible="modal"
    :modal="true"
    :show-header="false"
    :dismissableMask="true"
    :style="{ width: '30vw' }"
    :breakpoints="{ '1500px': '40vw', '960px': '50vw', '640px': '100vw' }"
    :contentStyle="{ padding: 0 }"
  >
    <youtube-iframe
      :video-id="details.link.slice(-11)"
      player-width="100%"
      :player-height="300"
      :playerParameters="playerOptions"
      :no-cookie="true"
      ref="player"
      @state-change="stateChange"
    ></youtube-iframe>
    <div class="grid w-full h-full mt-2">
      <div class="col-12 flex justify-content-center align-items-start">
        <ToggleButton
          v-model="descriptionLock"
          class="p-button-rounded p-button-text"
          onIcon="pi pi-lock"
          offIcon="pi pi-lock-open"
          style="background: inherit; border-color: #0000"
        />
        <Textarea
          v-model="details.description"
          class="w-full"
          :disabled="descriptionLock"
          :autoResize="true"
          rows="1"
        ></Textarea>
      </div>
    </div>
    <div class="grid justify-content-center w-full h-full mt-2">
      <div class="col-2">start: <br />{{ details.start }}</div>
      <div class="col-2">duration: <br />{{ details.duration }}s</div>
      <div class="col-3">added by: <br />{{ details.user }}</div>
      <div class="col-3">
        created on: <br />{{ details.created.split(',')[0] }}
      </div>
    </div>
    <template v-slot:footer>
      <Button label="OK" icon="pi pi-check" autofocus @click="modal = false" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  soundDetails: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['update:modelValue']);
const modal = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});

const timestampToSeconds = timestamp => {
  if (!timestamp) return;
  if (!String(timestamp.includes(':'))) {
    return Number(timestamp);
  }
  let ms = 0;
  if (timestamp.includes('.')) {
    let split = timestamp.split('.');
    timestamp = split[0];
    ms = Number('0.' + split[1]);
  }
  return parseInt(
    timestamp.split(':').reduce((acc, time) => 60 * acc + +time) + ms
  );
};

const details = computed(() => props.soundDetails);
const start = computed(() => timestampToSeconds(details.value.start));
const end = computed(() => Math.ceil(start.value + details.value.duration));
const player = ref(null);
const playerOptions = ref({
  start: start,
  end: end
});
let videoState = -1;
let prevVideoState = null;
const stateChange = state => {
  prevVideoState = videoState;
  videoState = state.data;
  if (videoState === 1 && prevVideoState === 0) {
    player.value.seekTo(start.value, true);
  }
};

const descriptionLock = ref(true);
</script>
