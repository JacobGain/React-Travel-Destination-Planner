import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function NavigationBar() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const isGuest = state?.isGuest || false;
    const userEmail = localStorage.getItem("userEmail");

    const [hoverIndex, setHoverIndex] = useState(null);

    const navButtons = [
        { label: "Home", path: "/main" },
        !isGuest && { label: "My Lists", path: "/my-lists" },
        { label: "Public Lists", path: "/public-lists" },
        { label: "Legal", path:"/legal"},
        { label: "Exit", path: "/" }
    ].filter(Boolean);

    return (
        <nav style={styles.nav}>
            <div style={styles.brand} onClick={() => navigate("/main", { state: { isGuest, user: userEmail } })}>
                Destination Planner
            </div>
            <ul style={styles.navList}>
                {navButtons.map((button, index) => (
                    <li key={index} style={styles.navItem}>
                        <button
                            onClick={() => navigate(button.path, { state: { isGuest, user: userEmail } })}
                            style={{
                                ...styles.navButton,
                                ...(hoverIndex === index && styles.navButtonHover),
                            }}
                            onMouseOver={() => setHoverIndex(index)}
                            onMouseOut={() => setHoverIndex(null)}
                        >
                            {button.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}


const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#ED2939",
        color: "#fff",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add subtle shadow
    },
    brand: {
        fontSize: "1.8rem",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        cursor: "pointer",
    },
    navList: {
        listStyleType: "none",
        display: "flex",
        margin: 0,
        padding: 0,
    },
    navItem: {
        margin: "0 15px",
    },
    navButton: {
        backgroundColor: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        padding: "5px 10px",
        transition: "all 0.3s ease",
        borderRadius: "4px",
    },
    navButtonHover: {
        backgroundColor: "#7C0A02", // Slightly darker shade for hover effect
        color: "#fff",
    },
    navButtonActive: {
        backgroundColor: "#003a75", // Darker blue for active state
    },
    user: {
        marginLeft: "20px",
        fontStyle: "italic",
        color: "#ddd",
    },
};
