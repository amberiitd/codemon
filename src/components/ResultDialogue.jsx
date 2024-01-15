import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { toast } from "react-toastify";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useTestContext } from "../pages/test";
import { Link } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ResultDialogue() {
	const { problems, submission } = useTestContext();

  if (submission.status !== 'submitted') return null;
	return (
		<React.Fragment>
			<Dialog
				open={submission.status === 'submitted'}
				TransitionComponent={Transition}
				keepMounted
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>{"Submission Result"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<TableContainer component={Paper} sx={{ marginBottom: 5 }}>
							<Table sx={{ minWidth: 650 }}>
								<TableHead>
									<TableRow>
										<TableCell>Questions</TableCell>
										<TableCell>Test Cases Passed</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{problems.map((row, index) => (
										<TableRow
											key={`row-${index}`}
											sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{index + 1}
												{". "}
												{row.title}
											</TableCell>
											<TableCell>
												{submission.result[index].passed}/{submission.result[index].total}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button component={Link} to="/app/test" variant="contained" size="small">
						Back to Home
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
