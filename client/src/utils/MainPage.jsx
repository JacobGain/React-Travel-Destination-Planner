import React from "react";
import { useLocation } from "react-router-dom";

const MainPage = () => {
    const location = useLocation();
    const isGuest = location.state?.isGuest || false;
    const user = location.state?.user || null;

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Europe Destination Planner</h1>
            {isGuest ? (
                <p>You are browsing as a guest. Some features are limited.</p>
            ) : (
                <p>
                    Welcome back, <strong>{user}</strong>! Enjoy full access to the planner.
                </p>
            )}
            {/* main content will go here */}
        </div>
    );
};

export default MainPage;
