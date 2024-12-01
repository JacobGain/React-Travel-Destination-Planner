import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useNavigate } from "react-router-dom";

const LoginEmailAccount = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem("userEmail", user.email);

            const response = await fetch("/api/open/JWTlogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, isEmailVerified: user.emailVerified }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                alert(`Error: ${errorMessage}`);
                return;
            }

            const data = await response.json();
            localStorage.setItem("authToken", data.token);

            setLoading(false);
            setError("");
            navigate("/main", { state: { isGuest: false, user: user.email } });
        } catch (err) {
            setLoading(false);

            if (err.code === "auth/invalid-credential") {
                setError("Email or password is incorrect. Please try again.");
            } else if (err.code === "auth/user-disabled") {
                setError("This account is disabled. Contact support.");
            } else {
                setError("Failed to log in. Please try again later.");
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Log In</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button
                    type="submit"
                    style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
                    disabled={loading}
                >
                    {loading ? "Logging In..." : "Log In"}
                </button>
            </form>
            {error && <p style={styles.errorMessage}>{error}</p>}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    heading: {
        fontSize: "1.75rem",
        color: "#343a40",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    formGroup: {
        marginBottom: "20px",
        textAlign: "left",
    },
    label: {
        display: "block",
        marginBottom: "5px",
        fontWeight: "bold",
        color: "#495057",
    },
    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "1rem",
        boxSizing: "border-box",
        transition: "border-color 0.3s ease",
    },
    inputFocus: {
        borderColor: "#007bff",
    },
    button: {
        width: "100%",
        padding: "10px 20px",
        backgroundColor: "#ED2939",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    buttonDisabled: {
        backgroundColor: "#6c757d",
        cursor: "not-allowed",
    },
    buttonHover: {
        backgroundColor: "#7C0A02",
    },
    errorMessage: {
        marginTop: "15px",
        color: "red",
        fontSize: "0.9rem",
    },
};

export default LoginEmailAccount;
