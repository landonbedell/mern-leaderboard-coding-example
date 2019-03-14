const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
const MongodbManager = require('./mongodb-manager');

app.get('/player', (req, res) => {
	res.send({ 
		players: [
			{
				name: 'Ralph',
				winnings: 35
			}
		]
	});
});

const mongodbManager = new MongodbManager('poker', 'leaderboard');

io.on('connection', (client) => {
	console.log('subscribeToLeaderboard!!!!');
	const emitPlayers = () => {
		return Promise.resolve()
		.then(() => mongodbManager.list())
		.then((players) => io.emit('players', players));
	};

	client.on('add_player', (player) => {
		return Promise.resolve()
		.then(() => {
			console.log('ADDING PLAYER', player);
			return mongodbManager.create(player);
		})
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
	})

	client.on('get_players', () => {
		console.log('emitting players');
		return Promise.resolve()
		.then(() => emitPlayers());
	});

	return Promise.resolve()
	.then(() => mongodbManager.list())
	.then((players) => io.emit('players', players));
})

http.listen(port, () => console.log(`Listening on port ${port}`));