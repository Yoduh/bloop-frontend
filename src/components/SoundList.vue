<template>
  <div class="card">
    <DataView
      :value="filteredSounds"
      :layout="layout"
      :paginator="true"
      :rows="layout === 'list' ? 900 : 24"
      :rowsPerPageOptions="[24, 64, 128]"
      :sortOrder="sortOrder"
      :sortField="sortField"
    >
      <template v-slot:header>
        <div
          class="grid align-items-center justify-content-start"
          style="position: relative"
        >
          <div class="col-12 md:col-6 lg:col-4 xl:col-3 flex-order-0">
            <Dropdown
              v-model="sortKey"
              class="w-full"
              :options="sortOptions"
              optionLabel="label"
              placeholder="Sort"
              @change="onSortChange($event)"
            />
          </div>
          <div
            class="col-12 md:col-6 lg:col-4 xl:col-2 flex-order-1 xl:flex-order-2"
          >
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                type="text"
                v-model="soundFilter"
                placeholder="Filter"
                class="w-full"
              />
            </span>
          </div>
          <div
            class="col-12 lg:col-4 xl:col-2 flex-order-2 xl:flex-order-3 flex justify-content-center xl:justify-content-end"
          >
            <Button
              class="mr-5"
              icon="pi pi-sync"
              @click="refreshSounds()"
              v-tooltip.top="'Refresh Sound List'"
            ></Button>
            <DataViewLayoutOptions v-model="layout" style="float: right" />
          </div>
          <div class="col-12 xl:col-5 flex-order-3 xl:flex-order-1 text-center">
            <h3>
              Click an image below to play the sound bite in your selected
              channel
            </h3>
          </div>
        </div>
      </template>

      <template v-slot:list="slotProps">
        <div class="soundListSlot col-7 h-6rem" style="border: none">
          <SoundListSlot
            :sound="slotProps"
            @playSound="emitSound"
            @openModal="openModal"
          />
        </div>
      </template>

      <template v-slot:grid="slotProps">
        <div class="soundGridSlot col-12 sm:col-6 md:col-3">
          <SoundGridSlot
            :sound="slotProps"
            @playSound="emitSound"
            @openModal="openModal"
          />
        </div>
      </template>
    </DataView>
  </div>
  <SoundModal v-model="modal" :soundDetails="soundDetails" />
</template>

<script>
import SoundGridSlot from '../components/SoundGridSlot.vue';
import SoundListSlot from '../components/SoundListSlot.vue';
import SoundModal from '../components/SoundModal.vue';

export default {
  name: 'SoundList',
  emits: ['playSound', 'getSounds'],
  components: { SoundGridSlot, SoundListSlot, SoundModal },
  props: {
    sounds: {
      type: Array,
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      soundFilter: '',
      layout: 'grid',
      soundDetails: {},
      modal: false,
      sortKey: null,
      sortOrder: 1,
      sortField: 'name',
      sortOptions: [
        { label: 'Name (A-Z)', value: 'name' },
        { label: 'Name (Z-A)', value: '!name' },
        { label: 'Created Date (Newest)', value: '!createdAt' },
        { label: 'Created Date (Oldest)', value: 'createdAt' }
      ]
    };
  },
  computed: {
    filteredSounds() {
      if (this.soundFilter === '') return this.sounds;
      let filters = this.soundFilter.split('|').filter(s => s);
      return this.sounds.filter(s => {
        return filters.findIndex(f => s.name.includes(f)) !== -1;
      });
    }
  },
  methods: {
    onSortChange(event) {
      const value = event.value.value;
      const sortValue = event.value;

      if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
        this.sortKey = sortValue;
      } else {
        this.sortOrder = 1;
        this.sortField = value;
        this.sortKey = sortValue;
      }
    },
    emitSound(sound) {
      this.$emit('playSound', sound);
    },
    refreshSounds() {
      this.$emit('getSounds');
      this.$toast.add({
        severity: 'success',
        summary: 'Sounds Refreshed!',
        life: 3000
      });
    },
    openModal(soundDetails) {
      this.soundDetails = { ...soundDetails };
      this.modal = true;
    }
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
.features {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 1300px) {
  .soundGridSlot {
    width: 12.5%;
  }
}
</style>
