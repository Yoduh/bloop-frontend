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
      :first="jumpTo"
    >
      <template v-slot:header>
        <div
          class="grid align-items-center justify-content-around"
          style="position: relative"
        >
          <div class="col-12 text-center">
            <h3>
              Click an image below to play the sound bite in your selected
              channel
            </h3>
          </div>
        </div>
        <div class="grid justify-content-around -mt-2">
          <div class="col-auto mt-2">
            <Dropdown
              v-model="sortKey"
              class="w-15rem"
              :options="sortOptions"
              optionLabel="label"
              placeholder="Sort"
              @change="onSortChange($event)"
            />
          </div>
          <div class="col-auto mt-2">
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
            class="col-12 xl:col-6 mt-2 flex justify-content-center align-items-center"
          >
            <div
              class="alpha-wrapper flex justify-content-center align-items-center flex-wrap"
            >
              <span class="alphaSelection" @click="jumpToChar(35)">#</span>
              <span
                v-for="i in 26"
                :key="i"
                class="alphaSelection"
                @click="jumpToChar(i + 64)"
              >
                {{ String.fromCharCode(i + 64) }}
              </span>
            </div>
          </div>

          <div class="col-auto mt-2">
            <Button
              class="mr-5"
              icon="pi pi-sync"
              @click="refreshSounds()"
              v-tooltip.top="'Refresh Sound List'"
            ></Button>
            <DataViewLayoutOptions v-model="layout" style="float: right" />
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
      jumpTo: 0,
      sortOptions: [
        { label: 'Name (A-Z)', value: 'name' },
        { label: 'Name (Z-A)', value: '!name' },
        { label: 'Favorites', value: '!isFavorite' },
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
      this.jumpTo = 0;

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
    },
    delay(ms) {
      return new Promise(res => setTimeout(res, ms));
    },
    async jumpToChar(i) {
      /* PrimeVue's dataview component doesnt expose the items as they are currently sorted.
      Therefore setting the paginator page like this only works with the default A-Z sort.
      However, changing the sort back to the default ALSO sets the page to 0 (uncontrollably),
      and if I set the page without at least SOME delay, the set fails.
      */
      if (this.sortField !== 'name' || this.sortOrder !== 1) {
        this.sortKey = {
          label: 'Name (A-Z)',
          value: 'name'
        };
        this.sortField = 'name';
        this.sortOrder = 1;
        await this.delay(0); // the time to resolve a promise even with 0 delay is itself enough of a delay. GROSS.
      }
      let c = String.fromCharCode(i);
      if (c === '#') {
        this.jumpTo = 0;
        return;
      }
      let index = this.filteredSounds.findIndex(s =>
        s.name.startsWith(c.toLowerCase())
      );
      if (index === -1) {
        if (c === 'A') index = 0;
        else {
          this.jumpToChar(i - 1);
          return;
        }
      }
      this.jumpTo = index;
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
.alpha-wrapper {
  line-height: 38px;
}
.alphaSelection {
  color: rgb(199, 199, 199);
  cursor: pointer;
  transition: font-size 100ms;
  min-width: 28px;
}
.alphaSelection:hover {
  color: white;
  font-size: 2rem;
}

@media (min-width: 1300px) {
  .soundGridSlot {
    width: 12.5%;
  }
}
</style>
