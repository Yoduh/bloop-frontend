<template>
  <DataTable
    :value="props.sounds"
    :paginator="true"
    class="p-datatable-customers w-full"
    :rows="100"
    dataKey="_id"
    :rowHover="true"
    :scrollable="true"
    scrollHeight="83vh"
    scrollDirection="vertical"
    v-model:filters="filters"
    filterDisplay="menu"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[100, 250, 500]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
    :globalFilterFields="['name']"
    responsiveLayout="scroll"
  >
    <template v-slot:header>
      <div class="flex justify-content-between align-items-center">
        <h2 class="m-0">Sound Bite List</h2>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Keyword Search"
          />
        </span>
      </div>
    </template>
    <template v-slot:empty> No sounds found. </template>
    <Column field="name" header="Name" sortable>
      <template v-slot:body="{ data }">
        <div class="grid align-items-start justify-content-start col-auto">
          <div class="col-auto flex flex-column align-items-center">
            <div
              class="img-container mr-2"
              @click="$emit('playSound', data.name)"
            >
              <img
                :src="`https://img.youtube.com/vi/${data.link.slice(
                  -11
                )}/mqdefault.jpg`"
                :alt="data.name"
                class="img-sound"
              />
              <div class="img-hover">
                <i class="pi pi-send" style="font-size: 2rem; color: #fff"></i>
              </div>
            </div>
            {{ data.name }}
          </div>
        </div>
      </template>
      <template v-slot:filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by name"
        />
      </template>
    </Column>
    <Column field="description" header="Description" sortable>
      <template v-slot:body="{ data }">
        {{ data.description }}
      </template>
      <template v-slot:filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by description"
        />
      </template>
    </Column>
    <Column field="user" header="Created By" sortable>
      <template v-slot:body="{ data }">
        {{ data.user }}
      </template>
      <template v-slot:filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by created by"
        />
      </template>
    </Column>
    <Column field="createdAt" header="Created Date" sortable>
      <template v-slot:body="{ data }">
        {{ new Date(data.createdAt).toLocaleDateString() }}
      </template>
      <template v-slot:filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by created date"
        />
      </template>
    </Column>
    <Column field="duration" header="Duration" sortable>
      <template v-slot:body="{ data }"> {{ data.duration }}s </template>
      <template v-slot:filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by duration"
        />
      </template>
    </Column>
    <Column field="playCount" header="Play Count" sortable>
      <template v-slot:body="{ data }">
        {{ data.playCount }}
      </template>
      <template v-slot:filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by play count"
        />
      </template>
    </Column>
    <Column field="file">
      <template v-slot:body="{ data }">
        <Button
          type="button"
          icon="pi pi-cog"
          @click="toggle($event, data)"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        ></Button>
      </template>
    </Column>
  </DataTable>
  <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
</template>

<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  sounds: {
    type: Array,
    default: () => []
  }
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  }
});
const selectedSound = ref(null);
const emit = defineEmits(['openModal', 'playSound']);

const menu = ref();
const menuItems = [
  {
    id: 0,
    label: 'Preview',
    icon: 'pi pi-volume-up',
    command: () => {
      previewSound(selectedSound.value?.name);
    }
  },
  {
    id: 1,
    label: 'Details',
    icon: 'pi pi-info-circle',
    command: () => {
      emit('openModal', selectedSound.value);
    }
  },
  {
    id: 2,
    label: 'Set Entrance',
    icon: 'pi pi-discord',
    command: () => {
      setEntrance(selectedSound.value);
    }
  },
  {
    id: 3,
    label: 'Disable Entrance',
    icon: 'pi pi-ban',
    command: () => {
      setEntrance(null);
    }
  }
];

const user = useUserStore();
const items = computed(() => {
  if (user.entrance && user.entrance === selectedSound.value?.name) {
    return menuItems.filter(i => i.id !== 2);
  } else {
    return menuItems.filter(i => i.id !== 3);
  }
});
const toggle = (event, sound) => {
  selectedSound.value = sound;
  menu.value.toggle(event);
};

const previewSound = name => {
  new Audio(`${import.meta.env.VITE_BACKEND}/${name}.opus`).play();
};
const gotoYoutube = (link, start) => {
  window.open(`${link}&t=${this.timestampToSeconds(start)}`);
};
const timestampToSeconds = timestamp => {
  // timestamp given is already in seconds
  if (!timestamp.includes(':')) {
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
const toast = useToast();
const setEntrance = sound => {
  const soundName = sound?.name ?? null;
  console.log('soundName', soundName);
  axios
    .post(
      `${import.meta.env.VITE_API}/entrance`,
      {
        userId: user.id,
        soundName
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
      user.entrance = soundName;
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: res.data,
        life: 3000
      });
    })
    .catch(e => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: e.response.data,
        life: 3000
      });
    });
};
</script>

<style scoped>
img {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  object-fit: cover;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
.img-container {
  position: relative;
}
.img-container:hover .img-sound {
  cursor: pointer;
  opacity: 0.2;
}

.img-container:hover .img-hover {
  cursor: pointer;
  opacity: 1;
}
.img-hover {
  opacity: 0.6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
</style>
