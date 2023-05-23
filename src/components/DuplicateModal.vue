<template>
  <Dialog
    header="The following sounds from this video already exist. Please verify your sound is unique before continuing."
    v-model:visible="dialog"
    @hide="close"
    class="dupeModal sm:w-full md:w-5 lg:w-3"
    :dismissableMask="true"
    modal
  >
    <div v-for="(sound, idx) in duplicates" :key="sound.name">
      <div class="grid flex justify-content-between">
        <div class="col">
          <div class="text-lg font-weight-bold">"{{ sound.name }}"</div>
          <small class="text-500"
            >Created by: {{ sound.user }} on
            {{ new Date(sound.createdAt).toLocaleDateString() }}</small
          >
        </div>
        <div class="col flex justify-content-end">
          <Button
            icon="pi pi-play"
            class="p-button-rounded p-button-outlined"
            @click="playSound(sound.name)"
            rounded
            outlined
          />
        </div>
      </div>
      <hr v-if="idx !== duplicates.length - 1" />
    </div>
    <template v-slot:footer>
      <div class="grid flex justify-content-end">
        <Button label="Cancel" icon="pi pi-times" @click="close" autofocus />
        <Button
          label="Continue Saving"
          icon="pi pi-check"
          @click="continueSave"
          autofocus
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { watchEffect, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  duplicates: {
    type: Array,
    default: () => {
      return [];
    }
  }
});

const dialog = ref(false);
watchEffect(() => {
  if (props.modelValue) dialog.value = true;
  else dialog.value = false;
});
const emit = defineEmits(['update:modelValue', 'continueSave']);

const close = () => {
  emit('update:modelValue', false);
};
const continueSave = () => {
  close();
  emit('continueSave');
};

const playSound = name => {
  const audioName = `${import.meta.env.VITE_BACKEND}/${name}.opus`;
  const test = new Audio(audioName);
  test.play();
};
</script>

<style>
.dupeModal .p-dialog-header-icons {
  display: none;
}
</style>
<style scoped>
hr {
  border: 0;
  border-top: 1px solid #464646;
  margin-bottom: 20px;
}
</style>
