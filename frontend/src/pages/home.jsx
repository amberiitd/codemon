import { Alert, Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/app";
import usePageQuery from "../hooks/usePageQuery";
import { getTestResult } from "../api/backend";
import PastResultDialogue from "../components/PastResultDialogue";
import PastResult from "../components/PastResult";
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
							setTestProblems(chooseProbelms(problemsData, 5));
							navigate("/app/test/problems");
						}}
					>
						Take New Test
					</Button>
				</Grid>
				{(pastResults || []).map((res, index) => (
					<Grid item key={`res-${index}`}>
						<PastResult result={res} index={index} onSelect={() => setSelectedResult(res)} />
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
