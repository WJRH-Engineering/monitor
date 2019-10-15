const config = require('../config.json')

const server = require('./server.js')
const watchdog = require('./watchdog.js')
const groupme = require('./groupme.js')
const log = require('./log.js')

// Handle watchdog events
server.on('HEARTBEAT', function({ name }){
	watchdog.kick(name)
})

watchdog.on('SYSTEM-OFFLINE', function(system){
	log('Watchdog', 'SYSTEM-OFFLINE', system)
	groupme.post(`${system} is offline`)
})

watchdog.on('SYSTEM-ONLINE', function(system){
	log({
		name: 'Watchdog',
		msg: 'SYSTEM-ONLINE',
		system: system,
		time: Date.now(),
	})
	groupme.post(`${system} is online`)
})

// Handle groupme commands
server.on('GROUPME-COMMAND', function(command){
	for(key in watchdog.state){
		groupme.post(`${key}: ${watchdog.state[key]}`)
	}
})

// Handle logging
server.on('LOG', function(data){
	log(data)
})

server.init(config.port || 80)
watchdog.begin()