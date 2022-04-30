<template>
  <div class="sound-list-item card h-full pb-0" style="position: relative">
    <Button
      icon="pi pi-ellipsis-v"
      class="p-button-rounded p-button-text"
      style="color: #fff; position: absolute; top: 0rem; right: 0rem"
      @click="toggle"
    />
    <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
    <div class="grid align-items-center h-full w-full">
      <div
        class="col-1 img-container"
        @click="$emit('playSound', sound.data.name)"
      >
        <img
          :src="`https://img.youtube.com/vi/${sound.data.link.slice(
            -11
          )}/mqdefault.jpg`"
          :alt="sound.data.name"
          class="img-sound mt-1 ml-1"
        />
        <div class="img-hover">
          <i class="pi pi-send" style="font-size: 2rem; color: #fff"></i>
        </div>
      </div>
      <div
        class="col-6 flex flex-column justify-content-start align-items-start h-full ml-3"
      >
        <h2 style="margin: 0">{{ sound.data.name }}</h2>
        <i style="font-size: 0.8rem">{{ sound.data.description }}</i>
      </div>
      <div
        class="col h-full flex flex-column justify-content-end align-items-end pt-0"
      >
        <div>created by: {{ sound.data.user }}</div>
        <div>duration: {{ sound.data.duration }}s</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SoundListSlot',
  props: {
    sound: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      items: [
        {
          label: 'Preview',
          icon: 'pi pi-volume-up',
          command: () => {
            this.previewSound(this.sound.data.name);
          }
        },
        {
          label: 'Details',
          icon: 'pi pi-info-circle',
          command: () => {
            this.$emit('openModal', this.sound.data);
          }
        }
      ]
    };
  },
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    previewSound(name) {
      new Audio(`https://yoduh.dev/${name}.opus`).play();
    },
    gotoYoutube(link, start) {
      window.open(`${link}&t=${this.timestampToSeconds(start)}`);
    },
    timestampToSeconds(timestamp) {
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
    }
  }
};
</script>

<style scoped>
.sound-list-item.card {
  background-color: #1e1e1e;
  padding: 0.5rem;
}
img {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  object-fit: cover;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
.text {
  background-color: #04aa6d;
  color: white;
  font-size: 16px;
  padding: 16px 32px;
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

.sound-list-item {
  margin: 0.5rem;
  border: 1px solid var(--surface-border);
}
.sound-list-item-top {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0rem;
}
.sound-list-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
