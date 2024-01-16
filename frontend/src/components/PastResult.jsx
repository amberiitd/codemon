
import { Card, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTheme } from "@emotion/react";
import { tokens } from "../contexts/theme";
import moment from "moment";

const PastResult = ({ index, result, onSelect }) => {
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

export default PastResult;