import { useTheme } from "@emotion/react";
import { Grow, Typography } from "@mui/material";
import { useMemo } from "react";
import { tokens } from "../contexts/theme";

const GradientText = ({
	children,
	variant = "h4",
	style = {},
	start = 10,
	end = 100,
	reverse,
	grow,
}) => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const textNode = (
		<Typography
			textAlign={"center"}
			// variant={variant as any}
			sx={{
				...style,
				background: `-webkit-linear-gradient(${
					reverse ? 200 : 20
				}deg, ${colors.primary[900]} ${start}%, ${
					colors.bg[100]
				} ${end}%)`,
				WebkitBackgroundClip: "text",
				WebkitTextFillColor: "transparent",
			}}
		>
			{children}
		</Typography>
	);
	return grow ? (
		<Grow in={true} timeout={1000}>
			{textNode}
		</Grow>
	) : (
		textNode
	);
};

export default GradientText;
