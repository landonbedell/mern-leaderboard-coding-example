import React from 'react';
import Flag from "react-world-flags";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = (theme) => ({
	flag: {
		marginRight: '10px'
	}
});

function EditPlayerModal(props) {
	const {classes} = props;
	const isNew = !props.player.hasOwnProperty('_id'); 

	const flags = [
		{code: 'au', name:'Australia'},
		{code: 'ca', name: 'Canada'},
		{code: 'cn', name: 'China'},
		{code: 'us', name: 'USA'}
	];

	const flagElems = flags.map((flag) => {
		return (
			<MenuItem key={flag.code} value={flag.code}>
				<Flag className={classes.flag} height="16" code={flag.code}/> {flag.name}
			</MenuItem>
		);
	})

	return (
		<Dialog className={classes.dialog} open={props.open} aria-labelledby="form-dialog-title" onClose={props.onClose} fullWidth>
			<DialogTitle id="form-dialog-title">{isNew ? 'Add Player': 'Edit Player'}</DialogTitle>
			<DialogContent>
				<form onSubmit={props.onSubmit}>
					<FormControl margin="dense" required fullWidth>
						<InputLabel htmlFor="name"> Player Name </InputLabel>
						<Input 
							id="name" 
							name="name" 
							autoFocus 
							value={props.player.name} 
							onChange={props.onChange}
						/>
					</FormControl>
					<FormControl margin="dense" required fullWidth>
						<InputLabel htmlFor="number">Winnings</InputLabel>
						<Input 
							id="winnings" 
							type="number" 
							name="winnings" 
							value={props.player.winnings} 
							onChange={props.onChange}
							startAdornment={<InputAdornment>$</InputAdornment>}
						/>
					</FormControl>
					<FormControl margin="dense" fullWidth>
						<InputLabel htmlFor="country">Country</InputLabel>
						<Select
							name="country"
							value={props.player.country}
							onChange={props.onChange}
						>
							<MenuItem value={null}>
				             	<em>None</em>
				            </MenuItem>
							{flagElems}
						</Select>
					</FormControl>
					<DialogActions className={classes.buttons}>
						<Button
				            type="submit"
				            fullWidth
				            variant="contained"
				            color="primary"
				        >
				            Save
			          	</Button>
			          	{
			          		!isNew && 
			          		<Button
				          		className={classes.delete}
					            fullWidth
					            variant="contained"
					            color="secondary"
					            onClick={props.onDelete}
				        	>
					            Delete
				          	</Button>
			          	}
			          	
					</DialogActions>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default withStyles(styles)(EditPlayerModal)