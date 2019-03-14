import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import EditPlayerModal from './EditPlayerModal';

const socket = openSocket('http://localhost:5000');

const styles = (theme) => ({
	title: {
		paddingTop: '20px'
	},
});

class Leaderboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			players: [],
			pIndex: 1,
			editOpen: false,
			editPlayer: {},
		};
	}

	registerPlayerListener() {
		socket.on('players', (players) => {
			this.setState({players: players});
		});
	}

	addPlayer() {
		this.setState({
			editOpen: true,
			editPlayer: {},
		});
	}

	editPlayer(player) {
		console.log('edit Player!!', player);
		this.setState({
			editOpen: true,
			editPlayer: Object.assign({}, player),
		});
	}

	deletePlayer(player) {
		this.setState({editOpen: false});
		socket.emit('delete_player', player._id);
	}

	handlePlayerChange(event) {
		console.log('handling player change', event);
		const player = Object.assign({}, this.state.editPlayer, {[event.target.name]: event.target.value})
		this.setState({editPlayer: player});
	}

	handleSubmit(event) {
		event.preventDefault();
		this.setState({editOpen: false});
		if (this.state.editPlayer.hasOwnProperty('_id')) {
			socket.emit('update_player', this.state.editPlayer);
		} else {
			socket.emit('add_player', this.state.editPlayer);
		}
	}

	componentDidMount() {
		return Promise.resolve()
		.then(() => this.registerPlayerListener())
		.then(() => socket.emit('get_players'));
	}

	numberWithCommas(x) {
	    var parts = x.toString().split(".");
	    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return parts.join(".");
	}

	render() {
		const {classes} = this.props;

		const players = this.state.players.sort((a, b) => {
			return b.winnings - a.winnings;
		}).map((player, index) => {
			return (
				<TableRow key={player._id} hover={true} onClick={() => this.editPlayer(player)}>
					<TableCell padding='checkbox'>{index+1}</TableCell>
					<TableCell> {player.name}</TableCell>
					<TableCell> ${this.numberWithCommas(player.winnings)}</TableCell>
				</TableRow>
			);
		});

		return (
			<div>
				<Paper className="Leaderboard">
				    <Typography className={classes.title} variant="h4">
  						<Icon className={classes.icon}>stars</Icon>
  						Leaderboard
  					</Typography>					
      				<Table>
						<TableHead>
							<TableRow>
								<TableCell padding='checkbox'></TableCell>
								<TableCell> Name </TableCell>
								<TableCell> Winnings </TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{players}
						</TableBody>
					</Table>
					<Button
			            type="submit"
			            fullWidth
			            variant="contained"
			            onClick={() => this.addPlayer()}
			        >
			         Add Player + 
			        </Button>
				</Paper>
				<EditPlayerModal 
					open={this.state.editOpen} 
					player={this.state.editPlayer} 
					onChange={(e) => this.handlePlayerChange(e)}
					onSubmit={(e) => this.handleSubmit(e)}
					onDelete={() => this.deletePlayer(this.state.editPlayer)}
					onClose={() => this.setState({editOpen: false})}
				/>
			</div>
		);
	}
}

export default withStyles(styles)(Leaderboard);