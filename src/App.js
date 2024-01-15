import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { ColorModeContext, useMode } from "./contexts/theme";
import { ToastContainer } from "react-toastify";
import Main from "./pages/Main";
import AppContextProvider from "./contexts/app";
import AuthContextProvider from "./contexts/auth";

function App() {
	const { theme, toggleColorMode } = useMode();
	return (
		<ColorModeContext.Provider value={{ toggleColorMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<BrowserRouter>
					<AuthContextProvider>
						<AppContextProvider>
							<Main />
						</AppContextProvider>
					</AuthContextProvider>
				</BrowserRouter>
				<ToastContainer theme={theme.palette.mode} />
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
