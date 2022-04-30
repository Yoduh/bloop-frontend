<template>
  <div class="sound-grid-item card h-100" style="position: relative">
    <Button
      icon="pi pi-ellipsis-v"
      class="p-button-rounded p-button-text"
      style="color: #fff; position: absolute; top: 0rem; right: 0rem"
      @click="toggle"
    />
    <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
    <div class="sound-grid-item-content">
      <div class="sound-grid-item-top mt-0">
        <h2>{{ sound.data.name }}</h2>
      </div>
      <div class="img-container" @click="$emit('playSound', sound.data.name)">
        <img
          :src="`https://img.youtube.com/vi/${sound.data.link.slice(
            -11
          )}/mqdefault.jpg`"
          :alt="sound.data.name"
          class="img-sound"
        />
        <div class="img-hover">
          <i class="pi pi-send" style="font-size: 3rem; color: #fff"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SoundGridSlot',
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
    }
  }
};
</script>

<style scoped>
.sound-grid-item.card {
  background-color: #1e1e1e;
  padding: 0.5rem;
}
img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
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
  height: 0;
  display: inline-block;
  overflow: hidden;
  width: 56%;
  padding-bottom: 56%;
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

.p-button {
  color: rgba(255, 255, 255, 0.87);
}

.sound-grid-item {
  margin: 0.5rem;
  border: 1px solid var(--surface-border);
}
.sound-grid-item-top {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0rem;
}
.sound-grid-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
