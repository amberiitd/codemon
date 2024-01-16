import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../contexts/app";

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

export default Description;