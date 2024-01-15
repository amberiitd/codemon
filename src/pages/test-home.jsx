import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTestContext } from "./test";
import { executeAllTests } from "../api/execute";
import ResultDialogue from "../components/ResultDialogue";
import { useContext, useEffect, useState } from "react";
import ConfirmCancel from "../components/ConfirmCancel";
import { AppContext } from "../contexts/app";
import { createTestResult } from "../api/backend";

const TestHome = () => {
	const { problems, submission, setSubmission, savedCount } = useTestContext();
	const { cancelModal, setCancelModal } = useContext(AppContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (problems.length == 0) navigate("/app");
	}, [problems]);
	if (problems.length == 0) return null;

	return (
		<Grid container paddingTop={5} paddingBottom={1} display={"flex"} justifyContent={"center"}>
			<Grid item xs={10}>
				<TableContainer component={Paper} sx={{ marginBottom: 5 }}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Questions</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Action</TableCell>
								<TableCell>Status</TableCell>
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
									<TableCell>Coding</TableCell>
									<TableCell>
										<Button
											component={Link}
											to={`${index}`}
											variant="contained"
											size="small"
											disabled={savedCount < index}
										>
											{row.saved ? "Modify" : "Solve"}
										</Button>
									</TableCell>
									<TableCell>{row.saved ? "Saved" : "Not Attempted"}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Box display={"flex"} xs={12} flexDirection={"row-reverse"}>
					<Box>
						<Button
							variant="contained"
							size="small"
							color="error"
							onClick={() => setCancelModal(true)}
							sx={{ marginRight: 1 }}
						>
							Cancel Test
						</Button>
						<Button
							variant="contained"
							size="small"
							disabled={savedCount < problems.length || submission.status === "loading"}
							onClick={() => {
								setSubmission({
									status: "loading",
								});
								Promise.all(problems.map((p) => executeAllTests(p)))
									.then((results) => {
										const result = getReport(problems, results);
										setSubmission({ status: "submitted", result });
										createTestResult({ problems: problems.map((p) => p.id), results: result });
									})
									.catch((error) => {
										console.error(error);
										setSubmission({
											status: "error",
										});
									});
							}}
						>
							{submission.status === "loading" && <CircularProgress size={10} sx={{ marginRight: 1 }} />}
							Submit
						</Button>
					</Box>

					<Alert severity="info" sx={{ marginRight: "auto", paddingTop: 0, paddingBottom: 0 }}>
						Test can be submitted after all the solutions have been saved.
					</Alert>
				</Box>
			</Grid>
			<ResultDialogue open={submission.status === "submitted"} problems={problems} submission={submission}/>
		</Grid>
	);
};

export default TestHome;

function getReport(problems, results) {
	console.log("problems", problems);
	console.log("results", results);
	const report = [];
	for (let i = 0; i < problems.length; i++) {
		let passed = 0;
		for (let j = 0; j < problems[i].testCases.length; j++) {
			if (problems[i].testCases[j].output === results[i][j].output) passed += 1;
		}
		report.push({ total: problems[i].testCases.length, passed });
	}

	return report;
}

const ResultModal = () => {};
