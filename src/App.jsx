import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Play from "./Pages/Play";
import Solo from "./Pages/Solo";
import Squad from "./Pages/Squad";
import CreateRoom from "./Pages/CreateRoom";
import JoinRoom from "./Pages/JoinRoom";
import TypingArena from "./Pages/TypingArena";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/login" element={<Login />} />
				<Route path="/play" element={<Play />} />
				<Route path="/play/solo" element={<Solo />} />
				<Route path="/play/squad" element={<Squad />} />
				<Route path="/squad/create" element={<CreateRoom />} />
				<Route path="/squad/join" element={<JoinRoom />} />
				<Route path="/squad/arena/:roomId" element={<TypingArena />} />
			</Routes>
		</>
	);
}

export default App;
