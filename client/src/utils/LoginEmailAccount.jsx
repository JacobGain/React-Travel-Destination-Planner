import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebase";

const LoginEmailAccount = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Both email and password are required.");
            setSuccess("");
            return;
        }

        setLoading(true);

        try {
            // attempt to log in the user
            await signInWithEmailAndPassword(auth, email, password);

            setLoading(false);
            setError("");
            setSuccess("Login successful! Welcome back.");
        } catch (err) {
            console.log(err)
            setLoading(false);

            // handle specific error codes
            if (err.code === "auth/invalid-credential") {
                setError("Email or password is incorrect. Please try again.");
            } else if (err.code === "auth/user-disabled") {
                setError("This account is disabled. Contact support.");
            } else {
                setError("Failed to log in. Please try again later.");
            }

            setSuccess("");
        }
    };

    return (
        <div>
            <h2>Login to Your Account</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging In..." : "Log In"}
                </button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
        </div>
    );
};

export default LoginEmailAccount;
