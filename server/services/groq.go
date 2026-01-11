package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type GroqMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GroqRequest struct {
	Model    string        `json:"model"`
	Messages []GroqMessage `json:"messages"`
}

type GroqResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// CallGroq sends a prompt to Groq and returns the generated text
func CallGroq(prompt string) (string, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GROQ_API_KEY not set")
	}

	fmt.Println("🔥 CallGroq() started")
	fmt.Println("📤 Prompt sent to Groq:\n", prompt)

	reqBody := GroqRequest{
		Model: "llama-3.3-70b-versatile",
		Messages: []GroqMessage{
			{Role: "user", Content: prompt},
		},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest(
		"POST",
		"https://api.groq.com/openai/v1/chat/completions",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)

	fmt.Println("📥 Raw Groq HTTP Status:", resp.Status)
	fmt.Println("📥 Raw Groq Response Body:\n", string(bodyBytes))

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("Groq API error: %s", string(bodyBytes))
	}

	var groqResp GroqResponse
	err = json.Unmarshal(bodyBytes, &groqResp)
	if err != nil {
		return "", err
	}

	if len(groqResp.Choices) == 0 {
		return "", fmt.Errorf("no choices returned by Groq")
	}

	output := groqResp.Choices[0].Message.Content
	if output == "" {
		return "", fmt.Errorf("Groq returned empty message")
	}

	fmt.Println("✅ Parsed Groq Output:\n", output)
	return output, nil
}
