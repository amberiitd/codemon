import {
	Box,
	IconButton,
	Step,
	StepLabel,
	Stepper,
	Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTestContext } from "../pages/test";
import { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppContext } from "../contexts/app";

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

export default SideMenu;