import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateEmailAccount from "./utils/CreateEmailAccount";
import LoginEmailAccount from "./utils/LoginEmailAccount";

const App = () => {
  return (
    <Router>
      <div>
        <h1>Welcome to My App</h1>
        <Routes>
          <Route path="/signup" element={<CreateEmailAccount />} />
          <Route path="/login" element={<LoginEmailAccount />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;