import { useTheme } from "@emotion/react";
import { Editor } from "@monaco-editor/react";
import { Box, Button, ButtonGroup, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTestContext } from "../pages/test";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../contexts/app";
import usePageQuery from "../hooks/usePageQuery";
import { execute, getToken } from "../api/execute";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { verifyResult } from "../util/general";
import TestRunTab from "./TestRunTab";
import { languages } from "../constants/general";

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

	const socketClient = useMemo(
		() =>
			window.webstomp.over(new window.SockJS(`${process.env.REACT_APP_JBOOT_BASE_URL}/stomp`), {
				heartbeat: false,
				debug: true,
			}),
		[]
	);
	const [apiToken, setApiToken] = useState();
	const sendRunRequest = useCallback(() => {
		let data = JSON.stringify({
			script: problem.editor[problem.language],
			language: languages[problem.language].codeName,
			versionIndex: languages[problem.language].version,
		});

		if (!socketClient || socketClient.status === "CONNECTED") return;

		socketClient.send("/app/execute-ws-api-token", data, {
			message_type: "execute",
			token: apiToken,
		});
	}, [socketClient, problem, apiToken]);

	useEffect(() => {
		if (!socketClient || socketClient.status === "CONNECTED") return;
		const onWsConnection = () => {
			socketClient.subscribe("/user/queue/execute-i", (message) => {
				let msgId = message.headers["message-id"];
				let msgSeq = parseInt(msgId.substring(msgId.lastIndexOf("-") + 1));
				let statusCode = parseInt(message.headers.statusCode);
				console.log("message", message);
			});
		};
		const onWsConnectionFailed = (e) => {
			console.log("connection failed");
			console.log(e);
		};
		socketClient.connect({}, onWsConnection, onWsConnectionFailed);
		return () => {
			if (socketClient.status === "CONNECTED") socketClient.disconnect();
		};
	}, [socketClient]);

	useEffect(() => {
		if (!apiToken) {
			getToken()
				.then((data) => {
					console.log(data);
					setApiToken(data);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, []);

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
							// runQuery.trigger(
							// 	problem.editor[problem.language],
							// 	problem.testCases[0].input,
							// 	problem.language,
							// 	problem.testCases[0].output
							// );
							sendRunRequest();
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
