const config = require('../config.json')

const server = require('./server.js')
const bunyan = require('bunyan')
const watchdog = require('./watchdog.js')
const groupme = require('./groupme.js')

// Handle watchdog events
server.on('HEARTBEAT', function({ sender }){
	watchdog.kick(sender)
})

watchdog.on('SYSTEM-OFFLINE', function(system){
	groupme.post(`${system} is offline`)
})

watchdog.on('SYSTEM-ONLINE', function(system){
	groupme.post(`${system} is online`)
	console.log(watchdog.state)
})

// Handle groupme commands
server.on('GROUPME-COMMAND', function(command){
	for(key in watchdog.state){
		console.log(key)
		groupme.post(`${key}: ${watchdog.state[key]}`)
	}
})

server.init(config.port || 80)
watchdog.begin()