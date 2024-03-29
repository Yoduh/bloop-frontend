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
      width="100%"
      :height="300"
      :playerVars="playerOptions"
      :cookie="false"
      ref="player"
      @state-change="stateChange"
    ></youtube-iframe>
    <div class="grid w-full h-full mt-2 mx-0">
      <div class="flex align-items-center p-0 w-full">
        <div style="flex: 1">
          <ToggleButton
            v-model="descriptionLock"
            class="p-button-rounded p-button-text justify-content-start pr-0"
            onIcon="pi pi-lock"
            offIcon="pi pi-lock-open"
            style="background: inherit; border-color: #0000"
          />
        </div>
        <h3 v-if="descriptionLock">{{ details.name }}</h3>
        <InputText
          v-else
          class="m-0 center-text text-center"
          v-model="details.name"
        ></InputText>
        <div style="flex: 1"></div>
      </div>
      <div class="col-12 flex justify-content-center align-items-center">
        <Textarea
          v-model="details.description"
          class="w-full"
          :disabled="descriptionLock"
          :autoResize="true"
          rows="1"
        ></Textarea>
      </div>
    </div>
    <div class="grid justify-content-center w-full h-full mt-2 text-center">
      <div class="col-4">duration: <br />{{ details.duration }}s</div>
      <div class="col-4">added by: <br />{{ details.user }}</div>
      <div class="col-4">
        created on: <br />{{ new Date(details.createdAt).toLocaleDateString() }}
      </div>
    </div>
    <template v-slot:footer>
      <div class="flex justify-content-between mt-2">
        <div>
          <Button
            label="Edit Clip"
            icon="pi pi-pencil"
            class="p-button-warning"
            @click="editSound()"
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="deleteSound()"
          />
        </div>
        <Button label="OK" icon="pi pi-check" @click="update()" />
      </div>
    </template>
  </Dialog>
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useUserStore } from '@/stores/user';
import { useGuildStore } from '@/stores/guild';
import { useSoundStore } from '@/stores/sound';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { objectsEqual } from '@/helpers/util';

const user = useUserStore();
const guildStore = useGuildStore();
const soundStore = useSoundStore();

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
const emit = defineEmits(['update:modelValue', 'deleted']);
const modal = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value);
    // modal closing -> reset changes
    if (!value) {
      descriptionLock.value = true;
      details.value = props.soundDetails;
    }
  }
});

const details = ref({ ...props.soundDetails });

watch(
  () => props.soundDetails,
  () => {
    details.value = { ...props.soundDetails };
  }
);

const start = computed(() => Math.floor(details.value.start)); // youtube player doesnt work with milliseconds
const end = computed(() => Math.ceil(details.value.end));
const player = ref(null);
const playerOptions = ref({
  start: start,
  end: end,
  controls: 0,
  enablejsapi: 1,
  fs: 0,
  modestbranding: 1,
  rel: 0
});
let videoState = -1;
let prevVideoState = null;
const stateChange = state => {
  prevVideoState = videoState;
  videoState = state.data;
  if (videoState === 1 && prevVideoState === 0) {
    player.value.instance.seekTo(start.value, true);
  }
};

const toast = useToast();
const confirm = useConfirm();

function isValidName(name) {
  // eslint-disable-next-line no-useless-escape
  return /^[a-zA-Z 0-9\~\!\@\$\^\(\)\_\+\-\=\[\]\{\}\,\.]*$/.test(name);
}

const update = () => {
  if (!objectsEqual(details.value, props.soundDetails)) {
    let payload = { name: props.soundDetails.name };
    if (!isValidName(details.value.name)) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid name, try sticking to alphanumeric characters',
        life: 3000
      });
      return;
    }
    if (details.value.name !== props.soundDetails.name) {
      payload.newName = details.value.name;
    }
    if (details.value.description !== props.soundDetails.description) {
      payload.newDescription = details.value.description;
    }
    axios
      .post(`${import.meta.env.VITE_API}/update`, payload, {
        headers: {
          Authorization: JSON.stringify({
            id: user.id,
            access_token: user.access_token
          })
        }
      })
      .then(res => {
        toast.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: res.data,
          life: 3000
        });
      })
      .catch(e => {
        modal.value = false;
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: e.response.data,
          life: 3000
        });
      })
      .finally(() => {
        modal.value = false;
        guildStore.getSounds();
      });
  } else {
    modal.value = false;
  }
};

const deleteSound = () => {
  confirm.require({
    message: `Are you sure you want to delete "${details.value.name}"?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      axios
        .post(
          `${import.meta.env.VITE_API}/remove?name=${details.value.name}`,
          null,
          {
            headers: {
              Authorization: JSON.stringify({
                id: user.id,
                access_token: user.access_token
              })
            }
          }
        )
        .then(() => {
          modal.value = false;
          emit('deleted');
        })
        .catch(e => {
          modal.value = false;
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: e.response.data,
            life: 3000
          });
        });
    },
    reject: () => {
      toast.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'Deletion canceled',
        life: 3000
      });
    }
  });
};

const router = useRouter();
const editSound = () => {
  soundStore.setSound(details.value);
  router.push({
    name: 'Create'
  });
};

const descriptionLock = ref(true);
</script>
