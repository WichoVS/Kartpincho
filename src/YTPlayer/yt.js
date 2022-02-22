var passiveEvent = false;
try {
  var opts = Object.defineProperty({}, "passive", {
    get: function () {
      passiveEvent = true;
    },
  });
} catch (e) {}

var videosPlaylist;
var currentPlaying;

passiveEvent = passiveEvent ? { capture: false, passive: true } : true;

document.addEventListener("touchstart", () => {}, passiveEvent);
document.addEventListener("touchmove", () => {}, passiveEvent);
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("player", {
    height: "270",
    width: "480",
    videoId: "",
    playerVars: {
      autoplay: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      PlayVideo: playerPlayVideo,
    },
  });
};

function playerPlayVideo(arrayVideos, index) {
  currentPlaying = index;
  videosPlaylist = arrayVideos;
  player.loadVideoById(arrayVideos[index]);
  $("#ytImage").attr("src", videosPlaylist[index].thumbnail.url);
  $("#ytSong").text(videosPlaylist[index].title);
}

function onPlayerReady(event) {
  player.setPlaybackQuality("small");
  player.loadPlaylist("PLGINh0aYNOJu3CagVb3s0HgW7otaHHmAJ");
  console.log(player);
}

var done = false;

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    if (videosPlaylist.length >= currentPlaying + 1) {
      currentPlaying++;
      player.loadVideoById(videosPlaylist[currentPlaying]);
      $("#ytImage").attr("src", videosPlaylist[currentPlaying].thumbnail.url);
      $("#ytSong").text(videosPlaylist[currentPlaying].title);
    }
  }
}

function stopVideo() {
  player.stopVideo();
}
