const fs = require('fs')

const prettyprint = function(data){
	console.log(`${data.time} - ${data.name}: "${data.msg}"`)
}

const log_song = function(info){
	const {title, artist, isRobo} = info
	const text = `${isRobo ? "RoboDJ" : "LiveDJ"} --- ${title} by ${artist} \n`
	fs.appendFileSync('song-log.txt', text);
}

const log = function(data){
	prettyprint(data)

	if(data.msg == "new-track"){
		log_song(data)
	}
}

module.exports = log