import React from "react";
import { NavLink } from "react-router-dom";
import { ButtonGlow } from "@/components/magicui/button-glow";

const SignIn = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full p-8 rounded-xl bg-card/60 border">
                <h1 className="text-2xl font-semibold text-foreground mb-4">Sign In</h1>
                <p className="text-muted-foreground mb-6">Sign in is not implemented yet. You can continue as guest or sign in later.</p>
                <div className="flex gap-4">
                    <NavLink to="/details" className="w-full">
                        <ButtonGlow className="w-full">Continue as Guest</ButtonGlow>
                    </NavLink>
                    <button
                        disabled
                        className="w-32 inline-flex items-center justify-center px-4 py-2 rounded-full border text-muted-foreground cursor-not-allowed bg-card/30"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
