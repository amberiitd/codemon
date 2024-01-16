import {
	Avatar,
	Badge,
	BadgeProps,
	Box,
	Button,
	Drawer,
	IconButton,
	Skeleton,
	Slide,
	Stack,
	Typography,
	styled,
} from "@mui/material";
import { FC, useContext, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@emotion/react";
import { tokens } from "../contexts/theme";
import React from "react";
import { isEmpty, toUpper } from "lodash";
import LogoutIcon from "@mui/icons-material/Logout";
import TextCopy from "./TextCopy";
import { toast } from "react-toastify";

const RightConnectDrawer = () => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { connectDrawer, setConnectDrawer, screenSize } =
		useContext(PageContext);

	return screenSize === "sm" ? (
		<Drawer
			anchor={"bottom"}
			open={connectDrawer}
			onClose={() => setConnectDrawer(false)}
			sx={{ backgroundColor: "transparent" }}
		>
			<Box
				height={"90vh"}
				sx={{ backgroundColor: colors.primary[200] }}
				borderTop={1}
				borderRadius={2}
				borderColor={colors.primary[500]}
			>
				<DrawerContent />
			</Box>
		</Drawer>
	) : (
		<Slide in={connectDrawer} direction="left">
			<Box
				height="calc(100vh - 12px)"
				width={"25rem"}
				border={1}
				borderRadius={2}
				borderColor={colors.primary[500]}
				position={"absolute"}
				right={5}
				top={5}
				sx={{ backgroundColor: colors.primary[200] }}
			>
				<DrawerContent />
			</Box>
		</Slide>
	);
};

export default RightConnectDrawer;


const Header = ({
	title,
	closeButton,
}) => {
	const { setConnectDrawer, screenSize } = useContext(PageContext);
	return (
		<Stack direction={"row"} padding={1}>
			<Typography variant="h4" py={0.6} pl={1}>
				{title}
			</Typography>
			{closeButton && (
				<IconButton
					onClick={() => setConnectDrawer(false)}
					sx={{ marginLeft: "auto" }}
				>
					<CloseIcon />
				</IconButton>
			)}
		</Stack>
	);
};

const DrawerContent = () => {
	const { screenSize } = useContext(PageContext);
	return (
		<React.Fragment>
			<Header
				title={isEmpty(account?.code) ? "Connect a wallet" : ""}
				closeButton={screenSize === "lg"}
			/>
		</React.Fragment>
	);
};

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
	"& .MuiBadge-badge": {
		right: "5px",
		top: "45px",
		border: `1px solid ${theme.palette.background.paper}`,
		padding: 0,
	},
}));

// const UserProfile = () => {
// 	const theme = useTheme();
// 	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
// 	const Icon = (
// 		<Avatar
// 			alt={wallet?.provider}
// 			src={`${process.env.PUBLIC_URL}/assets/_icon.svg`}
// 			sizes="small"
// 			sx={{ width: 20, height: 20, backgroundColor: colors.primary[100] }}
// 		/>
// 	);
// 	return (
// 		<Box display={"flex"} px={2} alignItems={"center"}>
// 			{account?.code ? (
// 				<>
// 					<StyledBadge badgeContent={Icon} color="secondary">
// 					</StyledBadge>
// 					<TextCopy
// 						label={toUpper(
// 							account.code.slice(0, 6) +
// 								"..." +
// 								account.code.slice(account.code.length - 4)
// 						)}
// 						text={account.code}
// 						title={"copy"}
// 					/>
// 					<Button
// 						variant="outlined"
// 						sx={{ ml: "auto", px: 0 }}
// 						onClick={() => {
// 							setAccount(undefined);
// 							toast.info("User logged out!");
// 						}}
// 					>
// 						<LogoutIcon />
// 					</Button>
// 				</>
// 			) : (
// 				<>
// 					<Skeleton variant="circular" height={50} width={50} />
// 					<Skeleton
// 						variant="rectangular"
// 						height={50}
// 						width={200}
// 						sx={{ ml: 2 }}
// 					/>
// 				</>
// 			)}
// 		</Box>
// 	);
// };
