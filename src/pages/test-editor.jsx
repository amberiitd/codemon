import { useTheme } from "@emotion/react";
import { Editor } from "@monaco-editor/react";
import { Box, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTestContext } from "./test";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { tokens } from "../contexts/theme";
import { languages } from "../constants/general";
import { AppContext } from "../contexts/app";
import Description from "../components/Description";
import BottomPanel from "../components/BottomPanel";
import SideMenu from "../components/SideMenu";
import LanguageSelector from "../components/LanguageSelector";

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
		<Grid container height={"100%"} spacing={2}>
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
					borderRadius={1}
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
