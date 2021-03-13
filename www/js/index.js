let app = {
  volume: 0.5,
  track: {},
  tracks: [
    {
      id: 0,
      artist: 'The Chainsmokers & Drew Love',
      album: 'Sick Boy - EP',
      title: 'Somebody',
      image: './img/sickboy.png',
      length: 223,
      src: 'file:///android_asset/www/media/Somebody.mp3',
      //src: './media/Somebody.mp3',
    },
    {
      id: 1,
      artist: `Kungs & Cookin' On 3 Burners`,
      album: 'Layers',
      title: 'This Girl',
      image: './img/kungs.png',
      length: 196,
      src: 'file:///android_asset/www/media/ThisGirl.mp3',
      //src: './media/ThisGirl.mp3',
    },
    {
      id: 2,
      artist: 'The Chainsmokers & Coldplay',
      album: 'Memories...Do Not Open',
      title: 'Something Just Like This',
      image: './img/memories.png',
      length: 247,
      src: 'file:///android_asset/www/media/SomethingJustLikeThis.mp3',
      //src: './media/SomethingJustLikeThis.mp3',
    },
    {
      id: 3,
      artist: 'OneRepublic',
      album: 'Native',
      title: 'Counting Stars',
      image: './img/native.png',
      length: 257,
      src: 'file:///android_asset/www/media/CountingStars.mp3',
    },
    {
      id: 4,
      artist: 'The Chainsmokers',
      album: 'Bouquet',
      title: 'Roses',
      image: './img/Bouquet.png',
      length: 226,
      src: 'file:///android_asset/www/media/Roses.mp3',
    },
  ],

  media: null,
  status: {
    0: 'MEDIA_NONE',
    1: 'MEDIA_STARTING',
    2: 'MEDIA_RUNNING',
    3: 'MEDIA_PAUSED',
    4: 'MEDIA_STOPPED',
  },
  err: {
    1: 'MEDIA_ERR_ABORTED',
    2: 'MEDIA_ERR_NETWORK',
    3: 'MEDIA_ERR_DECODE',
    4: 'MEDIA_ERR_NONE_SUPPORTED',
  },

  init: function () {
    document.addEventListener('deviceready', app.ready, false);
    app.showTrackCard();
  },
  ready: function () {
    app.addListeners();
  },
  ftw: function () {
    //success creating the media object and playing, stopping, or recording
    console.log('success doing something');
  },
  wtf: function (err) {
    //failure of playback of media object
    console.warn('failure');
    console.error(err);
  },
  addListeners: function () {
    document.querySelector('.track-list').addEventListener('click', app.player);
    document.querySelector('#btnBack').addEventListener('click', app.backBtn);
    //player listeners
    document
      .querySelector('#play-btn-home')
      .addEventListener('click', app.play);
    document
      .querySelector('#pause-btn-home')
      .addEventListener('click', app.pause);
    document.querySelector('#play-btn').addEventListener('click', app.play);
    document.querySelector('#pause-btn').addEventListener('click', app.pause);
    document.querySelector('#up-btn').addEventListener('click', app.volumeUp);
    document
      .querySelector('#down-btn')
      .addEventListener('click', app.volumeDown);
    document.querySelector('#ff-btn').addEventListener('click', app.ff);
    document.querySelector('#rew-btn').addEventListener('click', app.rew);
    document.addEventListener('pause', () => {
      app.media.release();
    });
    document.querySelector('input');
  },
  currentSong: function () {
    app.media = new Media(app.track.src, app.ftw, app.wtf, app.statusChange);
  },
  statusChange: function (status) {
    console.log('media status is now ' + app.status[status]);

    if (app.status[status] === 'MEDIA_STOPPED') {
      let match = app.tracks.findIndex(function (track) {
        if (track.id == this.id) return true;
      }, app.track);
      console.log(match);
      let nextMatch = match + 1;
      app.track = app.tracks[nextMatch];
      console.log(app.track);

      app.currentSong();
      app.songDetailsCard();
      app.play();
    }
  },
  //show list of tracks on homepage
  showTrackCard: function () {
    let trackList = document.getElementById('track-list');

    app.tracks.forEach((track) => {
      let li = document.createElement('li');
      li.setAttribute('class', 'track');

      let trackCard = document.createElement('div');
      trackCard.setAttribute('class', 'trackCard');
      trackCard.setAttribute('id', track.id);

      let trackDiv = document.createElement('div');
      trackDiv.setAttribute('class', 'trackDiv');
      trackDiv.setAttribute('id', track.id);

      let title = document.createElement('p');
      title.setAttribute('class', 'songs');
      title.setAttribute('id', track.id);
      title.textContent = track.title;

      let artist = document.createElement('P');
      artist.setAttribute('class', 'artistHome');
      artist.setAttribute('id', track.id);
      artist.textContent = track.artist;

      let image = document.createElement('img');
      image.setAttribute('src', track.image);
      image.setAttribute('class', 'thumbnail');
      image.setAttribute('id', track.id);

      trackDiv.append(title);
      trackDiv.append(artist);
      trackCard.append(trackDiv);
      trackCard.append(image);
      li.append(trackCard);
      trackList.appendChild(li);
    });
  },
  //populate player page
  player: function (ev) {
    let selectedTrack = ev.target;
    let selectedTrackID = selectedTrack.id;
    console.log('new track');

    if (app.track.id != selectedTrackID) {
      app.track = app.tracks[selectedTrackID];

      try {
        app.pause();
      } catch (error) {
        console.log('no song currently playing:' + error);
      }
      app.currentSong();
      app.play();
      console.log('inside');
    } else {
      app.pause();
      app.play();
    }
    app.songDetailsCard();

    document.querySelector('.page.active').classList.remove('active');
    document.getElementById('player').classList.add('active');
  },
  changeRange: function () {
    //count up and down timers on screen
    function duration() {
      app.media.getCurrentPosition((pos) => {
        let dur = app.media.getDuration();

        function convertSeconds(s) {
          let min = 0;
          let sec = 00;
          min = Math.floor(s / 60);
          sec = ('0' + Math.floor(s % 60)).slice(-2);
          return min + ':' + sec;
        }
        let currentPos = pos++;
        let timeLeft = dur - pos;
        let timer = document.querySelector('.duration');
        let timerUp = document.querySelector('.start');

        timerUp.innerHTML = convertSeconds(currentPos);
        timer.innerHTML = convertSeconds(timeLeft + 1);
      });
    }
    setInterval(duration, 1000);
    //timer range
    function rangeTimer() {
      app.media.getCurrentPosition((pos) => {
        let dur = app.media.getDuration();

        let range = document.querySelector('input');
        range.setAttribute('max', Math.floor(dur));
        range.setAttribute('value', Math.floor(pos));
      });
    }
    setInterval(rangeTimer, 1000);
    document.getElementById('duration').disabled = true;
  },

  songDetailsCard: function () {
    let image = document.querySelector('.songImage');
    let title = document.querySelector('.songTitle');
    let artist = document.querySelector('.songArtist');
    let nowPlaying = document.querySelector('.nowPlaying');
    image.setAttribute('src', app.track.image);
    nowPlaying.textContent = app.track.title;
    title.textContent = app.track.title;
    artist.textContent = app.track.artist;
    document.getElementById('footer').style.display = 'grid';
    app.changeRange();
  },
  backBtn: function () {
    document.querySelector('.page.active').classList.remove('active');
    document.getElementById('home').classList.add('active');
  },
  play: function () {
    app.media.play();
    document.getElementById('play-btn').style.display = 'none';
    document.getElementById('play-btn-home').style.display = 'none';
    document.getElementById('pause-btn-home').style.display = 'block';
    document.getElementById('pause-btn').style.display = 'block';
  },
  pause: function () {
    app.media.pause();
    document.getElementById('play-btn').style.display = 'block';
    document.getElementById('play-btn-home').style.display = 'block';
    document.getElementById('pause-btn').style.display = 'none';
    document.getElementById('pause-btn-home').style.display = 'none';
  },
  volumeUp: function () {
    vol = parseFloat(app.track.volume); // 0.5 or 50%
    console.log('current volume', vol);
    vol += 0.1; //this is 10% volume
    if (vol > 1) {
      vol = 1.0;
    }
    console.log(vol);
    app.media.setVolume(vol);
    app.track.volume = vol; // update volume to new vol
  },
  volumeDown: function () {
    vol = app.volume;
    console.log('current volume', vol);
    vol -= 0.1;
    if (vol < 0) {
      vol = 0;
    }
    console.log(vol);
    app.media.setVolume(vol);
    app.track.volume = vol;
  },
  ff: function () {
    app.media.getCurrentPosition((pos) => {
      let dur = app.media.getDuration(); // will give total song time in seconds
      console.log('current position', pos);
      console.log('duration', dur);
      pos += 10; //will add 10 seconds to the current position
      if (pos < dur) {
        app.media.seekTo(pos * 1000); // seek to uses milliseconds thats why we multiply by 1000
      }
    });
  },
  rew: function () {
    app.media.getCurrentPosition((pos) => {
      pos -= 10;
      if (pos > 0) {
        app.media.seekTo(pos * 1000);
      } else {
        app.media.seekTo(0);
      }
    });
  },
};

app.init();
