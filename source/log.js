const log = function(event, data){
	console.log(`${data["name"]}: ${data["msg"]}`)
}

module.exports = log
