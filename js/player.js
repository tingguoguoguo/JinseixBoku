// vue-----------------------------------------------------------------
const { createApp, ref, reactive, onMounted, onBeforeUnmount } = Vue;

const app = createApp({
  setup() {
    const songs = ref([
      {
        name: "01-Clock Strikes",
        src: "../music/01-Clock Strikes.mp3"
      },
      {
        name: "02-Nothing Helps",
        src: "../music/02-NothingHelps.mp3"
      },
      {
        name: "03-The Same As...",
        src: "../music/03-the same as....mp3"
      },
      {
        name: "04-Smiling Down",
        src: "../music/04-Smiling down.mp3"
      },
      {
        name: "05-Ending Story??",
        src: "../music/05-Ending Story.mp3"
      },
      {
        name: "06-The Beginning",
        src: "../music/06-The Beginning.mp3"
      },
      {
        name: "07-ONION!",
        src: "../music/07-ONION!.mp3"
      },
      {
        name: "08-Be The Light",
        src: "../music/08-Be the Light.mp3"
      }, {
        name: "09-Deeper Deeper",
        src: "../music/09-Deeper Deeper.mp3"
      }, {
        name: "10-All Mine",
        src: "../music/10-All Mine.mp3"
      }
    ]);
    const currentSong = ref(songs.value[0]);
    const audio = new Audio();
    const isPlaying = ref(false);
    const isRepeating = ref(false);
    const isShuffling = ref(false);
    const progress = ref(0);
    let currentIndex = ref(undefined);

    const isLargeScreen = ref(window.innerWidth > 767);
    const updateScreenSize = () => {
      isLargeScreen.value = window.innerWidth > 767;
    };


    const playMusic = (index, speed = 1) => {
      audio.playbackRate = speed;
      cd.angleSpeed = speed;
      cd.friction = 1
      // 如果 index 為 undefined 或者 index 不等於 currentIndex.value，則播放歌曲
      if (index === undefined || index !== currentIndex.value) {
        console.log("haha")
        currentIndex.value = index !== undefined ? index : 0; // 如果 index 為 undefined，播放第一首歌
        currentSong.value = songs.value[currentIndex.value];
        audio.src = currentSong.value.src;
        audio.addEventListener('canplay', () => {
          audio.playbackRate = speed;
          progress.value = 0;
          audio.play();
          isPlaying.value = true;
          cd.angleSpeed = 1
          cd.friction = 1
          audio.addEventListener('timeupdate', updateProgress);
        }, { once: true });
      } else {
        if (audio.paused) {
          audio.play();
          isPlaying.value = true;
        } else {
          audio.pause();
          isPlaying.value = false;
          cd.angleSpeed = 0
          cd.friction = 1
        }
      }
    }

    const updateProgress = () => {
      progress.value = (audio.currentTime / audio.duration) * 100;
    };

    const seekMusic = (e) => {
      audio.currentTime = (e.target.value / 100) * audio.duration;
      progress.value = e.target.value;
    };

    const prevMusic = () => {
      let index = songs.value.findIndex(song => song === currentSong.value);
      index = (index - 1 + songs.value.length) % songs.value.length;
      playMusic(index);
    };

    const nextMusic = () => {
      let index = songs.value.findIndex(song => song === currentSong.value);
      index = (index + 1) % songs.value.length;
      playMusic(index);
    };

    const playNextOrStop = () => {
      nextMusic();
      if (currentIndex.value === songs.value.length - 1) {
        isPlaying.value = false;
      }
    };
    audio.addEventListener('ended', playNextOrStop);

    const repeatMusic = () => {
      isRepeating.value = !isRepeating.value;
      audio.loop = isRepeating.value;
    };

    const shuffleMusic = () => {
      isShuffling.value = !isShuffling.value;
      if (isShuffling.value) {
        songs.value = songs.value.sort(() => Math.random() - 0.5);
      } else {
        songs.value = songs.value.sort((a, b) => a.name.localeCompare(b.name));
      }
    };

    onMounted(() => {
      window.addEventListener('resize', updateScreenSize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateScreenSize);
    });



    return {
      songs,
      currentSong,
      currentIndex,
      audio,
      isPlaying,
      isRepeating,
      isShuffling,
      progress,
      isLargeScreen,
      playMusic,
      prevMusic,
      nextMusic,
      updateProgress,
      seekMusic,
      playNextOrStop,
      repeatMusic,
      shuffleMusic,
      updateScreenSize,
    };
  }
}).mount('#app');