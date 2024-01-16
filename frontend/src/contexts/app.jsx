import { FC, createContext, useCallback, useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import AppNavBar from "../components/AppNavBar";
import ConfirmCancel from "../components/ConfirmCancel";

export const AppContext = createContext({});
const AppContextProvider = ({ children }) => {
	const [bigScreen, setBigScreen] = useState(window.matchMedia("(min-width: 760px)").matches);
  const [cancelModal, setCancelModal] = useState(false);
  const [testProblems, setTestProblems] = useState([]);
  const location = useLocation();

	const handleResize = useCallback(
		(e) => {
			setBigScreen(window.matchMedia("(min-width: 768px)").matches);
		},
		[window]
	);
	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<AppContext.Provider value={{ bigScreen, cancelModal, setCancelModal, testProblems, setTestProblems }}>
			{children}
      <ConfirmCancel open={cancelModal} onClose={() => setCancelModal(false)} />
		</AppContext.Provider>
	);
};

export default AppContextProvider;
