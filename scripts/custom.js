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
				change: $(".player-control-change"),

				songs: $(".player-songs"),
				song: $(".player-songs-song"),


			};

			this.addSong("songs/PrimitivesTalk.mp3");
			this.change(this.songs[0]);

			this.render();
 			this.listen();
		},

		listen: function() {
			this.dom.play.on("click", function() {
				this.play();
			}.bind(this));
			this.dom.stop.on("click", this.stop.bind(this));
			this.dom.change.on("click", this.change.bind(this));
		},

		render: function() {
			 this.dom.songs.html("");
			for (var i = 0; i < this.songs.length; i++) {
				var $song = this.songs[i].render();
				this.dom.songs.append($song);
			}

			// indicate play or pause
			this.dom.play.toggleClass("isDisabled",  this.isPlaying);
			this.dom.stop.toggleClass("isDisabled", !this.isPlaying);
		},

		play: function(song) {
			if (song) {
				this.change(song);
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
		},

		stop: function() {
			console.log("stopping");
			if (!this.activeSong) {
				return false;
			}

			this.activeSong.stop();
			this.isPlaying = false;
			this.render();
			return this.activeSong;
		},

		change: function(song) {
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

		}

		stop() {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
	}


	$(document).ready(function() {
		Jukebox.init();
	});
