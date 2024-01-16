import { useTheme } from "@emotion/react";
import { Editor } from "@monaco-editor/react";
import {
	Box,
	Button,
	ButtonGroup,
	CircularProgress,
	Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTestContext } from "../pages/test";
import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../contexts/app";
import usePageQuery from "../hooks/usePageQuery";
import { execute } from "../api/execute";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { verifyResult } from "../util/general";
import TestRunTab from "./TestRunTab";

const BottomPanel = () => {
	const { problemId } = useParams();
	const { problems, dispatchProblemAction, savedCount, setSavedCount } = useTestContext();
	const problem = useMemo(() => ({ ...problems[parseInt(problemId)] }), [problemId, problems]);
	const correct = useMemo(() => verifyResult(problem.testCases[0].output, problem.runResults[0]?.output), [problem]);

	const { bigScreen } = useContext(AppContext);
	const navigate = useNavigate();
	const runQuery = usePageQuery(execute, { preventInitialTrigger: true });

	useEffect(() => {
		if (runQuery.data) {
			console.log(runQuery.data);
			dispatchProblemAction({
				type: "setRun",
				data: {
					problemId: parseInt(problemId),
					runResults: [runQuery.data],
				},
			});
		}
	}, [runQuery.data]);

	return (
		<Box height={"30%"} overflow={"auto"} paddingBottom={0} paddingTop={2}>
			<Box
				display={"flex"}
				flexDirection={"row-reverse"}
				padding={!bigScreen && 2}
				paddingTop={0}
				paddingBottom={0}
				paddingRight={2}
			>
				<ButtonGroup variant="contained">
					<Button
						variant="outlined"
						size="small"
						onClick={() => {
							runQuery.trigger(
								problem.editor[problem.language],
								problem.testCases[0].input,
								problem.language,
								problem.testCases[0].output
							);
						}}
					>
						Run
					</Button>
					<Button
						variant="contained"
						size="small"
						onClick={() => {
							dispatchProblemAction({
								type: "setSaved",
								data: { problemId: parseInt(problemId) },
							});
							navigate("/app/test/problems");
							setSavedCount((c) => c + 1);
						}}
					>
						Save
					</Button>
				</ButtonGroup>
				{(problem.run || runQuery.isFetching) && (
					<Box marginRight={"auto"}>
						<Typography variant="h4" display={"inline"}>
							Test
						</Typography>
						{runQuery.isFetching ? (
							<CircularProgress size={20} sx={{ marginLeft: 1 }} />
						) : problem.runResults && correct ? (
							<TaskAltIcon fontSize={"medium"} sx={{ marginLeft: 1 }} color="success" />
						) : (
							<ErrorOutlineIcon fontSize={"medium"} sx={{ marginLeft: 1 }} color="error" />
						)}
					</Box>
				)}
			</Box>
			{problem.run && (
				<TestRunTab
					problem={problems[parseInt(problemId)]}
					result={problem.runResults && problem.runResults[0]}
				/>
			)}
		</Box>
	);
};

export default BottomPanel;