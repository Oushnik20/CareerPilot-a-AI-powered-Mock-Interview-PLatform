import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal, Menu, X, User, LogOut } from "lucide-react";
import { ButtonGlow } from "@/components/magicui/button-glow";
import { AuthContext } from "@/context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const { isAuthenticated, logout } = useContext(AuthContext);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-sm border-b border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                            <NavLink to="/" className="flex items-center gap-2">
                            <Terminal className="h-6 w-6 text-primary" />
                            <span className="text-foreground font-semibold">
                                CareerPilot
                            </span>
                        </NavLink>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="flex items-center gap-8">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                            `text-sm ${
                                                isActive
                                                    ? "text-primary"
                                                    : "text-muted-foreground hover:text-foreground"
                                            } transition-colors`
                                        }
                                >
                                    {item.name}
                                </NavLink>
                            ))}

                            {!isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <NavLink to="/login">
                                        <ButtonGlow className="ml-4">Sign In</ButtonGlow>
                                    </NavLink>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <NavLink to="/dashboard" className="text-muted-foreground hover:text-foreground">
                                        <User className="inline-block mr-2 w-5 h-5 text-primary" /> Dashboard
                                    </NavLink>
                                    <button onClick={logout} className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <motion.div
                initial={false}
                animate={isOpen ? { height: "auto" } : { height: 0 }}
                className="md:hidden overflow-hidden bg-card"
            >
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base ${
                                    isActive
                                        ? "bg-secondary text-foreground"
                                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                    {!isAuthenticated ? (
                        <div className="space-y-2">
                            <NavLink to="/login" onClick={() => setIsOpen(false)}>
                                <ButtonGlow className="w-full mt-4 ">Sign In</ButtonGlow>
                            </NavLink>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base text-muted-foreground hover:bg-card hover:text-foreground">
                                Dashboard
                            </NavLink>
                            <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base text-muted-foreground hover:bg-card hover:text-foreground">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar;
