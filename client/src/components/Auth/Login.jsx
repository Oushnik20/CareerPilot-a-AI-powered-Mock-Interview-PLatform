import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ButtonGlow } from "@/components/magicui/button-glow";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        const res = await login(email, password);
        if (res.ok) {
            navigate("/details");
        } else {
            setError(res.error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full p-8 rounded-xl bg-card/60 border"
            >
                <h2 className="text-2xl font-semibold text-foreground mb-4">Sign In</h2>
                {error && <div className="text-red-400 mb-3">{error}</div>}
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-2 p-3 rounded-md bg-card text-foreground border"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 p-3 rounded-md bg-card text-foreground border"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <ButtonGlow type="submit">Sign In</ButtonGlow>
                        <NavLink to="/signup" className="text-sm text-muted-foreground hover:text-foreground">
                            Create account
                        </NavLink>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
