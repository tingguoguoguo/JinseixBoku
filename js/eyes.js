function initEye() {

  // 開眼的函數
  function openEye() {
    const eye = document.querySelector(".eye")
    const eyeLid = document.querySelector(".eye__lid")
    const eyeLidmask = document.querySelector(".eye__lid__mask")
    const eyeBall = document.querySelector(".eye__ball")
    eyeLid.style.transform = 'translate(-50%, -50%) rotateX(180deg)';
    eyeLidmask.style.opacity = '0';
    eyeBall.style.opacity = '1';
    eyeBall.style.bottom = '150px';
  }

  // 關眼的函數
  function closeEye() {
    const eye = document.querySelector(".eye")
    const eyeLid = document.querySelector(".eye__lid")
    const eyeLidmask = document.querySelector(".eye__lid__mask")
    const eyeBall = document.querySelector(".eye__ball")
    eyeLid.style.transform = 'translate(-50%, -50%)';
    eyeLidmask.style.opacity = '1';
    eyeBall.style.opacity = '0';
    eyeBall.style.bottom = '-50px';
  }

  // 每隔 4.8 秒眨一次眼
  setInterval(() => {
    closeEye();
    // 0.5 秒後再開眼
    setTimeout(openEye, 200);
  }, 4000);
}
initEye();

/* 小尺寸的CD冒出 */
function smallAlbum() {
  const albumCover = document.querySelector('.album__cover');
  const canvasZoom = document.querySelector('.canvas__zoom');
  const playerZoom = document.querySelector('.player__zoom');

  albumCover.addEventListener('mouseenter', function () {
    canvasZoom.style.left = '190px';
    canvasZoom.style.transition = 'left 0.3s ease-in-out';
    playerZoom.style.transform = 'scale(1)';
    playerZoom.style.left = '-50%';
    playerZoom.style.transition = 'transform 0.3s ease-in-out';
    playerZoom.style.transition = 'left 0.3s ease-in-out';
  })
}

smallAlbum();
window.addEventListener('resize', smallAlbum);