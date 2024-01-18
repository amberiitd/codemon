import { useTheme } from "@emotion/react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./home";
import { useContext, useEffect, useMemo } from "react";
import { tokens } from "../contexts/theme";
import LoginPage from "./login";
import SignupPage from "./signup";
import { AuthContext } from "../contexts/auth";
import AppNavBar from "../components/AppNavBar";
import PageWrapper from "../components/PageWrapper";
import Test from "./test";

const AuthGuard = ({ children }) => {
	const { auth } = useContext(AuthContext);
	const navigate = useNavigate();
	useEffect(() => {
		if (auth.status === "unauthenticated") {
			navigate("/login");
		}
	}, [auth]);

	return auth.status === "loading" ? "Loading..." : children;
};

const Main = () => {
	const theme = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const location = useLocation();

	return (
		<main
			style={{
				background: `linear-gradient(${colors.bg[100]}, ${colors.primary[100]})`,
				position: "relative",
				overflowX: "hidden",
			}}
		>
			<AppNavBar profile={!["/login", "/signup"].includes(location.pathname)} />
			<PageWrapper>
				<Routes>
					<Route path="login" element={<LoginPage />} />
					<Route path="signup" element={<SignupPage />} />
					<Route
						path="app/*"
						element={
							<AuthGuard>
								<Routes>
									<Route path="" element={<HomePage />} />
									<Route path="test/*" element={<Test />} />
									<Route path="*" element={<Navigate to="" />} />
								</Routes>
							</AuthGuard>
						}
					/>
          <Route path="*" element={<Navigate to="app" />} />
				</Routes>
			</PageWrapper>
		</main>
	);
};

export default Main;
