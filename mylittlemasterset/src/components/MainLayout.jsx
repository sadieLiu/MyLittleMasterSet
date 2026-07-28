import { useEffect, useState } from "react";
import '../styles/components.css';
import { useAuth } from "../hooks/useAuth.jsx";
import sparkles from "../assets/sparkles.png";

import { NavLink } from "react-router-dom";


export default function MainLayout({ children }) {
    const { currentUser } = useAuth();
    const displayName = currentUser?.displayName || currentUser?.email;
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setScrolled((prevScrolled) =>
                prevScrolled ? window.scrollY > 40 : window.scrollY > 200
            );
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function closeMobileMenu() {
        setMobileMenuOpen(false);
    }

    return (
        <>
        <nav className={`navbar${scrolled ? " navbar-scrolled" : ""}${mobileMenuOpen ? " nav-open" : ""}`}>
            <div className="nav-left">
                <img src={sparkles} alt="Sparkles" />
            </div>

            <div className="nav-center">
                <div className="brand logo">
                    <h1> My Little <br></br>Master Set</h1>
                </div>
                <ul className="nav-links">
                    <li><NavLink to="/" onClick={closeMobileMenu}>Home</NavLink></li>
                    <li><NavLink to="/contact" onClick={closeMobileMenu}>Contact</NavLink></li>
                    <li><NavLink to="/about" onClick={closeMobileMenu}>About</NavLink></li>
                    <li><NavLink to="/carddetails" onClick={closeMobileMenu}>Card Search</NavLink></li>
                    <li><NavLink to="/favorites" onClick={closeMobileMenu}>My Favorites</NavLink></li>
                </ul>
            </div>

            <div className="nav-right">
                <NavLink className="login-btn" to="/login" onClick={closeMobileMenu}>
                    {currentUser ? displayName : "Log In or Sign Up"}
                </NavLink>
            </div>

            <button
                type="button"
                className="nav-toggle"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>

        <main>{children}</main>
    

        <footer className="footer">
            <div>
                <p>My Little Master Set</p>
            </div>

            <div>
                <p>© 2026 My Little Master Set</p>
            </div>

            <div>
                <a href="https://www.flaticon.com/free-icons/star" title="star icons">Star icons created by Magnific - Flaticon</a>
            </div>
        </footer>
        </>
    );
}  