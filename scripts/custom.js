/* globals $ SC */
var Jukebox = {
	songs: [],
	activeSong:	null,
	activeAudio: null,
	isPlaying: false,
	dom: {},

		// run this to start player
	init: function() {
		SC.initialize({ client_id: "fd4e76fc67798bfa742089ed619084a6" });

		this.dom = {
			upload: $(".player-header-upload"),
			// scInput: $(".soundcloud-input"),
			// scUpload: $(".soundcloud-upload"),
			// scResults: $(".sc-results"),
			play: $(".player-control-play"),
			stop: $(".player-control-stop"),
			next: $(".player-control-next"),
			songs: $(".player-songs"),
			song: $(".player-songs-song"),
			// shuffle: $(".player-control-shuffle"),
			// displayArtist: $(".player-display-artist"),
			// displayTitle: $(".player-display-title"),

			input: $(".soundcloud-input"),
			songArt: $(".soundcloud-song-image"),
			songTitle: $(".soundcloud-song-info-title"),
			songArtist: $(".soundcloud-song-info-artist"),
			songDuration: $(".soundcloud-song-info-duration"),
			scPlay: $(".soundcloud-input"),

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
		this.addSong("https://soundcloud.com/equalvision/last-words");
		this.addSong("https://soundcloud.com/dillingerescapeplan/one-of-us-is-the-killer");




		this.change(this.songs[0]);


		this.render();
 		this.listen();
	},

	listen: function() {
		// play/pause
		this.dom.play.on("click", function() {
			if (this.isPlaying) {
				this.pause();
			}
			else {
				this.play();
			}
		}.bind(this));
		//next track
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
		// stop button
		this.dom.stop.on("click", this.stop.bind(this));

		// upload file
		this.dom.upload.on("change", function() {
			var files = this.dom.upload.prop("files");

			for (var i = 0; i < files.length; i++) {
				var file = URL.createObjectURL(files[i]);
				this.addSong(file, {
					title: "Unknown title",
					artist: "Unknown",
				});
			}
		}.bind(this));

		// upload soundcloud url
		this.dom.scPlay.on("change", function(event) {
			var scUrl = this.dom.input.val();
			this.addSong(scUrl);
		}.bind(this));

		// click to play song
		this.dom.songs.on("click ", ".player-songs-song", function(ev) {
			var song = $(ev.currentTarget).data("song");
			this.play(song);
		}.bind(this));
	},

	render: function() {
			//  this.dom.songs.html("");
		for (var i = 0; i < this.songs.length; i++) {
			var $song = this.songs[i].render();

			// this.dom.songs.append($song);

			if (this.songs[i] === this.activeSong) {
				$song.addClass("current-song");
			}
			else {
				$song.removeClass("current-song");
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

	addSong: function(file, meta) {
		// var song = new Song(file, meta)

		var song;

		if (file.indexOf("soundcloud.com") !== -1) {
			song = new SoundCloudSong(file);
		}
		else {
			song = new FileSong(file, meta);
		}
		this.songs.push(song);

		var $song = song.render();

		this.dom.songs.append($song);
		this.render();

		return song;
	},

};



// SONG CLASS
class Song {
	// constructor(file, meta) {
	// 	this.file = file;
	// 	this.meta = meta || {
	// 		title: "Unknown title",
	// 		artist: "Unknown",
	// 	};
	// 	this.audio = new Audio(file);
	// }
	constructor() {
		this.file = null;
		this.meta = {};
		this.audio = null;
		this.$song = $('<div class="player-songs-song"></div>');
		this.$song.data("song", this);
	}

	getTime() {
		var songAudio = this.audio;

		if (songAudio) {
			var dur = this.audio.duration;
			// convert time to mins and secs
			function time(dur) {
				var hours   = Math.floor(dur / 3600);
			  	var minutes = Math.floor((dur - (hours * 3600)) / 60);
			  	var seconds = dur - (hours * 3600) - (minutes * 60);
				  // round seconds
			  	seconds = Math.round(seconds);

				 //   var result = (hours < 10 ? "0" + hours : hours);
				 var  result = (minutes < 10 ? "0" + minutes : minutes);
				result += "m" + (seconds  < 10 ? "0" + seconds : seconds) + "s";
				return result;
			}
			this.$song.append('<div class="player-songs-song-time">' + time(dur) + '</div>');
		}

		return this.$song;
	}

	render() {
		this.$song.html("");
		this.$song.append('<div class="player-songs-song-artist">' + this.meta.artist + '</div>');
		this.$song.append('<div class="player-songs-song-title">' + this.meta.title + '</div>');
		this.getTime();

		return this.$song;
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

class FileSong extends Song {
	constructor(file, meta) {
		super();
		this.file = file;
		this.meta = meta || {
			title: "Unknown title",
			artist: "Unkown artist",
		};
		this.audio = new Audio(file);
	}
}

class SoundCloudSong extends Song {
	constructor(url) {
		super();

		SC.resolve(url)
		.then(function(song) {
			this.meta = {
				title: song.title,
				artist: song.user.username,
				image: song.artwork_url,
				genre: song.genre,
				description: song.description,
				songlink: song.permalink_url,
				userlink: song.user.permalink_url,

			};
			return song;
		}.bind(this))
		.then(function(song) {
			this.audio = new Audio(song.uri + "/stream?client_id=fd4e76fc67798bfa742089ed619084a6");
		}.bind(this))
		.then(function() {
			this.render();
		}.bind(this))
		.catch(function(err) {
			if (err.status === 404) {
				alert("Song Not Found!");
			}
			else {
				alert ("Something went wrong. Try again");
				console.error(err);
			}
		});
	}



	render() {
		if (this.meta.title) {
			this.$song.html("");
			this.$song.append('<div class="player-songs-song-genre">' + 'Genre: ' + this.meta.genre + '</div>');
			this.$song.append('<div class="player-songs-song-artist">' + '<a href="' + this.meta.userlink + '" >' + this.meta.artist + '</a></div>');
			this.$song.append('<div class="player-songs-song-title">' + '<a href="' + this.meta.songlink + '" >' + this.meta.title + '</div>');
			this.$song.append('<img class="player-songs-song-image" src="' +	this.meta.image + '" />');
			this.$song.append('<div class="player-songs-song-description">' + this.meta.description + '</div>');
			this.getTime();
		}
		return this.$song;
	}
}






$(document).ready(function() {
	Jukebox.init();
});
