package controllers

import (
	"encoding/json"
	"net/http"
	"os"
	"os/exec"
)

func TranscribeAudio(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form (20MB limit)
	err := r.ParseMultipartForm(20 << 20)
	if err != nil {
		http.Error(w, "Could not parse multipart form", http.StatusBadRequest)
		return
	}

	// Get uploaded audio file
	file, _, err := r.FormFile("audio")
	if err != nil {
		http.Error(w, "Audio file is required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create temp audio file
	tempFile, err := os.Create("temp_audio.wav")
	if err != nil {
		http.Error(w, "Failed to create temp file", http.StatusInternalServerError)
		return
	}
	defer tempFile.Close()

	// Copy uploaded audio to temp file
	_, err = tempFile.ReadFrom(file)
	if err != nil {
		http.Error(w, "Failed to save audio file", http.StatusInternalServerError)
		return
	}

	// Run Whisper via Python
	cmd := exec.Command(
		"python",
		"-m",
		"whisper",
		"temp_audio.wav",
		"--model", "base",
		"--output_format", "txt",
		"--output_dir", ".",
	)

	if err := cmd.Run(); err != nil {
		http.Error(w, "Whisper transcription failed", http.StatusInternalServerError)
		return
	}

	// Read transcription output
	textBytes, err := os.ReadFile("temp_audio.txt")
	if err != nil {
		http.Error(w, "Failed to read transcription", http.StatusInternalServerError)
		return
	}

	// Cleanup temp files
	os.Remove("temp_audio.wav")
	os.Remove("temp_audio.txt")

	// Send JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"text": string(textBytes),
	})
}
