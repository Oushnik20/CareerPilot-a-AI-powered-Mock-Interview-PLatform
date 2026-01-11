# 🚀 Mock Interview Platform – AI-Powered Technical Interview Simulator

An AI-driven mock interview platform that simulates real technical interviews using advanced language models, real-time voice transcription, facial analysis, and structured feedback. The system helps candidates practice technical interviews, receive instant feedback, and generate a detailed performance report at the end.

---

## 📌 What is This Project?

This project is a **full-stack AI mock interview platform** that allows users to:

- Enter personal and technical details  
- Start a simulated interview with an AI interviewer  
- Answer questions using **voice or text**  
- Receive **AI-generated feedback, ratings, and next questions**  
- Generate a **complete interview report** at the end  

It mimics a real technical interview experience by assessing:
- Problem-solving skills  
- Data structures & algorithms  
- System design thinking  
- Communication clarity  

---

## 🧠 How Is It Different?

✔ **Adaptive AI Interviewer**  
Questions evolve based on your previous answers and performance.

✔ **Voice-Based Answers (Whisper)**  
Record responses that are converted to text automatically.

✔ **Facial Monitoring (MediaPipe)**  
Simulates interview conditions by tracking face presence and behavior.

✔ **Structured Feedback**  
Each response includes:
- Rating  
- Positive points  
- Negative points  
- Improvements  

✔ **Auto-Generated Report**  
Full interview summary with PDF download.

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion
- MediaPipe
- Axios

### Backend
- Go (Golang)
- Gorilla Mux
- MongoDB
- Whisper (Speech-to-Text)
- Groq LLM API

### Deployment
- Backend: Render
- Frontend: Vercel / Netlify
- Database: MongoDB Atlas

---

## ✨ Features

- 🎤 Voice and text answering
- 🤖 AI-generated dynamic questions
- 📊 Ratings & structured feedback
- 🧠 Face monitoring during interview
- 📄 Auto-generated interview report
- 📥 PDF download
- 🔐 Secure interview session handling

---

## 📂 Project Structure

# 🚀 Mock Interview Platform – AI-Powered Technical Interview Simulator

An AI-driven mock interview platform that simulates real technical interviews using advanced language models, real-time voice transcription, facial analysis, and structured feedback. The system helps candidates practice technical interviews, receive instant feedback, and generate a detailed performance report at the end.

---

## 📌 What is This Project?

This project is a **full-stack AI mock interview platform** that allows users to:

- Enter personal and technical details  
- Start a simulated interview with an AI interviewer  
- Answer questions using **voice or text**  
- Receive **AI-generated feedback, ratings, and next questions**  
- Generate a **complete interview report** at the end  

It mimics a real technical interview experience by assessing:
- Problem-solving skills  
- Data structures & algorithms  
- System design thinking  
- Communication clarity  

---

## 🧠 How Is It Different?

✔ **Adaptive AI Interviewer**  
Questions evolve based on your previous answers and performance.

✔ **Voice-Based Answers (Whisper)**  
Record responses that are converted to text automatically.

✔ **Facial Monitoring (MediaPipe)**  
Simulates interview conditions by tracking face presence and behavior.

✔ **Structured Feedback**  
Each response includes:
- Rating  
- Positive points  
- Negative points  
- Improvements  

✔ **Auto-Generated Report**  
Full interview summary with PDF download.

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion
- MediaPipe
- Axios

### Backend
- Go (Golang)
- Gorilla Mux
- MongoDB
- Whisper (Speech-to-Text)
- Groq LLM API

### Deployment
- Backend: Render
- Frontend: Vercel / Netlify
- Database: MongoDB Atlas

---

## ✨ Features

- 🎤 Voice and text answering
- 🤖 AI-generated dynamic questions
- 📊 Ratings & structured feedback
- 🧠 Face monitoring during interview
- 📄 Auto-generated interview report
- 📥 PDF download
- 🔐 Secure interview session handling

---

## 📂 Project Structure

MockIntervPlat/
│
├── server/ # Go backend
│ ├── controllers/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ ├── models/
│ └── main.go
│
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── assets/
│ │ └── App.jsx
│
└── README.md


---

## ⚙️ How to Clone

```bash
git clone https://github.com/YOUR_USERNAME/mock-interview-platform.git
cd mock-interview-platform

▶️ How to Run Locally
1️⃣ Backend (Go)
cd server


Create .env inside server/:

PORT=8080
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
DB_NAME=development


Run server:

go run main.go


Backend runs at:

http://localhost:8080

2️⃣ Frontend (React)
cd frontend
npm install


Create .env:

VITE_SERVER=http://localhost:8080


Start frontend:

npm run dev


Frontend runs at:

http://localhost:5173

🎯 Interview Flow

User enters details

Session is created

First AI question is asked

User answers via voice or text

AI evaluates and asks next question

Repeat until interview ends

Final report is generated

📄 Interview Report Includes

Candidate details

Interview duration

Total questions

Per question:

Rating

Positive feedback

Negative feedback

Improvements

PDF download option

🔐 Environment Variables
Backend (server/.env)
PORT=8080
MONGO_URI=
GROQ_API_KEY=
DB_NAME=

Frontend (frontend/.env)
VITE_SERVER=http://localhost:8080

🚀 API Endpoints
Method	Endpoint	Description
POST	/api/v1/session	Create interview session
POST	/api/v1/ask-to-gemini/{id}	Send answer to AI
POST	/api/v1/transcribe	Voice to text
POST	/api/v1/end/{id}	End interview & get report
GET	/health	Health check
👨‍💻 Author

Oushnik Banerjee
$4th$ Year CS Student | Software Developer | Full Stack Developer
GitHub: https://github.com/Oushnik20

⭐ Future Enhancements

Authentication (Login/Signup)

Resume parsing

Multiple interview modes (DSA, System Design, HR)

Performance analytics dashboard

Emotion analysis

📜 License

Open-source project for educational and non-commercial use.


---
