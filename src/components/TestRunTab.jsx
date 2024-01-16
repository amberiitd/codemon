import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { useContext, useMemo } from "react";
import { tokens } from "../contexts/theme";
import { AppContext } from "../contexts/app";

const TestRunTab = ({ problem, result }) => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { bigScreen } = useContext(AppContext);

	return (
		<Box padding={!bigScreen && 2} paddingRight={2}>
			<pre>
				<Snippet label={"Input"} data={problem.testCases[0].input} />
				<Snippet label={"Output"} data={result?.output} />
				<Snippet label={"Expected"} data={problem.testCases[0].output} />
			</pre>
		</Box>
	);
};

export default TestRunTab;


const Snippet = ({ label, data }) => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	return (
		<>
			<string>{label}:</string>
			<Box
				border={1}
				borderColor={colors.primary[300]}
				borderRadius={1}
				marginBottom={2}
				paddingLeft={1}
				paddingRight={1}
				minHeight={40}
				sx={{ backgroundColor: colors.primary[200] }}
			>
				<pre>{data}</pre>
			</Box>
		</>
	);
};
