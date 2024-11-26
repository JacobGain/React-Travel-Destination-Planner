import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import CreateEmailAccount from "./utils/CreateEmailAccount";
import LoginEmailAccount from "./utils/LoginEmailAccount";
import MainPage from "./utils/MainPage";

const Home = () => {
  const navigate = useNavigate();

  const handleContinueAsGuest = () => {
    // navigate to the main page with guest mode
    navigate("/main", { state: { isGuest: true } });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Europe Destination Planner</h1>
      <h2>Plan and explore your dream destinations across Europe!</h2>
      <p>
        Start your journey with us. Create an account, log in, or continue as a guest to explore.
      </p>
      <div>
        <Link to="/signup">
          <button style={{ marginRight: "10px", padding: "10px 20px" }}>Create Account</button>
        </Link>
        <Link to="/login">
          <button style={{ marginRight: "10px", padding: "10px 20px" }}>Log In</button>
        </Link>
        <button style={{ padding: "10px 20px" }} onClick={handleContinueAsGuest}>
          Continue as Guest
        </button>
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
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
