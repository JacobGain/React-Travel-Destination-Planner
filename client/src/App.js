import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateEmailAccount from "./utils/CreateEmailAccount";
import LoginEmailAccount from "./utils/LoginEmailAccount";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Europe Destination Planner</h1>
      <h2>Explore your dream destinations across Europe!</h2>
      <p>
        Start your journey now! Create an account, log in or continue as guest to browse and save your favorite destinations.
      </p>
      <div>
        <Link to="/signup">
          <button style={{ marginRight: "10px", padding: "10px 20px" }}>Create Account</button>
        </Link>
        <Link to="/login">
          <button style={{ padding: "10px 20px" }}>Log In</button>
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<CreateEmailAccount />} />
          <Route path="/login" element={<LoginEmailAccount />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
