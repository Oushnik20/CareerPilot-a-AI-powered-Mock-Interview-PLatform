package routes

import (
	"net/http"
	"os"
	"os/exec"

	"github.com/gin-gonic/gin"
)

func TranscribeAudio(c *gin.Context) {
	// Get uploaded file
	file, err := c.FormFile("audio")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Audio file is required"})
		return
	}

	// Save file temporarily
	audioPath := "temp_audio.wav"
	if err := c.SaveUploadedFile(file, audioPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save audio file"})
		return
	}

	// Run Whisper CLI
	cmd := exec.Command("whisper", audioPath, "--model", "base", "--output_format", "txt", "--output_dir", ".")
	if err := cmd.Run(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Whisper transcription failed"})
		return
	}

	// Read the output text
	textBytes, err := os.ReadFile("temp_audio.txt")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read transcription"})
		return
	}

	// Cleanup temp files
	os.Remove(audioPath)
	os.Remove("temp_audio.txt")

	// Return transcription
	c.JSON(http.StatusOK, gin.H{
		"text": string(textBytes),
	})
}
