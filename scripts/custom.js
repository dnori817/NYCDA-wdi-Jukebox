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
			shuffle: $(".player-control-shuffle"),
			displayArtist: $(".player-display-artist"),
			displayTitle: $(".player-display-title"),


		};

		this.addSong("songs/NaturalBornFarmer.mp3", {
			title: "Natural Born Farmer",
			artist: "Glassjaw",
		});
		this.addSong("songs/AllGoodJunkies.mp3", {
			title: "All Good Junkies Go To Heaven",
			artist: "Glassjaw",
		});
		this.addSong("songs/PrimitivesTalk.mp3", {
			title: "The Primitives Talk",
			artist: "Zach Hill",
		});
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

		/* I borrowed the upload function from your example */
		this.dom.upload.on("change", function() {
			var files = this.dom.upload.prop("files");
			console.log(files);

			for (var i = 0; i < files.length; i++) {
				var file = URL.createObjectURL(files[i]);
				this.addSong(file, {
					title: "Unknown title",
					artist: "Unknown",
				});
			}
		}.bind(this));


		/* Still working on the shuffle function */

		// this.dom.shuffle.on("click",  function() {
		// 	var songs = this.songs;
		// 	this.shuffle(songs).play();
		// }.bind(this));
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

	/* borrowed most of this code for the next function from your example */
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
/* Shuffle function work in progress */

	// shuffle: function(array) {
	// 	  var currentIndex = array.length, temporaryValue, randomIndex;
	//
	// 	  // While there remain elements to shuffle...
	// 	  while (0 !== currentIndex) {
	// 	    // Pick a remaining element...
	// 	    randomIndex = Math.floor(Math.random() * currentIndex);
	// 	    currentIndex -= 1;
	//
	// 	    // And swap it with the current element.
	// 	    temporaryValue = array[currentIndex];
	// 	    array[currentIndex] = array[randomIndex];
	// 	    array[randomIndex] = temporaryValue;
	// 	  }
	//
	// 	  return array;
	// },

	addSong: function(file, meta) {
		var song = new Song(file, meta);
		this.songs.push(song);
		this.render();
		return song;
	},


};



// SONG CLASS
class Song {
	constructor(file, meta) {
		this.file = file;
		this.meta = meta || {
			title: "Unknown title",
			artist: "Unknown",
		};
		this.audio = new Audio(file);
	}

	render() {
		var $song = $('<div class="player-songs-song"></div>');
		$song.append('<div class="player-songs-song-artist">' + this.meta.artist + '</div>');
		$song.append('<div class="player-songs-song-title">' + this.meta.title + '</div>');

		/* Found a function that converts seconds to hours, minutes and seconds
		 and tweaked it to fit the format I wanted */
		var dur = this.audio.duration;
		var time = function(dur) {
			  var hours   = Math.floor(dur / 3600);
			  var minutes = Math.floor((dur - (hours * 3600)) / 60);
			  var seconds = dur - (hours * 3600) - (minutes * 60);
			  // round seconds
			  seconds = Math.round(seconds);

			  var result = (hours < 10 ? "0" + hours : hours);
			    result += "h" + (minutes < 10 ? "0" + minutes : minutes);
			result += "m" + (seconds  < 10 ? "0" + seconds : seconds) + "s";
			return result;
		};

		$song.append('<div class="player-songs-song-time">' + time(dur) + '</div>');

		return $song;
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
