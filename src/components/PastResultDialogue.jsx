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
import { AppContext } from "../contexts/app";
import { problemsData } from "../pages/home";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function PastResultDialogue({ problemIds = [], results = [], open, onClose }) {
	const { testProblems } = React.useContext(AppContext);
	const problems = React.useMemo(
		() => problemIds.map((pid) => problemsData.find((t) => t.id === pid)).filter(p => Boolean(p)),
		[problemIds]
	);
	return (
		<React.Fragment>
			<Dialog
				open={open}
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
											key={`result-row-${index}`}
											sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{index + 1}
												{". "}
												{row.title}
											</TableCell>
											<TableCell>
												{results[index].passed}/{results[index].total}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} variant="contained">Close</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
