import { Alert, Button, Card, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/app";
import { useTheme } from "@emotion/react";
import { tokens } from "../contexts/theme";
import usePageQuery from "../hooks/usePageQuery";
import { getTestResult } from "../api/backend";
import moment from "moment";
import PastResultDialogue from "../components/PastResultDialogue";
export const problemsData = require("../problems.json");

const HomePage = () => {
	const { setTestProblems } = useContext(AppContext);
	const { data: pastResults } = usePageQuery(getTestResult, { initialParams: [] });
	const [selectedResult, setSelectedResult] = useState();
	const navigate = useNavigate();
	return (
		<Box marginTop={5} display={"flex"} justifyContent={"center"} padding={2}>
			<Grid container spacing={2} maxWidth={1000}>
				<Grid item xs={12}>
					<Button
						component={Link}
						to="/app/test/problems"
						size="small"
						variant="contained"
						onClick={(e) => {
							e.preventDefault();
							setTestProblems(chooseProbelms(problemsData, 2));
							navigate("/app/test/problems");
						}}
					>
						Take New Test
					</Button>
				</Grid>
				{(pastResults || []).map((res, index) => (
					<Grid item key={`res-${index}`}>
						<PastResults result={res} index={index} onSelect={() => setSelectedResult(res)} />
					</Grid>
				))}
				{(pastResults || []).length == 0 && (
					<Grid item xs={12}>
						<Alert severity="info" sx={{ marginRight: "auto", paddingTop: 0, paddingBottom: 0 }}>
							You have not taken any test yet. Please take a test to track your progress.
						</Alert>
					</Grid>
				)}
			</Grid>
			<PastResultDialogue
				open={!!selectedResult}
				onClose={() => setSelectedResult(null)}
				problemIds={selectedResult?.problems}
				results={selectedResult?.results}
			/>
		</Box>
	);
};

export default HomePage;

function chooseProbelms(problemSet, k) {
	var arr = [];
	while (arr.length < k) {
		var r = Math.floor(Math.random() * problemSet.length);
		if (arr.findIndex((p) => p.id === problemSet[r].id) === -1) arr.push(problemSet[r]);
	}

	return arr;
}

const PastResults = ({ index, result, onSelect }) => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);

	return (
		<Card
			sx={{
				position: "relative",
				height: "12rem",
				width: "16rem",
				padding: 2,
				border: 2,
				borderRadius: 2,
				borderColor: colors.primary[400],
				backgroundColor: "transparent",
				"&:hover": {
					boxShadow: 10,
					borderColor: colors.primary[600],
				},
				cursor: "pointer",
				// background: `linear-gradient(${colors.primary[100]}, ${colors.bg[100]})`,,
			}}
			onClick={onSelect}
		>
			<Typography variant="h1" textAlign={"center"} marginBottom={1}>
				{index + 1}
			</Typography>
			<Typography>
				<span style={{ fontWeight: 600 }}>Problem Count:</span> {result.problems.length}
			</Typography>
			<Typography>
				<span style={{ fontWeight: 600 }}>Solved Count:</span> {0}
			</Typography>
			<Typography>
				<span style={{ fontWeight: 600 }}>Submitted At:</span>{" "}
				{moment.unix(result.createdAt).format("DD MMM YYYY, hh:mm A")}
			</Typography>
		</Card>
	);
};
