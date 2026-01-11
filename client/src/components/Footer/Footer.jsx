import React from "react";
import { motion } from "framer-motion";
import { Terminal, Linkedin, Github, Instagram, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = () => {
    const socialLinks = [
        {
            icon: Linkedin,
            href: "https://www.linkedin.com/in/oushnik-banerjee-58b0a524a/",
            ariaLabel: "LinkedIn Profile",
        },
        {
            icon: Github,
            href: "https://github.com/Oushnik20",
            ariaLabel: "GitHub Profile",
        },
        {
            icon: Instagram,
            href: "https://www.instagram.com/__.niiiikkk.__/",
            ariaLabel: "Instagram Profile",
        },
        {
            icon: Globe,
            href: "https://codolio.com/profile/oushnik_20",
            ariaLabel: "Personal Website",
        },
    ];

    return (
        <footer className="bg-background text-foreground py-6 border-t border">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                {/* Logo and Platform Name */}
                <div className="flex items-center mb-4 md:mb-0">
                        <Terminal className="w-8 h-8 mr-2 text-primary" />
                        <span className="text-xl font-bold text-primary">
                        CareerPilot
                    </span>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                        <motion.a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.ariaLabel}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <social.icon className="w-6 h-6" />
                        </motion.a>
                    ))}
                </div>

                {/* Made with Love */}
                <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
                    Made with ❤️ by Oushnik
                </div>
            </div>

            {/* Copyright and Additional Info */}
            <div className="text-center text-xs text-muted-foreground mt-4">
                © {new Date().getFullYear()} CareerPilot. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
