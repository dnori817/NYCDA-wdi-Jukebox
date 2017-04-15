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
				upload: $(".player-input"),
				songs: $(".player-songs"),
				song: $(".player-songs-song"),


			};

			this.addSong("songs/NaturalBornFarmer.mp3");
			this.addSong("songs/AllGoodJunkies.mp3");
			this.addSong("songs/PrimitivesTalk.mp3");
			this.change(this.songs[0]);

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

			this.dom.next.on("click", function() {
				// if song is playing, clicking next will play next song automatically
				if (this.isPlaying) {
					this.next(1).play();
				}
				else {
					// if song is not playing, next will queue up next song and user must hit play
					this.next(1);
				}
			}.bind(this));

			this.dom.stop.on("click", this.stop.bind(this));

			this.dom.upload.on("change", function() {
				var files = this.dom.upload.prop("files");
				console.log(files);

				for (var i = 0; i < files.length; i++) {
					var file = URL.createObjectURL(files[i]);
					this.addSong(file, {
						title: "Uploaded song",
						artist: "Unknown",
					});
				}
			}.bind(this));
		},

		render: function() {
			 this.dom.songs.html("");
			for (var i = 0; i < this.songs.length; i++) {
				var $song = this.songs[i].render();

				this.dom.songs.append($song);

				if (this.songs[i] === this.activeSong) {
					$song.addClass("current-song");
				}
			}

			// indicate play or pause
			this.dom.play.toggleClass("icon-pause",  this.isPlaying);
			this.dom.play.toggleClass("icon-play", !this.isPlaying);
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

		change: function(song) {
			if (this.activeSong) {
				this.activeSong.stop();
			}

			this.activeSong = song;
			this.render();
			return this.activeSong;
		},

		next: function(direction) {
			if (!this.activeSong) {
				return false;
			}
			// Find the current song's index
			var idx = this.songs.indexOf(this.activeSong);

			// Set the desired index by adding the direction, and limiting it to the
			// length of the array using a modulous operator
			var desiredIndex = (idx + direction) % this.songs.length;



			// Change to the desired song
			return this.change(this.songs[desiredIndex]);
		},

		// shuffle: function() {
		//
		// },

		addSong: function(file) {
			var song = new Song(file);
			this.songs.push(song);
			this.render();
			return song;
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
