import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

function EditPlayerModal(props) {
	return (
		<Dialog open={props.open} aria-labelledby="form-dialog-title" onClose={props.onClose}>
			<DialogTitle id="form-dialog-title">{props.player.hasOwnProperty('_id') ? 'Edit Player': 'Add Player'}</DialogTitle>
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
					<Button
			            type="submit"
			            fullWidth
			            variant="contained"
			            color="primary"
			        >
			            Save
		          	</Button>
		          	<Button
			            fullWidth
			            variant="contained"
			            color="primary"
			        >
			            Delete
		          	</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default EditPlayerModal