package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rnkp755/mockinterviewBackend/controllers"
	"github.com/rnkp755/mockinterviewBackend/middleware"
)

func Router() *mux.Router {
	router := mux.NewRouter()

	// Root health check for Render
	router.HandleFunc("/", controllers.HealthCheck).Methods("GET")
	router.HandleFunc("/health", controllers.HealthCheck).Methods("GET")

	router.HandleFunc("/api/v1/session", controllers.CreateSession).Methods("POST")
	router.HandleFunc("/api/v1/ask-to-gemini/{sessionId}", controllers.AskToGemini).Methods("POST")
	router.HandleFunc("/api/v1/end/{sessionId}", controllers.EndSession).Methods("POST")
	router.HandleFunc("/api/v1/health", controllers.HealthCheck).Methods("GET")

	router.HandleFunc("/api/v1/transcribe", controllers.TranscribeAudio).Methods("POST")

	// Auth routes
	router.HandleFunc("/api/auth/register", controllers.Register).Methods("POST")
	router.HandleFunc("/api/auth/login", controllers.Login).Methods("POST")

	// Protected route example -- wrap with JWT middleware
	authSub := router.PathPrefix("/api/auth").Subrouter()
	authSub.HandleFunc("/me", controllers.Me).Methods("GET")
	authSub.HandleFunc("/me", controllers.UpdateMe).Methods("PUT")
	authSub.Use(middleware.JWTMiddleware)

	// Ensure middleware is used for all routes where needed
	// For safety, apply JWT middleware globally for the router's handlers that check context.
	router.Use(func(next http.Handler) http.Handler {
		return middleware.JWTMiddleware(next)
	})

	return router
}
