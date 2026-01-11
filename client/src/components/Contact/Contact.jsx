import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";
import { ButtonGlow } from "@/components/magicui/button-glow";
import MeteorBackground from "@/components/magicui/meteors";

const Contact = () => {
      return (
            <div className="relative min-h-screen bg-background text-foreground pt-16 width-screen">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3730a3,#312e81,#1f2937)]" />
                  <MeteorBackground />

                  <div className="relative container mx-auto px-6 py-24">
                        <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="max-w-lg mx-auto"
                        >
                              <div className="flex items-center justify-center gap-2 mb-6">
                                    <MessageSquare className="w-6 h-6 text-primary" />
                                    <h1 className="text-3xl font-bold text-foreground">
                                          Get in Touch
                                    </h1>
                              </div>

                              <div
                                    className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border"
                                    onClick={() =>
                                          window.open(
                                                "https://codolio.com/profile/oushnik_20"
                                          )
                                    }
                              >
                                    <ButtonGlow className="w-full flex items-center justify-between">
                                          <span className="text-xl">
                                                connect@Oushnik20{" "}
                                          </span>
                                          <Send className="ml-2 h-4 w-4" />
                                    </ButtonGlow>
                              </div>
                        </motion.div>
                  </div>
            </div>
      );
};

export default Contact;
