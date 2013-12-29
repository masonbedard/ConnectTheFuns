var connect = function(socket) {
	console.log("new connection");
}

// the following is the initialization of the sockets 
exports.init = function(cio) {
  var io = cio;
  io.sockets.on('connection', connect);
}
