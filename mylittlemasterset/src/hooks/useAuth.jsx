import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithPopup
} from "firebase/auth";
import {
    auth, 
} from "../firebase.js";

// This context is the shared container for the signed-in user and auth actions.
// Its initial value is null so useAuth can detect a missing AuthProvider.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    async function signUp({ firstName, lastName, email, password }) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();

        if (displayName) {
            await updateProfile(credential.user, { displayName });
            setCurrentUser({ ...credential.user, displayName });
        }

        return credential.user;
    }

    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logInWithGoogle() {
        // TODO: Lab 11 task - implement Google sign in with Firebase.
        // Hint: import signInWithPopup from firebase/auth and call it with auth plus your Google provider.
        // Documentation: https://firebase.google.com/docs/auth/web/google-signin
        // remember to import googleProvider from firebase.js and export it there as well.

        // return signInWithPopup(auth, googleProvider);
    }

    function logOut() {
        return signOut(auth);
    }

    const value = useMemo(() => ({
        currentUser,
        loading,
        signUp,
        logIn,
        logOut,
        logInWithGoogle
    }), [currentUser, loading]);

    return (
        // Every descendant can read this single shared value without passing
        // currentUser and the auth functions through each component as props.
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    // useContext is needed in this design: it retrieves the nearest
    // AuthContext.Provider value and subscribes this component to its updates.
    // useAuth is a small wrapper so components do not access AuthContext directly
    // and get a clear error if they are rendered outside AuthProvider.
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }

    return context;
}
