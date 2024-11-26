import React, { useState } from "react";
import { auth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "../firebase"; // import the necessary Firebase functions

const CreateEmailAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false); // to show loading state
  const [error, setError] = useState(""); // to handle error messages

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!email || !password || !nickname) { // ensure all fields are filled in
      setError("All fields are required.");
      return;
    }

    if (!checkValidEmail(email)) {
      setError("Invalid email format.")
      return;
    }

    setLoading(true); // start loading when the form is submitted

    try {
      // create user with email and password using firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // update user profile with nickname
      await updateProfile(user, { displayName: nickname });

      // send email verification
      await sendEmailVerification(user);

      setLoading(false); // stop loading
      setError(""); // clear any previous errors

      // display a success message
      alert("Account created! Please check your email to verify your account.");
    } catch (err) {
      setLoading(false); // stop loading
      // check the possible error codes and set the error message to display
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/user-disabled") {
        setError("This account is disabled. Please contact site administrator.");
      } else {
        setError(err.message);
      }
    }
  };

  const checkValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // email reg expression
    return emailRegex.test(email);
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}> {/* use a form so that all the fields have to be filled and it will use the 
      handleSubmit method when the button is pressed */}
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
        <label>
          Nickname:
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>} {/* display error message */}
    </div>
  );
};

export default CreateEmailAccount;