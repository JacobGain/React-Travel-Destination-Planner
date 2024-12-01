// App.js
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import CreateEmailAccount from "./utils/CreateEmailAccount";
import LoginEmailAccount from "./utils/LoginEmailAccount";
import MainPage from "./utils/MainPage";
import PrivateListPage from "./utils/PrivateListPage";
import EditListPage from './utils/EditListPage';
import PublicListPage from './utils/PublicListPage';
import SecurityPrivacyCopyright from './utils/SecurityPrivacyCopyright';

const Home = () => {
  const navigate = useNavigate();

  const handleContinueAsGuest = () => {
    // navigate to the main page with guest mode
    navigate("/main", { state: { isGuest: true } });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Europe Destination Planner</h1>
        <h2 style={styles.subtitle}>Plan and explore your dream destinations across Europe!</h2>
      </header>
      <p style={styles.description}>
        Start your journey with us. Create an account, log in, or continue as a guest to explore.
      </p>
      <div style={styles.buttonGroup}>
        <Link to="/signup" style={styles.button}>
          Create Account
        </Link>
        <Link to="/login" style={styles.button}>
          Log In
        </Link>
        <button onClick={handleContinueAsGuest} style={styles.button}>
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
          <Route path="/my-lists" element={<PrivateListPage />} />
          <Route path="/edit-list" element={<EditListPage />} />
          <Route path="/public-lists" element={<PublicListPage />} />
          <Route path="/legal" element={<SecurityPrivacyCopyright />} />
        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "2rem",
    color: "#ED2939",
    margin: "0 0 10px",
  },
  subtitle: {
    fontSize: "1.25rem",
    color: "#333",
  },
  description: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
  button: {
    padding: "12px 30px",
    backgroundColor: "#ED2939",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    border: "none",
    transition: "transform 0.2s ease, background-color 0.3s ease",
  },
};

export default App;
