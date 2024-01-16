import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Link, useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmCancel({ open, onClose, to = "/app" }) {
	const navigate = useNavigate();
	return (
		<React.Fragment>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={onClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>{"Are you sure?"}</DialogTitle>
				<DialogContent>
					<DialogContentText>This action will cancel your Test.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						component={Link}
						to={to}
						variant="contained"
						size="small"
						color={"error"}
						onClick={(e) => {
							e.preventDefault();
							navigate(to);
              onClose();
						}}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
