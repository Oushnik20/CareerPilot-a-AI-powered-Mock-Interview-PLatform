package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rnkp755/mockinterviewBackend/routes"
	"github.com/rs/cors"
)

func main() {
	fmt.Println("Starting the backend server for the mockinterview app...")

	// Initialize router
	r := routes.Router()

	// Load environment variables from the .env file
	// In a production environment (like Render), variables are set directly.
	// The .env file is only for local development.
	if os.Getenv("GO_ENV") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Println("Warning: Could not load .env file. Using environment variables from the system.")
		}
		fmt.Println("Environment variables loaded successfully")

	}

	// Retrieve port from environment variables (default to 8080 for local dev)
	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "8080"
		log.Println("PORT not set; defaulting to 8080")
	}

	// Configure CORS options
	// Build allowed origins list from env vars; always include localhost dev origins
	allowedOrigins := []string{}
	for _, k := range []string{"FRONTEND_URL_DEVELOPMENT", "FRONTEND_URL_PRODUCTION_ONE", "FRONTEND_URL_PRODUCTION_TWO"} {
		if v := os.Getenv(k); v != "" {
			allowedOrigins = append(allowedOrigins, v)
		}
	}
	// Helpful defaults for local development
	allowedOrigins = append(allowedOrigins, "http://localhost:5173", "http://127.0.0.1:5173", "https://career-pilot-a-ai-powered-mock-inte.vercel.app")

	c := cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Wrap router with CORS middleware
	handler := c.Handler(r)

	fmt.Println("Server is starting on port:", PORT)

	// Start the server
	if err := http.ListenAndServe(":"+PORT, handler); err != nil {
		log.Fatal("Failed to start the server:", err)
	}
}
