const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {pingTimeout: 60000});
const port = process.env.PORT || 5000;
const MongodbManager = require('./mongodb-manager');
const mongodbManager = new MongodbManager('poker', 'leaderboard');

io.on('connection', (client) => {
	const emitPlayers = () => {
		return Promise.resolve()
		.then(() => mongodbManager.list())
		.then((players) => io.emit('players', players));
	};

	client.on('add_player', (player) => {
		return Promise.resolve()
		.then(() => mongodbManager.create(player))
		.then(() => emitPlayers());
	});

	client.on('update_player', (player) => {
		return Promise.resolve()
		.then(() => mongodbManager.update(player))
		.then(() => emitPlayers());
	});

	client.on('delete_player', (playerId) => {
		return Promise.resolve()
		.then(() => mongodbManager.delete(playerId))
		.then(() => emitPlayers());
	});

	client.on('get_players', () => {
		return Promise.resolve()
		.then(() => emitPlayers());
	});

	return emitPlayers();
})

http.listen(port, () => console.log(`Listening on port ${port}`));