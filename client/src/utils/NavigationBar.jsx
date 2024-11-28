import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function NavigationBar() {

    const navigate = useNavigate();

    const { state } = useLocation();
    const isGuest = state?.isGuest || false;

    const userEmail = localStorage.getItem("userEmail")

    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>
                <h1>Destination Planner</h1>
            </div>
            <ul style={styles.navList}>
                <li> {/* Home button shows for all users*/}
                    <button onClick={() => { navigate("/main", { state: { isGuest: isGuest, user: userEmail } }) }}>
                        Home
                    </button>
                </li>
                {!isGuest && (
                    <>
                        <li> {/* Shows for logged in users */}
                            <button onClick={() => { navigate("/my-lists", { state: { isGuest: isGuest, user: userEmail } }) }}>
                                My Lists
                            </button>
                        </li>
                    </>
                )}
                <li> {/* Public lists button shows for all users*/}
                    <button onClick={() => { navigate("/public-lists", { state: { isGuest: isGuest, user: userEmail } }) }}>
                        Public Lists
                    </button>
                </li>
                <li> {/* Exit button shows for all users*/}
                    <button onClick={() => { navigate("/", { state: { isGuest: isGuest, user: userEmail } }) }}>
                        Exit
                    </button>
                </li>
            </ul>
        </nav>
    );
};

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "#fff",
    },
    brand: {
        fontSize: "1.5rem",
    },
    navList: {
        listStyleType: "none",
        display: "flex",
        margin: 0,
        padding: 0,
    },
    navItem: {
        margin: "0 10px",
        textDecoration: "none",
        color: "#fff",
    },
    user: {
        marginLeft: "20px",
    },
};
