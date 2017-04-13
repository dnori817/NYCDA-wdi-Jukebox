/* globals $ */


	var Jukebox = {
		songs: [],
		activeSong:	null,
		isPlaying: false,
		dom: {},

		// run this to start player
		init: function() {
			this.dom = {
				play: $(".player-control-play"),
				stop: $(".player-control-stop"),
				next: $(".player-control-next"),

				songs: $(".player-songs"),
				song: $(".player-songs-song"),


			};

			this.addSong("songs/PrimitivesTalk.mp3");
			this.next(this.songs[0]);

			this.render();
 			this.listen();
		},

		listen: function() {
			this.dom.play.on("click", function() {
				if (this.isPlaying) {
					this.pause();
				}
				else {
					this.play();
				}
			}.bind(this));

			this.dom.stop.on("click", this.stop.bind(this));
			this.dom.next.on("click", this.next.bind(this));
		},

		render: function() {
			 this.dom.songs.html("");
			for (var i = 0; i < this.songs.length; i++) {
				var $song = this.songs[i].render();
				this.dom.songs.append($song);
			}

			// indicate play or pause
			this.dom.play.toggleClass("icon-pause",  this.isPlaying);
			this.dom.play.toggleClass("icon-play", !this.isPlaying);
			this.dom.stop.toggleClass("isDisabled", !this.isPlaying);
		},

		play: function(song) {
			if (song) {
				this.next(song);
			}

			if (this.activeSong) {
				this.isPlaying = true;
			 	this.activeSong.play();
				this.render();
				return this.activeSong;
			}
			else {
				return false;
			}
		},


		pause: function() {
			if (!this.activeSong) {
				return false;
			}

			this.isPlaying = false;
			this.activeSong.pause();
			this.render();
			return this.activeSong;
		},

		stop: function() {
			if (!this.activeSong) {
				return false;
			}

			this.activeSong.stop();
			this.isPlaying = false;
			this.render();
			return this.activeSong;
		},

		next: function(song) {
			if (this.activeSong) {
				this.activeSong.stop();
			}

			this.activeSong = song;
			this.render();
			return this.activeSong;
		},

		// shuffle: function() {
		//
		// },

		addSong: function(path) {
			this.songs.push(new Song(path));
		},


	};



// SONG CLASS
	class Song {
		constructor(file) {
			this.file = file;
			this.audio = new Audio(file);
		}

		render() {
			return $('<div class="player-songs-song">' + this.file + '</div>');
		}

		play() {
			this.audio.play();
		}

		pause() {
			this.audio.pause();
		}

		stop() {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
	}


	$(document).ready(function() {
		Jukebox.init();
	});
