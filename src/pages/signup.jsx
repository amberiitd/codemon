import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../contexts/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";

const SignupPage = () => {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: { username: "", password: "", name: "" },
	});
	const navigate = useNavigate();
	const { auth, signup } = useContext(AuthContext);
	useEffect(() => {
		if (auth.status !== "loading" && auth.user) {
			navigate("/home");
		}
	}, [auth]);
	return (
		<Box
			component="form"
			// sx={{
			// 	"& > :not(style)": { m: 1, width: "25ch" },
			// }}
			noValidate
			autoComplete="off"
			onSubmit={handleSubmit(signup)}
			marginTop={10}
		>
			<Stack width={300} spacing={2}>
				<Controller
					control={control}
					name="name"
					rules={{
						required: true,
						validate: (value) => {
							return /^\w{3,}\s?\w*$/.test(value);
						},
					}}
					render={({ field }) => (
						<TextField
							size="small"
							{...field}
							type="text"
							label="Full Name"
							variant="outlined"
							error={Boolean(errors.name)}
						/>
					)}
				/>
				<Controller
					control={control}
					name="username"
					rules={{
						required: true,
						validate: (value) => {
							return /^\w{3,}$/.test(value);
						},
					}}
					render={({ field }) => (
						<TextField
							size="small"
							{...field}
							type="text"
							label="Username"
							variant="outlined"
							error={Boolean(errors.username)}
              helperText={Boolean(errors.username) ? "Username should be longer" : null}
						/>
					)}
				/>

				<Controller
					control={control}
					name="password"
					rules={{
						required: true,
						validate: (value) => {
							return /^\w{8,}$/.test(value);
						},
					}}
					render={({ field }) => (
						<TextField
							size="small"
							{...field}
							type="password"
							label="Password"
							variant="outlined"
							error={Boolean(errors.password)}
              helperText={Boolean(errors.password) ? "Passsword should be longer" : null}
						/>
					)}
				/>
			</Stack>
			<Box sx={{ marginTop: 2 }}>
				<Button size="small" type="submit" variant="outlined">
					Sign Up
				</Button>
				<Link to={"/login"} style={{ marginLeft: 10 }}>
					Login
				</Link>
			</Box>
		</Box>
	);
};

export default SignupPage;
