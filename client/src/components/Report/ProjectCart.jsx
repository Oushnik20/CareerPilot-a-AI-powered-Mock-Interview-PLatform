import { motion } from "framer-motion";
import { Code2, Briefcase } from "lucide-react";

export const ProjectCard = ({ project }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg p-6 shadow-lg"
        >
            <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                    {project.title}
                </h3>
            </div>
            <p className="text-muted-foreground mb-4">{project.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
                <Code2 className="w-4 h-4 text-primary" />
                {project.techStacks.map((tech, index) => (
                    <span
                        key={index}
                        className="px-2 py-1 bg-card text-primary rounded-md text-sm"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};
