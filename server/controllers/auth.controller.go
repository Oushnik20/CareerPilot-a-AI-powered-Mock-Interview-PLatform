package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
	"github.com/rnkp755/mockinterviewBackend/db"
	"github.com/rnkp755/mockinterviewBackend/models"
	"github.com/rnkp755/mockinterviewBackend/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var UserCollection *mongo.Collection

func init() {
	if os.Getenv("DB_NAME") != "production" {
		_ = godotenv.Load()
	}

	col := os.Getenv("USER_COLLECTION_NAME")
	if col == "" {
		col = "users"
	}

	UserCollection = db.ConnectToDb(col)
}

type registerPayload struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")

	var payload registerPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if payload.Name == "" || payload.Email == "" || payload.Password == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Name, email and password are required")
		return
	}

	// check if user exists
	var existing models.User
	err := UserCollection.FindOne(context.TODO(), bson.M{"email": payload.Email}).Decode(&existing)
	if err == nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Email already registered")
		return
	}
	if err != nil && err != mongo.ErrNoDocuments {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Database error")
		return
	}

	// hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("bcrypt error:", err)
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	user := models.User{
		ID:        primitive.NewObjectID(),
		Name:      payload.Name,
		Email:     payload.Email,
		Password:  string(hashed),
		CreatedAt: time.Now(),
	}

	_, err = UserCollection.InsertOne(context.TODO(), user)
	if err != nil {
		log.Println("insert user error:", err)
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to register user")
		return
	}

	// Return user info without password
	user.Password = ""
	utils.SuccessResponse(w, "User registered successfully", user)
}

type loginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")

	var payload loginPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if payload.Email == "" || payload.Password == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Email and password are required")
		return
	}

	var user models.User
	err := UserCollection.FindOne(context.TODO(), bson.M{"email": payload.Email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			utils.ErrorResponse(w, http.StatusUnauthorized, "Invalid credentials")
			return
		}
		utils.ErrorResponse(w, http.StatusInternalServerError, "Database error")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password)); err != nil {
		utils.ErrorResponse(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	// generate jwt
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		utils.ErrorResponse(w, http.StatusInternalServerError, "JWT secret not configured")
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.ID.Hex(),
		"exp":    time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	user.Password = ""
	resp := map[string]interface{}{
		"token": tokenString,
		"user":  user,
	}

	utils.SuccessResponse(w, "Login successful", resp)
}

func Me(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userId, ok := r.Context().Value("userId").(string)
	if !ok || userId == "" {
		utils.ErrorResponse(w, http.StatusUnauthorized, "Unauthenticated")
		return
	}

	objID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid user id")
		return
	}

	var user models.User
	err = UserCollection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			utils.ErrorResponse(w, http.StatusNotFound, "User not found")
			return
		}
		utils.ErrorResponse(w, http.StatusInternalServerError, "Database error")
		return
	}

	user.Password = ""
	utils.SuccessResponse(w, "User fetched", user)
}

// UpdateMe updates the authenticated user's profile
func UpdateMe(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userId, ok := r.Context().Value("userId").(string)
	if !ok || userId == "" {
		utils.ErrorResponse(w, http.StatusUnauthorized, "Unauthenticated")
		return
	}

	objID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid user id")
		return
	}

	var payload map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Prevent updating restricted fields
	delete(payload, "_id")
	delete(payload, "id")
	delete(payload, "password")
	delete(payload, "createdAt")

	// Allowed fields: name, college, address, bio, links (map)
	update := bson.M{}
	allowed := []string{"name", "college", "address", "bio", "links"}
	for _, k := range allowed {
		if v, ok := payload[k]; ok {
			update[k] = v
		}
	}

	if len(update) == 0 {
		utils.ErrorResponse(w, http.StatusBadRequest, "No updatable fields provided")
		return
	}

	_, err = UserCollection.UpdateByID(context.TODO(), objID, bson.M{"$set": update})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to update user")
		return
	}

	var user models.User
	err = UserCollection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to fetch updated user")
		return
	}

	user.Password = ""
	utils.SuccessResponse(w, "User updated", user)
}
