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
import { useCallback, useEffect, useMemo } from "react";
import { tokens } from "../contexts/theme";
import MenuIcon from "@mui/icons-material/Menu";
import { languages } from "../constants/general";

const TestEditor = () => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const navigate = useNavigate();
	const { problemId } = useParams();
	const { problems, dispatchProblemAction, savedCount, setSavedCount } = useTestContext();

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
		<Grid container height={"100%"} paddingTop={2}>
			<Grid item xs={1} borderRight={1} borderColor={colors.primary[300]} paddingLeft={3} paddingRight={3}>
				<SideMenu />
			</Grid>
			<Grid height={"100%"} item xs={3} overflow={"auto"}>
				<Description problem={problems[parseInt(problemId)]} id={parseInt(problemId) + 1} />
			</Grid>
			<Grid item xs={8} height={"100%"}>
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
						defaultValue={problems[parseInt(problemId)].editor}
						onChange={(e) =>
							dispatchProblemAction({
								type: "setEditor",
								data: { problemId: parseInt(problemId), editor: e },
							})
						}
					/>
				</Box>
				<Box height={"30%"} overflow={"auto"} padding={2} paddingBottom={0}>
					<Box display={"flex"} flexDirection={"row-reverse"}>
						<ButtonGroup variant="contained">
							<Button variant="outlined" size="small">
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
                  setSavedCount(c => c+1)
								}}
							>
								Save
							</Button>
						</ButtonGroup>
						<Box marginRight={"auto"}>
							<Typography variant="h4">Test</Typography>
						</Box>
					</Box>
					<TestRunTab problem={problems[parseInt(problemId)]} />
				</Box>
			</Grid>
		</Grid>
	);
};

export default TestEditor;

const Description = ({ problem, id }) => {
	return (
		<Box height={"100%"} className="description" paddingLeft={2} paddingRight={2} overflow={"auto"}>
			<Typography variant="h3">
				{id}
				{". "}
				{problem.title}
			</Typography>
			<div className="Container" dangerouslySetInnerHTML={{ __html: problem.description }}></div>
		</Box>
	);
};

const TestRunTab = ({ problem, result }) => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);

	return (
		<Box>
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
	const { problemId } = useParams();

	return (
		<>
			<Typography paddingLeft={1} marginBottom={2}>
				All
			</Typography>
			<IconButton LinkComponent={Link} to="/app/test/problems">
				<MenuIcon />
			</IconButton>
			<Stepper activeStep={savedCount} orientation="vertical" sx={{ width: 50, padding: 1 }}>
				{problems.map((step, index) => (
					<Step key={index}>
						<StepLabel></StepLabel>
					</Step>
				))}
			</Stepper>
		</>
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
