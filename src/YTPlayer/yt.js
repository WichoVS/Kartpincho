var passiveEvent = false;
var videosPlaylist;
var currentPlaying;
const APIKEY = "AIzaSyCahpRLo0SMKUbnrzzgOjZjwdZXRy6wwso";
var player;
var arrayPlaylistVideos = [];

try {
  var opts = Object.defineProperty({}, "passive", {
    get: function () {
      passiveEvent = true;
    },
  });
} catch (e) {}

passiveEvent = passiveEvent ? { capture: false, passive: true } : true;

document.addEventListener("touchstart", () => {}, passiveEvent);
document.addEventListener("touchmove", () => {}, passiveEvent);
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
  player.setVolume(100);
}

function onPlayerReady(event) {
  player.setPlaybackQuality("small");
  GetVideosPlaylist(partida.Playlist);
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

const GetVideosPlaylist = (playlistID) => {
  $.ajax({
    url: `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistID}&key=${APIKEY}&maxResults=50`,
    type: "GET",
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    success: (data) => {
      console.log(data);
      data.items.forEach((e) => {
        let videoYT = new YTVideo(
          e.snippet.title,
          e.snippet.thumbnails.default,
          e.snippet.position,
          e.snippet.resourceId.videoId
        );

        arrayPlaylistVideos.push(videoYT);
      });
      playerPlayVideo(arrayPlaylistVideos, 0);
      $("#divSong").css("display", "none");
    },
    error: (xmlHttpRequest, errorThrown) => {
      console.log(errorThrown);
    },
  });
};
