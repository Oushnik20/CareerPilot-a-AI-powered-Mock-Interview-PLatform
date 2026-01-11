package utils

import (
	"regexp"
	"strings"

	"github.com/rnkp755/mockinterviewBackend/models"
)

func ExtractPartsFromGroqResponse(response string) (models.ExtractedResponse, error) {
	result := models.ExtractedResponse{}

	reQuestion := regexp.MustCompile(`<Question>(.*?)</Question>`)
	reCode := regexp.MustCompile(`<Code>(.*?)</Code>`)
	reRating := regexp.MustCompile(`<Rating>(.*?)</Rating>`)
	reFeedback := regexp.MustCompile(`<Feedback>(.*?)</Feedback>`)

	if m := reQuestion.FindStringSubmatch(response); len(m) > 1 {
		result.Question = strings.TrimSpace(m[1])
	}
	if m := reCode.FindStringSubmatch(response); len(m) > 1 {
		result.Code = strings.TrimSpace(m[1])
	}
	if m := reRating.FindStringSubmatch(response); len(m) > 1 {
		result.Rating = strings.TrimSpace(m[1])
	}
	if m := reFeedback.FindStringSubmatch(response); len(m) > 1 {
		result.Feedback = strings.TrimSpace(m[1])
	}

	return result, nil
}
