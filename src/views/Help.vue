<template>
  <div id="help">
    <div style="display: flex; flex-direction: column" class="mt-3">
      <router-link to="#creating" class="text-primary"
        ><h3 class="my-3">1. Creating Sounds</h3></router-link
      >
      <router-link to="#playing" class="text-primary"
        ><h3 class="my-3">2. Playing Sounds</h3></router-link
      >
      <router-link to="#editing" class="text-primary"
        ><h3 class="my-3">3. Editing Sounds</h3></router-link
      >
      <router-link to="#entrance" class="text-primary"
        ><h3 class="my-3">4. Set Entrance Sound</h3></router-link
      >
    </div>

    <Transition>
      <Button
        v-if="y > 10"
        icon="pi pi-chevron-up"
        aria-label="scroll-up"
        id="toTopBtn"
        @click="y = 0"
      />
    </Transition>
    <div class="flex justify-content-center">
      <div class="col-5">
        <hr class="my-8" />
        <h1 id="creating" class="anchorLink">Creating Sounds</h1>
        <div class="text-left">
          <h2 class="text-primary">Step 1</h2>
          <p>
            You can create a sound bite from ANY YouTube video (that isn't age
            restricted). Find the video you want to make a sound bite from and
            copy the URL
          </p>
          <h3>Example</h3>
          <p>
            I want the sound bite of Jim Raynor from Starcraft saying "This is
            Jimmy". I search YouTube and copy this link:
            <a href="https://www.youtube.com/watch?v=ia0ydt3JA9A"
              >https://www.youtube.com/watch?v=ia0ydt3JA9A</a
            >
          </p>
        </div>
        <div class="mt-8 text-left">
          <h2 class="text-primary">Step 2</h2>
          <p>
            Paste the URL in the text box of the
            <router-link to="/create">Create New Sound</router-link> page then
            hit Enter to load the video.
          </p>
          <p>
            Sliders below the video can be used to "crop" the video to just the
            sound bite you want to save:
          </p>
          <Image src="src/assets/help-sliders.webp" alt="sliders" />
          <p>
            The <span class="text-red-600 font-bold">red</span> slider controls
            the playback of the video
          </p>
          <p>
            The <span class="text-green-300 font-bold">green</span> sliders are
            used to "crop" the start and end of the video. You will move these
            to the exact positions you want your sound bite to start and end.
          </p>
          <p>
            Begin by moving the
            <span class="text-red-600 font-bold">red</span> slider to just
            before the start of the sound bite, then drag the
            <span class="text-green-300 font-bold">first green</span> slider
            right onto the red slider to set the start position. Resume the
            video until you reach the end of the desired sound bite then drag
            the
            <span class="text-green-300 font-bold">second green</span> slider
            left onto the red slider to set the end position.
          </p>

          <h3>Example</h3>
          <p>
            The sound bite I want is around the 10 second mark and goes until
            around the 12 second mark:
          </p>
          <Image src="src/assets/tut1.gif" alt="slider gif" />
        </div>
        <div class="mt-8 text-left">
          <h2 class="text-primary">Step 3</h2>
          <p>
            Fine tune the start and end positions if needed using tools like the
            mangifier or Start and End text boxes for entering precise times
          </p>
          <p>
            The magnifier when clicked will set the start of the
            <strong>playback bar</strong>
            to the current first slider position, while the end of the playback
            bar will be set to the second slider position. This will give more
            room for fine tuning the sliders. Clicking the magnifier again will
            zoom out to the original size.
          </p>
          <h3>Example</h3>
          <p>
            I use the magnifier to help me place the start and end sliders at
            the precise start and end times of 10.60s and 11.37s respectively:
          </p>
          <Image src="src/assets/tut2.gif" alt="slider2 gif" />
        </div>
        <div class="mt-8 text-left">
          <h2 class="text-primary">Step 4</h2>
          <p>
            Hit the Save button and give your sound bite a name! It can not
            share the same name as an existing sound, but it is common for
            similar sounds to share the same name with unique numbers appended.
            This lets users find and easily use multiple sound bites sharing
            similar words or phrases.
          </p>
          <h3>Example</h3>
          <p>I will save this sound bite with the name "jimmy"</p>
          <Image src="src/assets/jimmy.webp" alt="jimmy" />
          <p>
            You will be returned to the home screen once the sound has been
            saved successfully. Now go and annoy your friends with your new
            sound!
          </p>
        </div>
        <hr class="my-8" />
        <h1 id="playing" class="anchorLink">Playing Sounds</h1>
        <div class="text-left">
          <h2 class="text-primary">Step 1</h2>
          <p>
            Logging in with your Discord credentials will automatically populate
            these dropdowns with servers you belong to that also have Bloop bot.
            Select the dropdown and channel you want to play sound bites in
          </p>
          <Image
            src="src/assets/selects.webp"
            alt="server and channel selects"
          />
          <h2 class="text-primary">Step 2</h2>
          <p>
            Find the sound bite you want to play. There are two ways to search.
          </p>
          <h3>Method 1: Browsing</h3>
          <p>
            You can browse all sound bites using the pagination controls at the
            bottom.
          </p>
          <Image src="src/assets/pagination.webp" alt="pagination" />
          <h3>Method 2: Sort and Filter</h3>
          <p>
            You can sort by different sound bite properties, or filter by a
            specific word or phase. Hovering over the question mark icon next to
            Filter will explain more advanced filtering techniques such as exact
            search using double quotations "", and using vertical bar | to
            perform multiple searches with combined results (boolean OR).
          </p>
          <Image src="src/assets/sortfilter.webp" alt="sort and filter" />
          <p>
            When sorted alphabetically you can also use the alphabet buttons to
            jump to a page with sound bites starting with that letter.
          </p>
          <p>
            The fastest way to find a brand new sound you just made is to sort
            by "Created Date (Newest)"
          </p>
          <h2 class="text-primary">Step 3</h2>
          <p>
            Click the thumbnail to play the sound in the selected server and
            channel. If you want to hear the sound bite without playing it in
            Discord, you can use the 3 dots to open a menu to then preview the
            sound in your browser.
          </p>
          <Image src="src/assets/jimmybite.webp" alt="jimmy soundbite" />
          <p>
            Also note the yellow bookmark icon in the top left. Clicking this
            will save the sound bite to appear when sorting by "My Favorites"
          </p>
        </div>
        <hr class="my-8" />
        <h1 id="editing" class="anchorLink">Editing Sounds</h1>
        <div class="text-left">
          <p>
            Find a sound you want to edit. Click the 3 dots to open a menu and
            click "Details". This will open a pop-up:
          </p>
          <Image src="src/assets/editsound.webp" alt="edit sound modal" />
          <h3>Renaming a sound bite</h3>
          <p>
            Click the lock icon to the left of the sound bite name. This will
            unlock the name and an optional description text box. Change these
            texts and click save
          </p>
          <Image src="src/assets/rename.webp" alt="rename fields" />
          <p>Click OK to save these changes.</p>
          <h3>Editing start/end time of sound bite</h3>
          <p>
            Click the "Edit Clip" button. It will take you to the same page you
            create a sound but it will be prepopulated with the existing sound
            bite information. Edit the clip just as you would when creating then
            click Save.
          </p>
          <h3>Delete</h3>
          <p>
            Click the "Delete" button. This will delete the sound from the
            server for <em>everyone</em>. Please don't do this for fun.
          </p>
        </div>
        <hr class="my-8" />
        <h1 id="entrance" class="anchorLink">Set Entrance Sound</h1>
        <div class="text-left">
          <p>
            An entrance sound will automatically play every time you join a
            voice channel. To set an entrance sound, find a sound bite you want
            to represent you, then click the 3 dots and choose "Set Entrance"
          </p>
          <Image src="src/assets/entrance1.webp" alt="set entrance option" />
          <p>
            To disable any entrance sound from playing, find the exact same
            sound bite you used to set your entrance. The 3 dots menu will have
            a different option to "Disable Entrance".
          </p>
          <Image
            src="src/assets/entrance2.webp"
            alt="disable entrance option"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWindowScroll } from '@vueuse/core';
const { y } = useWindowScroll();
</script>

<style scoped>
.anchorLink::before {
  content: '';
  display: block;
  height: 100px;
  margin-top: -100px;
  visibility: hidden;
}

#toTopBtn {
  position: fixed;
  bottom: 2rem;
  right: 5rem;
}
#toTopBtn:hover {
  background: #eee;
}
#help {
  scroll-behavior: smooth;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
