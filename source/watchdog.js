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

// const test = async function(){
// 	await timeout(5)
// 	console.log("timeout")
// }

// test()

const systems = [ "DOOR" ] // the systems whose heartbeat we should be listening for
const heartbeats = {}

// program.on(`heartbeat_DOOR`, ()=> console.log("reset door"))

// program.emit('heartbeat_DOOR')

const reset = function(system){
	heartbeats[system] = Promise.race([
		program.next(`heartbeat_${system}`),
		timeout(timeout_duration)
	])
	.then(event => {
		if(event == "TIMEOUT"){
			console.log(`SYSTEM OFFLINE: ${system}`)
		}
	})
}

const begin = function(){
	systems.forEach(function(system){
		reset(system)
	})
}

program.on('heartbeat', function({ system }){
	program.emit(`heartbeat_${system}`)
	reset(system)
})

exports.kick = function(system){
	program.emit(`heartbeat`, { system })
}

begin()