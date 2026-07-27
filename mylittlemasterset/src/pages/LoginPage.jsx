import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth();

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
};

function getAuthErrorMessage(error) {
    switch (error.code) {
        case "auth/email-already-in-use":
            return "That email is already signed up. Try logging in instead.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Email or password was not recognized.";
        case "auth/popup-closed-by-user":
            return "Google sign in was closed before finishing.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        default:
            return "Authentication failed. Please try again.";
    }
}

export default function LoginPage() {
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentUser, logIn, signUp, logOut } = useAuth();
    const navigate = useNavigate();

    const displayName = currentUser?.displayName || currentUser?.email || "Movie fan";

    function updateForm(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function switchMode(nextMode) {
        setMode(nextMode);
        setError("");
        setStatus("");
    }

    async function handleEmailSubmit(event) {
        event.preventDefault();
        setError("");
        setStatus("");
        setIsSubmitting(true);

        try {
            if (mode === "signup") {
                if (!form.firstName.trim() || !form.lastName.trim()) {
                    setError("Please enter your first and last name.");
                    return;
                }

                await signUp(form);
                setStatus("Your account was created successfully.");
            } else {
                await logIn(form.email, form.password);
                setStatus("You are logged in.");
            }

            setForm(initialForm);
            navigate("/");
        } catch (authError) {
            setError(getAuthErrorMessage(authError));
        } finally {
            setIsSubmitting(false);
        }
    }

 
    async function handleGoogleLogin() {
        setError("");
        setStatus("");
        setIsSubmitting(true);

        try {
            await signInWithPopup(auth, provider); //this is a function you will import from useAuth().
            setStatus("You are logged in.");
            navigate("/");
        } catch (authError) {
            setError(getAuthErrorMessage(authError));
            console.log("Google sign in error:", authError);
        } finally {
            setIsSubmitting(false);
        }
    }
    async function handleLogout() {
        await logOut();
        setStatus("You have been signed out.");
    }

    if (currentUser) {
        return (
            <>
                <section className="card shadow-sm mb-4 auth-card">
                    <div className="card-body">
                        <h2 className="card-title">Welcome, {displayName}</h2>
                        <p className="mb-3">You are signed in to My Little Master Set.</p>
                        <button className="btn btn-outline-danger" type="button" onClick={handleLogout}>
                            Sign out
                        </button>
                    </div>
                </section>
                {status && <div className="alert alert-success">{status}</div>}
                
            </>
        );
    }

    return (
        <>
            <section className="card shadow-sm mb-4 auth-card">
                <div className="card-body">
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                        <div>
                            <h2 className="card-title mb-1">{mode === "login" ? "Login" : "Create Account"}</h2>
                        </div>
                        <div className="btn-group auth-mode-toggle" role="group" aria-label="Choose auth mode">
                            <button
                                className={`btn ${mode === "login" ? "btn-primary navbar-theme-color" : "btn-outline-secondary"}`}
                                type="button"
                                onClick={() => switchMode("login")}
                            >
                                Login
                            </button>
                            <button
                                className={`btn ${mode === "signup" ? "btn-primary navbar-theme-color" : "btn-outline-secondary"}`}
                                type="button"
                                onClick={() => switchMode("signup")}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                    <button className="google-signin-button w-100 mb-4" type="button" onClick={handleGoogleLogin} disabled={isSubmitting}>
                        <span className="google-signin-icon" aria-hidden="true">
                            {/* Google's official icon */}
                            <svg viewBox="0 0 48 48" focusable="false">
                                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.5 30.4.2 24 .2 14.6.2 6.5 5.6 2.6 13.5l7.9 6.1C12.4 13.6 17.8 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.6h13.2c-.6 3-2.3 5.6-4.8 7.3l7.4 5.7c4.3-4 7.7-9.9 7.7-17.1z" />
                                <path fill="#FBBC05" d="M10.5 28.4c-.5-1.4-.8-2.9-.8-4.4s.3-3 .8-4.4l-7.9-6.1C.9 16.8 0 20.3 0 24s.9 7.2 2.6 10.5l7.9-6.1z" />
                                <path fill="#34A853" d="M24 47.8c6.4 0 11.8-2.1 15.8-5.8l-7.4-5.7c-2.1 1.4-4.7 2.2-8.4 2.2-6.2 0-11.5-4.1-13.4-9.7l-7.9 6.1C6.5 42.4 14.6 47.8 24 47.8z" />
                            </svg>
                        </span>
                        <span>{mode === "signup" ? "Sign up with Google" : "Sign in with Google"}</span>
                    </button>

                    <form className="row g-3" onSubmit={handleEmailSubmit}>
                        {mode === "signup" && (
                            <>
                                <div className="col-12 col-md-6">
                                    <label className="form-label" htmlFor="firstName">First Name</label>
                                    <input id="firstName" name="firstName" className="form-control" value={form.firstName} onChange={updateForm} autoComplete="given-name" />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label" htmlFor="lastName">Last Name</label>
                                    <input id="lastName" name="lastName" className="form-control" value={form.lastName} onChange={updateForm} autoComplete="family-name" />
                                </div>
                            </>
                        )}
                        <div className="col-12">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input id="email" name="email" className="form-control" type="email" value={form.email} onChange={updateForm} autoComplete="email" required />
                        </div>
                        <div className="col-12">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input id="password" name="password" className="form-control" type="password" value={form.password} onChange={updateForm} autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary navbar-theme-color" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
                            </button>
                        </div>
                    </form>

                    {error && <div className="alert alert-warning mt-4">{error}</div>}
                    {status && <div className="alert alert-success mt-4">{status}</div>}
                </div>
            </section>
        </>
    );
}
