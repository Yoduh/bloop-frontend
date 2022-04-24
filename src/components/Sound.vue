<template>
  <div class="sound-grid-item card">
    <div class="sound-grid-item-content">
      <div class="sound-grid-item-top">
        <h2 class="mr-2">{{ sound.data.name }}</h2>
      </div>
      <div class="img-container" @click="$emit('playSound', sound.data.name)">
        <img
          :src="`https://img.youtube.com/vi/${sound.data.link.slice(
            -11
          )}/mqdefault.jpg`"
          :alt="sound.data.name"
          class="img-sound"
          width="150"
          height="150"
        />
        <div class="img-hover">
          <i class="pi pi-send" style="font-size: 4rem; color: #a4e48a"></i>
        </div>
      </div>
      <div class="sound-description">
        {{ description(sound.data.description) }}
      </div>
    </div>
    <div class="sound-grid-item-bottom mt-1">
      <Button
        class="p-button-rounded p-button-text"
        @click="gotoYoutube(sound.data.link, sound.data.start)"
        v-tooltip.top="'Source'"
      >
        <img src="../assets/yt-icon.png" width="50" class="mr-2" />
      </Button>
      <Button
        icon="pi pi-play"
        class="p-button-success p-button-rounded p-button-outlined"
        @click="previewSound(sound.data.name)"
        v-tooltip.top="'Preview'"
      ></Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sound',
  props: {
    sound: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    previewSound(name) {
      new Audio(`https://yoduh.dev/${name}.opus`).play();
    },
    description(text) {
      if (text === '') return 'No description available';
      else return text;
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
.sound-grid-item.card {
  background-color: #1e1e1e;
}
img {
  border-radius: 20% !important;
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
  opacity: 0;
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
}
.sound-grid-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sound-description {
  margin-top: 15px;
  font-style: italic;
  height: 2em;
}
</style>
