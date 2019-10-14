const config = require('../config.json')

const timeout_duration = config.timeout || 20 // value in seconds

const events = require('events')
const program = new events()

interface = new events()

// Utility function, returns a promise that
// resolves on the next occurrence of the given event
events.prototype.next = function(event){
	return new Promise(function(resolve, reject){
		program.once(event, args => resolve(args))
	})
}

// Utility function, returns a promise that 
// resolves after the given amount of time
const timeout = function(duration) {
	return new Promise(function(resolve, reject){
		setTimeout(() => resolve("TIMEOUT"), duration * 1000)
	})
}

const systems = config.heartbeats // the systems whose heartbeat we should be listening for
const heartbeats = {}
const status = {}

const race = async function(system){
	// Promise.race() resolves into whichever promise resolves first
	// In this case, we are trying to see if we get a heartbeat event before
	// a timeout event. If not, then we assume that the system is offline
	const next = await Promise.race([
		program.next(`heartbeat_${system}`),
		timeout(timeout_duration)
	])
	
	// if timeout happens first, emit an event and label the system OFFLINE
	if(next == 'TIMEOUT') {
		status[system] = 'OFFLINE'
		interface.emit('SYSTEM-OFFLINE', system)
	}
}

program.on('heartbeat', function(system){

	// update the state of the system
	if(!status[system] || status[system] == 'OFFLINE'){
		status[system] = 'ONLINE'
		interface.emit('SYSTEM-ONLINE', system)
		// groupme.post(`SYSTEM ONLINE: ${system}`)
	}

	program.emit(`heartbeat_${system}`)
	heartbeats[system] = race(system)

})

exports.interface = interface
exports.on = (event, handler) => exports.interface.on(event, handler)

exports.state = status

exports.kick = function(system){
	program.emit(`heartbeat`, system)
}

exports.begin = function(){
	systems.forEach(function(system){
		heartbeats[systems] = race(system)
	})
}