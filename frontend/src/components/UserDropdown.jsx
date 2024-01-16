// ** React Imports
import { useState, Fragment, useContext, FC, useMemo } from "react";

// ** Next Import
// ** MUI Imports
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
// ** Icon Imports

// ** Context
import Link from "@mui/material/Link";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import TextCopy from "./TextCopy";
import { tokens } from "../contexts/theme";
import { AuthContext } from "../contexts/auth";
import { startCase, toUpper } from "lodash";

// ** Styled Components
const BadgeContentSpan = styled("span")(({ theme }) => ({
	width: 8,
	height: 8,
	borderRadius: "50%",
	backgroundColor: theme.palette.success.main,
	boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const UserDropdown = (props) => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const navigate = useNavigate();
	const { logout, auth } = useContext(AuthContext);
	// ** States
	const [anchorEl, setAnchorEl] = useState(null);
	const handleDropdownOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleDropdownClose = (url) => {
		if (url) {
			navigate(url);
		}
		setAnchorEl(null);
	};

	const styles = {
		py: 2,
		px: 4,
		width: "100%",
		display: "flex",
		alignItems: "center",
		color: "text.primary",
		textDecoration: "none",
		"& svg": {
			mr: 2,
			fontSize: "1.375rem",
			color: "text.primary",
		},
	};

	return (
		<Fragment>
			<Badge
				overlap="circular"
				onClick={handleDropdownOpen}
				sx={{ ml: 1, cursor: "pointer" }}
				badgeContent={<BadgeContentSpan />}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
			>
				<Avatar
					alt={startCase(auth.user?.username || "Profile")}
					onClick={handleDropdownOpen}
					sx={{
						width: 35,
						height: 35,
						border: `1px solid ${colors.bg[100]}`,
					}}
					src={`${process.env.PUBLIC_URL}/assets/user-icon.png`}
				/>
			</Badge>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => handleDropdownClose(null)}
				sx={{
					"& .MuiMenu-paper": {
						width: 230,
						mt: 1,
					},
				}}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
			>
				<Box sx={{ pt: 2, pb: 3, px: 2 }}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Avatar
							alt={startCase(auth.user?.username || "Profile")}
							onClick={handleDropdownOpen}
							sx={{
								width: 35,
								height: 35,
								// border: `1px solid ${colors.primary[400]}`,
							}}
							src={`${process.env.PUBLIC_URL}/assets/user-icon.png`}
						/>
						<Box sx={{ width: "calc(100% - 39px)", ml: 1 }}>
							<Box display="flex">
								<Typography className="text-cut" fontSize="small">
									{auth.user?.username}
								</Typography>
								<TextCopy text={"Customer Name"} />
							</Box>
							<Typography
								variant="body2"
								sx={{
									fontSize: "0.8rem",
									color: "text.disabled",
								}}
							>
								{auth.user?.role}
							</Typography>
						</Box>
					</Box>
				</Box>
				<Divider sx={{ mt: "0 !important" }} />
				{/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='mdi:account-outline' />
            Profile
          </Box>
        </MenuItem> */}
				{/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Link sx={styles} href={'/authenticated/settings'}>
            <Icon icon='mdi:cog-outline' />
            Settings
          </Link>
        </MenuItem> */}
				{/* <Divider /> */}
				<MenuItem
					onClick={() => logout()}
					sx={{
						py: 2,
						"& svg": {
							mr: 2,
							fontSize: "1.375rem",
							color: "text.primary",
						},
					}}
				>
					<LogoutIcon />
					Logout
				</MenuItem>
			</Menu>
		</Fragment>
	);
};

export default UserDropdown;
