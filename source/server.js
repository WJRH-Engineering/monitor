const express = require('express')
const app = express()
const http = require("http").Server(app)

const bodyParser = require('body-parser')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const events = require('events')
exports.events = new events()

app.post('/groupme', function(req, res){
	console.log(req.body)
})

app.listen(4002)

// quick test
const fetch = require('node-fetch')
fetch('http://localhost:4002/groupme', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({a: 1, b: 2})
})