const express = require('express')
const app = express()
const http = require("http").Server(app)

const events = require('events')
exports.events = new events()

app.post('/groupme', function(req, res){
	console.log(groupme)
})

app.listen(4002)