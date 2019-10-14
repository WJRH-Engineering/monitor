const express = require('express')
const app = express()
const http = require("http").Server(app)

const log = require('./log.js')

const bodyParser = require('body-parser')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const events = require('events')
interface = new events()

app.post('/groupme', function(req, res){
	console.log(req.body.text)

	if(req.body.text == "!status"){
		console.log("success")
		exports.interface.emit('GROUPME-COMMAND')
	}
})

app.post('/log', function(req, res){
	const { event, data, sender } = req.body

	if(event) {
		exports.interface.emit(event, {sender, ...data})
	}

	res.send("success")
})

exports.init = function(port){
	app.listen(port)
}

exports.interface = interface
exports.on = (event, handler) => exports.interface.on(event, handler)


// quick test
// const fetch = require('node-fetch')
// fetch('http://localhost:4002/log', {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     method: "POST",
//     body: JSON.stringify({a: 1, b: 2})
// })