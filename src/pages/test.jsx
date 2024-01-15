import { Box } from "@mui/material";
import TestHome from "./test-home";
import { Navigate, Route, Routes } from "react-router-dom";
import TestEditor from "./test-editor";
import { createContext, useContext, useReducer, useState } from "react";
import { AppContext } from "../contexts/app";
const problemsData = require("../problems.json");

const TestContext = createContext({});
export const useTestContext = () => useContext(TestContext);

const Test = () => {
	const { testProblems } = useContext(AppContext);
	const [problems, dispatchProblemAction] = useReducer(
		function (problems, action) {
			const index = action.data.problemId;
			switch (action.type) {
				case "setEditor":
					problems[index].editor = {...problems[index].editor, [action.data.language]: action.data.editor};
					return [...problems];
				case "setSaved":
					problems[index].saved = true;
					return [...problems];
				case "setRun":
					problems[index].runResults = action.data.runResults;
					problems[index].run = true;
					return [...problems];
				case "setLanguage":
					problems[index].language = action.data.language;
					return [...problems];
				default:
					return problems;
			}
		},
		testProblems.map((p) => ({
			...p,
			editor: {},
			language: "javascript",
			saved: false,
			runResults: [],
			run: false,
		}))
	);

	const [submission, setSubmission] = useState({ status: "not-submitted" });
	const [savedCount, setSavedCount] = useState(0);

	return (
		<TestContext.Provider
			value={{ problems, dispatchProblemAction, submission, setSubmission, savedCount, setSavedCount }}
		>
			<Routes>
				<Route path="problems" element={<TestHome />} />
				<Route path="problems/:problemId" element={<TestEditor />} />
				<Route path="*" element={<Navigate to="/app/home" />} />
			</Routes>
		</TestContext.Provider>
	);
};

export default Test;
