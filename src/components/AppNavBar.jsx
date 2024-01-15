import { Button, IconButton, Stack, Typography, colors } from "@mui/material";
import Box from "@mui/material/Box";
import { useContext, useMemo } from "react";
import { ColorModeContext, tokens } from "../contexts/theme";
import { useTheme } from "@emotion/react";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import { AppContext } from "../contexts/app";

const AppNavBar = ({ profile }) => {
	return (
		<Box display={"flex"} p={2} alignItems={"center"}>
			<AppIcon />
			<NavLinks />
			<Stack marginLeft={"auto"} spacing={2} direction={"row"}>
				<ThemeToggler />
				{profile && <UserDropdown />}
			</Stack>
		</Box>
	);
};

export default AppNavBar;

const NavLinks = () => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const location = useLocation();
	const { setCancelModal } = useContext(AppContext);
	const navigate = useNavigate();

	const style = {
		textDecoration: "none",
		fontWeight: 600,
		color: theme.palette.primary.main,
	};
	return (
		<Stack direction={"row"} spacing={2} marginLeft={3}>
			<Link
				to="/app/home"
				style={{
					...style,
					color: location.pathname === "/app/home" ? colors.green[100] : "unset",
				}}
				onClick={(e) => {
					e.preventDefault();

					if (location.pathname.startsWith("/app/test")) setCancelModal(true);
					else navigate();
				}}
			>
				Home
			</Link>
			{/* <Link
				to="/share"
				style={{
					...style,
					color: path1 === "share" ? colors.green[100] : "unset",
				}}
			>
				Share
			</Link> */}
		</Stack>
	);
};

const AppIcon = () => {
	const { setCancelModal } = useContext(AppContext);
	const navigate = useNavigate();
  const location = useLocation();

	return (
		<Link
			to="/home"
			onClick={(e) => {
				e.preventDefault();

				if (location.pathname.startsWith("/app/test")) setCancelModal(true);
				else navigate();
			}}
		>
			<img src={`${process.env.PUBLIC_URL}/assets/logo2.png`} height="30px" width="30px" />
		</Link>
	);
};

const ThemeToggler = () => {
	const colorMode = useContext(ColorModeContext);
	const theme = useTheme();
	return (
		<IconButton onClick={colorMode.toggleColorMode} size="small">
			{theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
		</IconButton>
	);
};
