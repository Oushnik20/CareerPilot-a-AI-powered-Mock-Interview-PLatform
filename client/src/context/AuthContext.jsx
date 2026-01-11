import React, { createContext, useState, useEffect } from "react";
import { LOCAL_SERVER } from "@/constant";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            setIsAuthenticated(true);
            // fetch user details from backend
            fetch(`${LOCAL_SERVER}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error("Failed to fetch user");
                    const data = await res.json();
                    return data;
                })
                .then((data) => {
                    if (data && data.data) setUser(data.data);
                })
                .catch(() => {
                    setUser(null);
                });
        } else {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [token]);

    const refreshUser = async () => {
        if (!token) return null;
        try {
            const res = await fetch(`${LOCAL_SERVER}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) throw new Error("Failed to fetch user");
            const data = await res.json();
            if (data && data.data) {
                setUser(data.data);
                return data.data;
            }
        } catch (err) {
            setUser(null);
        }
        return null;
    };

    const register = async (name, email, password) => {
        try {
            const res = await fetch(`${LOCAL_SERVER}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = (res.headers.get("content-type") || "").includes("application/json") ? await res.json() : { message: "Invalid response" };
            return { ok: res.ok, ...data };
        } catch (err) {
            return { ok: false, message: err.message };
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch(`${LOCAL_SERVER}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = (res.headers.get("content-type") || "").includes("application/json") ? await res.json() : {};
            if (res.ok && data.data && data.data.token) {
                setToken(data.data.token);
                setUser(data.data.user || null);
                setIsAuthenticated(true);
                return { ok: true };
            }
            return { ok: false, error: (data && data.message) || "Login failed" };
        } catch (err) {
            return { ok: false, error: err.message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        // Use full redirect to root; avoids depending on router
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, isAuthenticated, register, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
