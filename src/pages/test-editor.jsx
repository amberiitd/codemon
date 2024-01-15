import { useTheme } from "@emotion/react";
import { Editor } from "@monaco-editor/react";
import {
	Box,
	Button,
	ButtonGroup,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTestContext } from "./test";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { tokens } from "../contexts/theme";
import MenuIcon from "@mui/icons-material/Menu";
import { languages } from "../constants/general";
import { AppContext } from "../contexts/app";
import usePageQuery from "../hooks/usePageQuery";
import { execute } from "../api/execute";

const TestEditor = () => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const navigate = useNavigate();
	const { problemId } = useParams();
	const { problems, dispatchProblemAction, savedCount, setSavedCount } = useTestContext();
	const { bigScreen } = useContext(AppContext);

	const onLanguageChange = useCallback(
		(lang) => {
			dispatchProblemAction({
				type: "setLanguage",
				data: {
					problemId: parseInt(problemId),
					language: lang,
				},
			});
		},
		[problemId]
	);

	useEffect(() => {
		if (parseInt(problemId) >= problems.length || savedCount < parseInt(problemId)) {
			navigate("/app/test/problems");
		}
	}, [problemId]);

	if (parseInt(problemId) >= problems.length || savedCount < parseInt(problemId)) {
		return null;
	}

	return (
		<Grid container height={"100%"} paddingTop={2} spacing={2}>
			<Grid item xs={bigScreen ? 1 : 12} borderRight={1} borderColor={colors.primary[300]}>
				<SideMenu />
			</Grid>
			<Grid height={"100%"} item xs={bigScreen ? 3 : 12} overflow={"auto"}>
				<Description problem={problems[parseInt(problemId)]} id={parseInt(problemId) + 1} />
			</Grid>
			<Grid item xs={bigScreen ? 8 : 12} height={"100%"}>
				<Box display={"flex"} flexDirection={"row-reverse"}>
					<LanguageSelector
						onChange={onLanguageChange}
						value={problems[parseInt(problemId)].language || "javascript"}
					/>
				</Box>
				<Box
					height={"calc(70% - 35px)"}
					border={1}
					borderColor={colors.primary[400]}
					borderRadius={2}
					padding={"1px"}
					overflow={"hidden"}
				>
					<Editor
						language={problems[parseInt(problemId)].language}
						theme={`vs-${theme.palette.mode}`}
						value={
							problems[parseInt(problemId)].editor[problems[parseInt(problemId)].language] ||
							languages[problems[parseInt(problemId)].language].defaultEditor
						}
						onChange={(e) =>
							dispatchProblemAction({
								type: "setEditor",
								data: {
									problemId: parseInt(problemId),
									editor: e,
									language: problems[parseInt(problemId)].language,
								},
							})
						}
					/>
				</Box>
				<BottomPanel />
			</Grid>
		</Grid>
	);
};

export default TestEditor;

const Description = ({ problem, id }) => {
	const { bigScreen } = useContext(AppContext);

	return (
		<Box height={"100%"} className="description" overflow={"auto"} padding={bigScreen ? 0 : 2}>
			<Typography variant="h3">
				{id}
				{". "}
				{problem.title}
			</Typography>
			<div className="Container" dangerouslySetInnerHTML={{ __html: problem.description }}></div>
		</Box>
	);
};

const BottomPanel = () => {
	const { problemId } = useParams();
	const { problems, dispatchProblemAction, savedCount, setSavedCount } = useTestContext();
	const problem = useMemo(() => problems[parseInt(problemId)], [problemId]);
	const { bigScreen } = useContext(AppContext);
	const navigate = useNavigate();
	const runQuery = usePageQuery(execute, { preventInitialTrigger: true });

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
							runQuery
								.trigger(
									problem.editor[problem.language],
									problem.testCases[0].input,
									problem.language,
									problem.testCases[0].output
								)
								.then((res) => {
									dispatchProblemAction({
										type: "setRun",
										data: {
											problemId: parseInt(problemId),
											runResults: res,
										},
									});
								});
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
				{problem.run && (
					<Box marginRight={"auto"}>
						<Typography variant="h4">Test</Typography>
					</Box>
				)}
			</Box>
			{problem.run && <TestRunTab problem={problems[parseInt(problemId)]} />}
		</Box>
	);
};

const TestRunTab = ({ problem, result }) => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { bigScreen } = useContext(AppContext);

	return (
		<Box padding={!bigScreen && 2} paddingRight={2}>
			<pre>
				<Snippet label={"Input"} data={problem.testCases[0].input} />
				<Snippet label={"Output"} data={result} />
				<Snippet label={"Expected"} data={problem.testCases[0].output} />
			</pre>
		</Box>
	);
};

const SideMenu = () => {
	const { problems, savedCount } = useTestContext();
	const { bigScreen } = useContext(AppContext);

	return (
		<Box
			paddingLeft={!bigScreen && 2}
			display={"flex"}
			flexDirection={bigScreen ? "column" : "row"}
			alignItems={"center"}
		>
			<Typography>All</Typography>
			<IconButton LinkComponent={Link} to="/app/test/problems">
				<MenuIcon />
			</IconButton>
			<Stepper
				activeStep={savedCount}
				orientation={bigScreen ? "vertical" : "horizontal"}
				sx={{ minWidth: bigScreen ? "unset" : "200px", width: bigScreen ? "21px" : "unset", padding: 0 }}
			>
				{problems.map((step, index) => (
					<Step key={index}>
						<StepLabel></StepLabel>
					</Step>
				))}
			</Stepper>
		</Box>
	);
};

const Snippet = ({ label, data }) => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);

	return (
		<>
			<string>{label}:</string>
			<Box border={1} borderColor={colors.primary[300]} borderRadius={2} marginBottom={2} padding={1}>
				<pre>{data}</pre>
			</Box>
		</>
	);
};

const LanguageSelector = ({ onChange, value }) => {
	return (
		<FormControl>
			<InputLabel id="language-label">Language</InputLabel>
			<Select
				labelId="language-label"
				id="language-select"
				value={value}
				label="Language"
				onChange={(e) => onChange(e.target.value)}
				size="small"
			>
				{Object.entries(languages).map(([k, l]) => (
					<MenuItem key={l.codeName} value={k}>
						{l.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};
