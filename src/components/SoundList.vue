<template>
  <div class="card">
    <DataView
      :value="filteredSounds"
      :layout="layout"
      :paginator="true"
      :rows="24"
      :rowsPerPageOptions="[24, 64, 128]"
      :sortOrder="sortOrder"
      :sortField="sortField"
    >
      <template v-slot:header>
        <div class="grid justify-content-between align-items-center">
          <div class="col-2" style="text-align: left">
            <Dropdown
              v-model="sortKey"
              class="w-full"
              :options="sortOptions"
              optionLabel="label"
              placeholder="Sort"
              @change="onSortChange($event)"
            />
          </div>
          <div class="col-auto mx-3 flex justify-content-start">
            <h3>
              Click an image below to play the sound bite in your selected
              channel
            </h3>
          </div>
          <div class="col-auto flex align-items-center justify-content-end">
            <Button
              label="Refresh List"
              class="mr-5"
              icon="pi pi-sync"
              @click="refreshSounds()"
            ></Button>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                type="text"
                v-model="soundFilter"
                placeholder="Filter"
              />
            </span>
          </div>
          <!-- <div class="col-6" style="text-align: right">
            <DataViewLayoutOptions v-model="layout" />
          </div> -->
        </div>
      </template>

      <template v-slot:list="slotProps">
        <div class="col-12">
          <div class="sound-list-item">
            <img
              src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
              :alt="slotProps.data.name"
            />
            <div class="sound-list-detail">
              <div class="sound-name">{{ slotProps.data.name }}</div>
              <div class="sound-description">
                {{ slotProps.data.description }}
              </div>
              <i class="pi pi-youtube sound-category-icon"></i
              ><span class="sound-category">{{ slotProps.data.link }}</span>
            </div>
            <div class="sound-list-action">
              <Button icon="pi pi-play" label="Play Sound"></Button>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:grid="slotProps">
        <div class="soundGridSlot sm:col-6 md:col-3">
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
import SoundModal from '../components/SoundModal.vue';

export default {
  name: 'SoundList',
  emits: ['playSound', 'getSounds'],
  components: { SoundGridSlot, SoundModal },
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
      sortOrder: null,
      sortField: null,
      sortOptions: [
        { label: 'Name (A-Z)', value: 'name' },
        { label: 'Name (Z-A)', value: '!name' },
        { label: 'Created Date (Newest)', value: '!created' },
        { label: 'Created Date (Oldest)', value: 'created' }
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
      console.log('value', event.value.value);
      console.log('sortValue', event.value);

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
  padding: 1rem;
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
