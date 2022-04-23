<template>
  <div v-if="sounds" class="card">
    <span class="p-input-icon-left">
      <i class="pi pi-search" />
      <InputText type="text" v-model="soundFilter" placeholder="Filter" />
    </span>
    <DataView
      :value="filteredSounds"
      :layout="layout"
      :paginator="true"
      :rows="24"
      :rowsPerPageOptions="[24, 48, 96]"
      :sortOrder="sortOrder"
      :sortField="sortField"
    >
      <!-- <template v-slot:header>
        <div class="grid grid-nogutter">
          <div class="col-6" style="text-align: left">
            <Dropdown
              v-model="sortKey"
              :options="sortOptions"
              optionLabel="label"
              placeholder="Sort By Price"
              @change="onSortChange($event)"
            />
          </div>
          <div class="col-6" style="text-align: right">
            <DataViewLayoutOptions v-model="layout" />
          </div>
        </div>
      </template> -->

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
        <div class="col-12 md:col-2">
          <Sound :sound="slotProps" @playSound="emitSound" />
        </div>
      </template>
    </DataView>
  </div>
</template>

<script>
import Sound from '../components/Sound.vue';

export default {
  name: 'SoundList',
  components: { Sound },
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
      sortKey: null,
      sortOrder: null,
      sortField: null
      //   sortOptions: [
      //     { label: 'Sort Name High to Low', value: '!name' },
      //     { label: 'Sort Name Low to High', value: 'name' }
      //   ]
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
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  padding: 1rem;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
@media screen and (max-width: 576px) {
  .sound-list-item {
    flex-direction: column;
    align-items: center;

    img {
      margin: 2rem 0;
    }

    .sound-list-detail {
      text-align: center;
    }

    .sound-price {
      align-self: center;
    }

    .sound-list-action {
      display: flex;
      flex-direction: column;
    }

    .sound-list-action {
      margin-top: 2rem;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
}
</style>
