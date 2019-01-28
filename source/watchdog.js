const timeout_duration = 5 // value in seconds

const events = require('events')
const program = new events()

events.prototype.next = function(event){
	return new Promise(function(resolve, reject){
		program.once(event, args => resolve(args))
	})
}

// return a promise that resolves after the given amount of time
const timeout = function(duration) {
	return new Promise(function(resolve, reject){
		setTimeout(() => resolve("TIMEOUT"), duration * 1000)
	})
}

const systems = [ "DOOR" ] // the systems whose heartbeat we should be listening for
const heartbeats = {}
const status = {}

const reset = async function(system){
	const next = Promise.race([
		program.next(`heartbeat_${system}`),
		timeout(timeout_duration)
	])

	const event = await next
	
	if(event == 'TIMEOUT') {
		console.log(`SYSTEM OFFLINE: ${system}`)
		status[system] = 'OFFLINE'
	}
}

const begin = function(){
	systems.forEach(function(system){
		heartbeats[systems] = reset(system)
	})
}

program.on('heartbeat', function(system){

	// update the state of the system
	if(!status[system] || status[system] == 'OFFLINE'){
		status[system] = 'ONLINE'
		console.log(`SYSTEM ONLINE: ${system}`)
	}

	program.emit(`heartbeat_${system}`)
	heartbeats[system] = reset(system)

})

exports.kick = function(system){
	program.emit(`heartbeat`, system)
}

begin()