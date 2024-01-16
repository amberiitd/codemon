import { FC, createContext, useContext, useEffect, useMemo, useState } from "react";
import { Amplify, Auth } from "aws-amplify";
import { useLocation, useNavigate } from "react-router-dom";
import { noop } from "lodash";
import { parseJwt } from "../util/jwt";
import { AppContext } from "./app";
import { toast } from "react-toastify";
import { useTheme } from "@emotion/react";
import { tokens } from "./theme";

Amplify.configure({
	Auth: {
		region: "ap-south-1",
		//   authenticationFlowType: 'CUSTOM_AUTH',
		userPoolId: process.env.REACT_APP_USER_POOL_ID,
		userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
		identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
	},
	API: {
		endpoints: [
			{
				name: "base_url",
				endpoint: `${process.env.REACT_APP_BASE_URL}`,
				region: "ap-south-1",
			},
			{
				name: "local",
				endpoint: `http://localhost:8080`,
				region: "ap-south-1",
			},
		],
	},
});
const getRole = (data) => {
	const roleParts = data.signInUserSession?.idToken?.jwtToken
		? parseJwt(data.signInUserSession.idToken.jwtToken)["cognito:roles"]?.[0]?.split("/") || []
		: [];
	const role = roleParts.length > 0 ? roleParts[roleParts.length - 1] : "user-role";
	return role;
};
export const AuthContext = createContext({
	auth: {
		status: "loading",
		user: undefined,
	},
	login: async () => {},
	signup: noop,
	logout: noop,
});

const AuthContextProvider = ({ children }) => {
  const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const [auth, setAuth] = useState({
		status: "loading",
		user: undefined,
	});
	const navigate = useNavigate();

	const login = async (data) => {
    console.log(process.env.REACT_APP_USER_POOL_ID);
		try {
			await Auth.signIn(data.username, data.password);
			const user = await Auth.currentAuthenticatedUser();
			setAuth({
				status: "authenticated",
				user: {
					username: user.username,
					sub: user.attributes?.sub,
					role: getRole(user),
					name: user.attributes?.name,
				},
			});
			toast.success("User logged in");
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const signup = (data) => {
		Auth.signUp({
			username: data.username,
			password: data.password,
			attributes: { name: data.name },
		})
			.then(() => {
				navigate("/login");
				toast.success("User signed up");
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const logout = async () => {
		await Auth.signOut().then(() => {
			console.log("userlogged out");
			setAuth({ status: "unauthenticated", user: undefined });
		});
	};

	useEffect(() => {
		if (auth.status === "loading") {
			Auth.currentAuthenticatedUser()
				.then((data) => {
					setAuth({
						status: "authenticated",
						user: {
							username: data.username,
							sub: data.attributes?.sub,
							role: getRole(data),
							name: data.attributes?.name,
						},
					});
				})
				.catch((error) => {
					console.log(error);
					setAuth({
						status: "unauthenticated",
						user: undefined,
					});
					navigate("/login");
				});
		}
	}, [auth]);
	return (
		<AuthContext.Provider value={{ auth, login, signup, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
