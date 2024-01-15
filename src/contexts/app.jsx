import { FC, createContext, useCallback, useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import AppNavBar from "../components/AppNavBar";

export const AppContext = createContext({});
const AppContextProvider = ({ children }) => {
	const [bigScreen, setBigScreen] = useState(window.matchMedia("(min-width: 900px)").matches);
  const location = useLocation();

	// const [taskList, dispatchTaskAction] = useReducer(function (taskList, action) {
	// 	switch (action.type) {
	// 		case "setList":
	// 			return action.data;
	// 		case "addTask":
	// 			return [...taskList, action.data];

	// 		default:
	// 			return taskList;
	// 	}
	// }, []);

	// const [filterStatus, setFilterStatus] = useState("all");
	// const refreshTasks = useCallback(
	// 	async (status) => {
	// 		status = status || filterStatus;
	// 		(status === "all" ? getAllTasks() : getTasksByStatus(status))
	// 			.then((data) => {
	// 				dispatchTaskAction({
	// 					type: "setList",
	// 					data: data.sort((t1, t2) => (t1.createdAt || 0) - (t2.createdAt || 0)),
	// 				});
	// 			})
	// 			.catch((error) => {
	//         console.error(error);
	//         dispatchTaskAction({
	// 					type: "setList",
	// 					data: [],
	// 				});
	// 			});
	// 	},
	// 	[filterStatus, ]
	// );
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
		<AppContext.Provider value={{ bigScreen }}>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
