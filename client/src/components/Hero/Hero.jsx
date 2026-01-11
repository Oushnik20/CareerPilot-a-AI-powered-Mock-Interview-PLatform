import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Brain, Terminal, ArrowRight, GitBranch } from "lucide-react";
import { ButtonGlow } from "@/components/magicui/button-glow";
import Sparkles from "@/components/magicui/sparkles-text";
import MeteorBackground from "@/components/magicui/meteors";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay }}
		className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border hover:border-primary/50 transition-colors"
	>
		<div className="flex justify-center mb-4">
			<Icon className="w-8 h-8 text-primary" />
		</div>
		<h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
		<p className="text-muted-foreground">{description}</p>
	</motion.div>
);

const Hero = () => {
	const { isAuthenticated } = useContext(AuthContext);

	return (
		<AnimatePresence>
			<div className="relative min-h-screen bg-background overflow-hidden">
				{/* Background Effects */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3730a3,#312e81,#1f2937)]" />
				<MeteorBackground />

				{/* Content */}
				<div className="relative container mx-auto px-6 pt-32 pb-24">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="max-w-4xl mx-auto text-center"
					>
						<div className="flex items-center justify-center gap-2 mb-6">
							<Terminal className="w-6 h-6 text-primary" />
							<span className="text-primary font-medium">
								CareerPilot
							</span>
						</div>

						<Sparkles
							className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text text-white bg-gradient-to-r from-indigo-400 to-purple-400 mb-8 "
							text="Master Your Tech Interview With AI"
						/>

						<p className="text-lg md:text-xl text-neutral-900 mb-2 mx-auto max-w-2xl">
							Practice technical interviews with our advanced AI
							interviewer. Choose your tech stack, showcase your
							projects, and get detailed feedback in real-time.
						</p>
						<br />
						<p className="text-lg md:text-xl text-neutral-900 mb-12 mx-auto max-w-2xl">
							<code>Recommended Browser: Chrome, Edge, Brave</code>
						</p>

						<div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
							{!isAuthenticated ? (
								<>
									<NavLink to="/details">
										<ButtonGlow>
											Continue as Guest
											<ArrowRight className="ml-2 w-4 h-4" />
										</ButtonGlow>
									</NavLink>
									<NavLink to="/login">
										<ButtonGlow>Sign In</ButtonGlow>
									</NavLink>
								</>
							) : (
								<NavLink to="/details">
									<ButtonGlow>
										Start Your Interview
										<ArrowRight className="ml-2 w-4 h-4" />
									</ButtonGlow>
								</NavLink>
							)}
						</div>

						{/* Features */}
						<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
							<FeatureCard
								icon={Code2}
								title="Live Coding"
								description="Built-in code editor with real-time execution and syntax highlighting."
								delay={0.2}
							/>
							<FeatureCard
								icon={Brain}
								title="AI Feedback"
								description="Get instant analysis and personalized improvement suggestions."
								delay={0.4}
							/>
							<FeatureCard
								icon={GitBranch}
								title="Project Review"
								description="Share your projects for comprehensive technical evaluation."
								delay={0.6}
							/>
						</div>
					</motion.div>
				</div>
			</div>
		</AnimatePresence>
	);
};

export default Hero;
