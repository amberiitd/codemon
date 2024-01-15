import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

const HomePage = () => {
	return (
		<Box marginTop={5}>
			<Box display={"flex"} justifyContent={"center"}>
				<Button component={Link} to="/app/test/problems" size="small" variant="contained">
					Take New Test
				</Button>
			</Box>
		</Box>
	);
};

export default HomePage;
