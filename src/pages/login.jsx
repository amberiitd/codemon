import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../contexts/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";

const LoginPage = () => {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: { username: "", password: "" },
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { auth, login } = useContext(AuthContext);
	useEffect(() => {
		if (auth.status !== "loading" && auth.user) {
			navigate("/app/home");
		}
	}, [auth]);
	return (
		<Box
			component="form"
			noValidate
			autoComplete="off"
			onSubmit={handleSubmit((data) => {
				setError("");
				login(data).catch((error) => {
					setError(error.message);
				});
			})}
			marginTop={10}
		>
			<Stack width={300} spacing={2}>
				<Controller
					control={control}
					name="username"
					rules={{
						required: true,
						validate: (data) => {
							return data.length > 2;
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
					rules={{ required: true, validate: (pass) => pass.length > 7 }}
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
				<Button
					size="small"
					type="submit"
					variant="outlined"
					disabled={Boolean(errors.username) || Boolean(errors.password)}
				>
					Login
				</Button>
				<Link to={"/signup"} style={{ marginLeft: 10 }}>
					Sign Up
				</Link>
			</Box>

			{error && (
				<Box
					borderRadius={3}
					border={1}
					sx={{ backgroundColor: "whitesmoke", color: "red" }}
					marginTop={5}
					width={300}
					padding={1}
				>
					{error}
				</Box>
			)}
		</Box>
	);
};

export default LoginPage;
