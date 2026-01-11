import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { ButtonGlow } from "@/components/magicui/button-glow";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { LOCAL_SERVER } from "@/constant.js";
import { toast } from "sonner";

const Dashboard = () => {
    const { user, logout, refreshUser } = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [email] = useState(user?.email || "");
    const [college, setCollege] = useState(user?.college || "");
    const [address, setAddress] = useState(user?.address || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [links, setLinks] = useState(user?.links || {});
    const navigate = useNavigate();

    // Sync local state when `user` in AuthContext updates (e.g., after page reload)
    React.useEffect(() => {
        if (user) {
            setName(user.name || "");
            // email is read-only local state
            // set other profile fields
            setCollege(user.college || "");
            setAddress(user.address || "");
            setBio(user.bio || "");
            setLinks(user.links || {});
        }
    }, [user]);

    const SERVER = import.meta.env.VITE_SERVER || LOCAL_SERVER;
    const { token } = useContext(AuthContext);

    const handleSave = async () => {
        // validate important links before sending
        const validateLinks = () => {
            if (!links) return true;
            const g = links.github || "";
            const l = links.linkedin || "";
            const lc = links.leetcode || "";
            if (g && !g.toLowerCase().includes("github.com")) {
                toast.error("Not a valid GitHub URL");
                return false;
            }
            if (l && !l.toLowerCase().includes("linkedin.com")) {
                toast.error("Not a valid LinkedIn URL");
                return false;
            }
            if (lc && !lc.toLowerCase().includes("leetcode.com")) {
                toast.error("Not a valid LeetCode URL");
                return false;
            }
            return true;
        };

        if (!validateLinks()) return;

        try {
            const payload = {
                name,
                college,
                address,
                bio,
                links,
            };
            const res = await axios.put(`${SERVER}/api/auth/me`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (res && res.data) {
                toast.success("Profile updated");
                // update auth context user without full reload
                await refreshUser();
                setEditing(false);
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to update profile");
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 bg-gradient-to-b from-slate-900 to-slate-800 text-foreground">
            <div className="max-w-4xl mx-auto bg-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <div className="mb-4">
                                <label className="text-sm text-muted-foreground">Name</label>
                            {!editing ? (
                                <div className="text-lg font-medium">{name || "-"}</div>
                            ) : (
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-2 w-full p-2 rounded bg-card text-foreground"
                                />
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-muted-foreground">Email</label>
                            <div className="text-lg font-medium">{email || "-"}</div>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-muted-foreground">College</label>
                            {!editing ? (
                                <div className="text-lg font-medium">{college || "-"}</div>
                            ) : (
                                <input
                                    value={college}
                                    onChange={(e) => setCollege(e.target.value)}
                                    className="mt-2 w-full p-2 rounded bg-card text-foreground"
                                />
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-muted-foreground">Address</label>
                            {!editing ? (
                                <div className="text-lg font-medium">{address || "-"}</div>
                            ) : (
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="mt-2 w-full p-2 rounded bg-card text-foreground"
                                />
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-muted-foreground">Bio</label>
                            {!editing ? (
                                <div className="text-base">{bio || "-"}</div>
                            ) : (
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="mt-2 w-full p-2 rounded bg-card text-foreground min-h-[80px]"
                                />
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-muted-foreground">Important Links</label>
                            {!editing ? (
                                <div className="flex flex-col gap-1 mt-2">
                                    {links?.github && (
                                        <a href={links.github} target="_blank" rel="noreferrer" className="text-primary underline">GitHub</a>
                                    )}
                                    {links?.linkedin && (
                                        <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-primary underline">LinkedIn</a>
                                    )}
                                    {links?.leetcode && (
                                        <a href={links.leetcode} target="_blank" rel="noreferrer" className="text-primary underline">LeetCode</a>
                                    )}
                                    {links?.website && (
                                        <a href={links.website} target="_blank" rel="noreferrer" className="text-primary underline">Website</a>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-2 space-y-2">
                                    <input
                                        placeholder="GitHub URL"
                                        value={links.github || ""}
                                        onChange={(e) => setLinks(prev => ({...prev, github: e.target.value}))}
                                        className="w-full p-2 rounded bg-card text-foreground placeholder-black placeholder-opacity-100"
                                    />
                                    <input
                                        placeholder="LinkedIn URL"
                                        value={links.linkedin || ""}
                                        onChange={(e) => setLinks(prev => ({...prev, linkedin: e.target.value}))}
                                        className="w-full p-2 rounded bg-card text-foreground placeholder-black placeholder-opacity-100"
                                    />
                                    <input
                                        placeholder="LeetCode URL"
                                        value={links.leetcode || ""}
                                        onChange={(e) => setLinks(prev => ({...prev, leetcode: e.target.value}))}
                                        className="w-full p-2 rounded bg-card text-foreground placeholder-black placeholder-opacity-100"
                                    />
                                    <input
                                        placeholder="Website URL"
                                        value={links.website || ""}
                                        onChange={(e) => setLinks(prev => ({...prev, website: e.target.value}))}
                                        className="w-full p-2 rounded bg-card text-foreground placeholder-black placeholder-opacity-100"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-4">
                            {!editing ? (
                                <>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="bg-primary hover:brightness-90 px-4 py-2 rounded text-primary-foreground"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => logout()}
                                        className="bg-destructive hover:brightness-90 px-4 py-2 rounded text-destructive-foreground"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <aside className="w-full md:w-64">
                        <div className="bg-card p-4 rounded">
                            <h3 className="font-semibold mb-2">Actions</h3>
                            <nav className="flex flex-col gap-2">
                                <NavLink to="/camera-checkup" className="text-sm text-muted-foreground hover:text-foreground">Camera Check</NavLink>
                                <NavLink to="/interview" className="text-sm text-muted-foreground hover:text-foreground">Start Interview</NavLink>
                                <NavLink to="/report" className="text-sm text-muted-foreground hover:text-foreground">View Reports</NavLink>
                            </nav>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
