import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import { languages } from "../constants/general";

const LanguageSelector = ({ onChange, value }) => {
	return (
		<FormControl>
			<InputLabel id="language-label">Language</InputLabel>
			<Select
				labelId="language-label"
				id="language-select"
				value={value}
				label="Language"
				onChange={(e) => onChange(e.target.value)}
				size="small"
			>
				{Object.entries(languages).map(([k, l]) => (
					<MenuItem key={l.codeName} value={k}>
						{l.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};


export default LanguageSelector;