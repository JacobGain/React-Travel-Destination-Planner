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
            // log in the user with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            setLoading(false);
            setError("");

            // navigate to the main page with user authenticated state
            navigate("/main", { state: { isGuest: false, user: user.email } });
        } catch (err) {
            setLoading(false);

            // handle specific error codes
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
        <div>
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging In..." : "Log In"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default LoginEmailAccount;
