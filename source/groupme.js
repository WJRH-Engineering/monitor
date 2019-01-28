const fetch = require('node-fetch')

const url = "https://api.groupme.com/v3/bots/post"
const bot_id = "76daff87097eaef49770913454"

exports.post = function(message){
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({ bot_id, text: message })
	})
}