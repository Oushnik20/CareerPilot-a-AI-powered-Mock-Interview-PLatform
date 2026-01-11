package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name      string             `json:"name" bson:"name"`
	Email     string             `json:"email" bson:"email"`
	Password  string             `json:"password,omitempty" bson:"password,omitempty"`
	CreatedAt time.Time          `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
	// Profile fields
	College string            `json:"college,omitempty" bson:"college,omitempty"`
	Address string            `json:"address,omitempty" bson:"address,omitempty"`
	Bio     string            `json:"bio,omitempty" bson:"bio,omitempty"`
	Links   map[string]string `json:"links,omitempty" bson:"links,omitempty"`
}
