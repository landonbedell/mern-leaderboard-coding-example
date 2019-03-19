import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import Flag from "react-world-flags";
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
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import EditPlayerModal from './EditPlayerModal';

const socket = openSocket('http://localhost:5000');

const styles = (theme) => ({
	title: {
		paddingTop: '20px'
	},
	avatar: {
		marginRight: '10px',
		width: '30px',
		height: '30px',
	},
	flag: {
		marginRight: '10px'
	},
  	root: {
	    width: '100%',
	    marginTop: theme.spacing.unit * 3,
	    overflowX: 'auto',
	},
  	table: {
    	minWidth: 500,
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

	componentDidMount() {
		return Promise.resolve()
		.then(() => this.registerPlayerListener())
		.then(() => socket.emit('get_players'));
	}

	registerPlayerListener() {
		socket.on('players', (players) => {
			this.setState({players: players});
		});
	}

	addPlayer() {
		this.setState({
			editOpen: true,
			editPlayer: {
				name: '',
				winnings: '',
				country: ''
			},
		});
	}

	editPlayer(player) {
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

	numberWithCommas(x) {
	    var parts = x.toString().split(".");
	    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return parts.join(".");
	}

	render() {
		const {classes} = this.props;

		const hash = (b64) => parseInt('0x'+b64) % 5;

		const players = this.state.players.sort((a, b) => {
			return b.winnings - a.winnings;
		}).map((player, index) => {
			return (
				<TableRow key={player._id} hover={true} onClick={() => this.editPlayer(player)}>
					<TableCell padding='checkbox'>{index+1}</TableCell>
					<TableCell> 
						<Grid container justify="flex-start" alignItems="center">
							{/* 
								For now just using static images for Avatars.
								TODO: Add support for image upload during player creation
							*/} 
							<Avatar 
								className={classes.avatar}
								src={`${process.env.PUBLIC_URL}/res/player_icons/player${hash(player._id)}.jpg`}
							></Avatar>
							<div>{player.name}</div>
						</Grid>
					</TableCell>
					<TableCell> ${this.numberWithCommas(player.winnings)}</TableCell>
					<TableCell>
						{player.country && <Flag className={classes.flag} height="16" code={player.country}/>}
					</TableCell>
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
  					<div className={classes.root}>
	      				<Table className={classes.table}>
							<TableHead>
								<TableRow>
									<TableCell padding='checkbox'></TableCell>
									<TableCell> Player </TableCell>
									<TableCell> Winnings </TableCell>
									<TableCell> Country </TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{players}
							</TableBody>
						</Table>
  					</div>				
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