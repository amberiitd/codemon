import { useTheme } from "@emotion/react";
import { Typography, Box } from "@mui/material";
import { FC } from "react";
import { tokens } from "../contexts/theme";

const Header = ({
	title,
	subtitle,
}) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box mb="30px">
			<Typography variant="h2" fontWeight="bold" sx={{ m: "0 0 5px 0" }}>
				{title}
			</Typography>
			<Typography variant="h5">{subtitle}</Typography>
		</Box>
	);
};

export default Header;
