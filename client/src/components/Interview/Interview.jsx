import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LOCAL_SERVER } from "@/constant.js";
import { mediapipeResponse } from "@/components/Camera/mediapipeResponse.js";
import Interviewer from "@/assets/interviewer_1.mp4";
import Camera from "../Camera/Camera.jsx";
import { Speaker, Ide } from "..";
import ShinyButton from "@/components/magicui/shiny-button";

const Interview = () => {
    const SERVER = useMemo(
        () => import.meta.env.VITE_SERVER || LOCAL_SERVER,
        []
    );
    const videoRef = useRef(null);

    const FIRST_QUESTION = "Tell me about yourself and your technical background.";
    const [gettingAIResponse, setGettingAIResponse] = useState(false);
    const [aiResponse, setAIResponse] = useState(FIRST_QUESTION);


    const [cameraStatus, setCameraStatus] = useState(
        new mediapipeResponse(false, "Analysing your stream", "info")
    );
    const [interviewerStatus, setInterviewerStatus] = useState("waiting");
    const [speakerStatus, setSpeakerStatus] = useState("");
    const [userTranscript, setUserTranscript] = useState("");
    const [ideEnabled, setIdeEnabled] = useState(false);
    const [code, setCode] = useState("");
    const [hasCodeChanged, setHasCodeChanged] = useState(false);
    const isRequestInProgress = useRef(false);

    const navigate = useNavigate();

    const transcribeAudio = async (audioFile) => {
        try {
            const formData = new FormData();
            formData.append("audio", audioFile);

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/transcribe`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            return data.text;
        } catch (err) {
            console.error("Transcription failed:", err);
            return "";
        }
    };


    const fetchAIResponse = async () => {
    if (isRequestInProgress.current) {
        console.log("AI request already in progress. Skipping...");
        return;
    }

    isRequestInProgress.current = true;

    if (!userTranscript && !hasCodeChanged) {
        console.log("No answer yet. Skipping AI call.");
        isRequestInProgress.current = false;
        return;
    }

    try {
        const sessionId = localStorage.getItem("_id");
        if (!sessionId) {
            navigate("/details", {
                state: {
                    message:
                        "Please go through all the required processes before starting an interview session",
                },
            });

            // 🔥 IMPORTANT: release lock before exit
            isRequestInProgress.current = false;
            return;
        }

        setGettingAIResponse(true);
        setAIResponse("Looking for a response...");

        console.log("User Transcript: ", userTranscript);

        let payload = "";
        if (userTranscript !== "") payload = userTranscript;
        if (hasCodeChanged) payload += "\n" + code;

        console.log("Payload: ", payload);

        const formData = new FormData();
        formData.append("answer", payload);

        const response = await axios.post(
            `${SERVER}/api/v1/ask-to-gemini/${sessionId}`,
            formData
        );

        const msg = response.data?.data || "Error fetching AI Response";
        setAIResponse(msg.question);

        if (msg.code) {
            setCode(msg.code);
            setIdeEnabled(true);
        }

        setInterviewerStatus("speaking");
    } catch (error) {
        const status = error?.response?.status;
        let msg =
            error?.response?.data?.message ||
            error.message ||
            "Error fetching Gemini Response";

        if (status === 429) {
            msg = "⚠️ AI quota exceeded. Please try again later or continue the interview without AI feedback.";
        }

        console.error("AI Error:", msg);
        setAIResponse(msg);
        setInterviewerStatus("speaking");
    }
    finally {
            isRequestInProgress.current = false;
            setGettingAIResponse(false);
        }
    };



    const endInterview = async () => {
        //localStorage.removeItem("_id");
        navigate("/report", {
            state: {
                message:
                    "Interview session ended. You can now view your report",
            },
        });
        return;
    };

    // useEffect(() => {
    //     fetchaiResponse();
    // }, []);

    useEffect(() => {
        if (speakerStatus === "ended") {
            setInterviewerStatus("listening");
        }
    }, [speakerStatus]);

    useEffect(() => {
        const video = videoRef.current;

        if (video) {
            if (interviewerStatus === "speaking") {
                video.play();
            } else {
                video.pause();
            }
        }
    }, [interviewerStatus]);

    const handleSubmit = async () => {
        setInterviewerStatus("analyzing");
        await fetchAIResponse();
        setUserTranscript("");
    };

    const RecordButton = ({ onTranscribed }) => {
        const [recording, setRecording] = useState(false);
        const mediaRecorderRef = useRef(null);
        const chunksRef = useRef([]);

        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                chunksRef.current = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunksRef.current.push(e.data);
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
                    const file = new File([audioBlob], "answer.webm", { type: "audio/webm" });

                    const formData = new FormData();
                    formData.append("audio", file);

                    const res = await fetch("http://localhost:8080/api/v1/transcribe", {
                        method: "POST",
                        body: formData,
                    });

                    const data = await res.json();
                    onTranscribed(data.text || "");
                };

                mediaRecorder.start();
                setRecording(true);
            } catch (err) {
                console.error("Microphone access denied:", err);

                alert(
                    "🎤 Microphone permission denied.\n\n" +
                    "Please:\n" +
                    "1️⃣ Click the lock icon in the address bar\n" +
                    "2️⃣ Allow Microphone access\n" +
                    "3️⃣ Reload the page"
                );
            }
        };


        const stopRecording = () => {
            mediaRecorderRef.current.stop();
            setRecording(false);
        };

        return (
            <div className="flex gap-4">
                {!recording ? (
                    <button
                        onClick={startRecording}
                        className="px-4 py-2 rounded bg-primary text-primary-foreground"
                    >
                        🎤 Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="px-4 py-2 rounded bg-destructive text-white"
                    >
                        ⏹ Stop
                    </button>
                )}
            </div>
        );
    };


    return (
        <div className="min-h-screen flex flex-col items-center bg-background text-foreground px-4 pt-20 pb-12">
            {/* API Response Section */}
            <div className="w-full max-h-24 overflow-y-auto bg-card p-4 rounded-md mb-4 text-left text-base">
                {!gettingAIResponse &&
                aiResponse !== "Looking for a response..." ? (
                    <p>{aiResponse}</p>
                ) : (
                    <p>Fetching AI Response...</p>
                )}
                {/* Toaster is mounted globally in App.jsx */}
            </div>

            {interviewerStatus === "waiting" && (
                <div className="mt-6">
                    <div onClick={() => setInterviewerStatus("speaking")}>
                        <ShinyButton
                            text="Start Interview"
                            className="text-primary-foreground bg-primary"
                        />
                    </div>
                </div>
            )}

            <div className="flex min-w-full">
                {/* Video and Camera Section */}
                <div
                    className={`${
                        ideEnabled ? "flex-col w-1/4 mr-4" : "flex w-full"
                    } justify-center items-center gap-4 flex-grow transition-all duration-500`}
                >
                    {/* Video Section */}
                    <div
                        className={`flex-col items-center justify-center ${
                            ideEnabled ? "w-full py-4" : "w-1/2 py-8 h-[70vh]"
                        } bg-card rounded-lg px-4 `}
                    >
                        {interviewerStatus !== "waiting" ? (
                            <>
                                <video
                                    ref={videoRef}
                                    className="w-full rounded-md"
                                    src={Interviewer}
                                    preload="metadata"
                                    muted
                                />
                                {interviewerStatus === "speaking" &&
                                    aiResponse && (
                                        <Speaker
                                            key={aiResponse}
                                            response={aiResponse}
                                            speakerStatus={speakerStatus}
                                            setSpeakerStatus={setSpeakerStatus}
                                        />
                                    )}
                            </>
                        ) : (
                            <div
                                role="status"
                                className="flex items-center justify-center h-40"
                            >
                                <span>Loading...</span>
                            </div>
                        )}
                    </div>

                    {/* Camera Section */}
                    <div
                        className={`flex flex-col items-center justify-center ${
                            ideEnabled ? "w-full mt-4" : "max-w-1/2 h-[70vh]"
                        } bg-card rounded-lg px-4 py-0 flex-grow `}
                    >
                        <Camera
                            cameraStatus={cameraStatus}
                            setCameraStatus={setCameraStatus}
                            marginY={16}
                        />
                        {/* Microphone Section */}
                        {/* {interviewerStatus === "listening" && (
                            <div className="w-full flex justify-around">
                                <MicroPhone
                                    setUserTranscript={setUserTranscript}
                                    setInterviewerStatus={setInterviewerStatus}
                                />
                            </div>
                        )} */}
                        {interviewerStatus === "listening" && (
                            <div className="w-full flex justify-around">
                                <RecordButton onTranscribed={(text) => setUserTranscript(text)} />
                            </div>
                        )}

                    </div>
                </div>
                {ideEnabled && (
                    <div className="w-3/4 bg-card rounded-lg p-4">
                        <Ide
                            code={code}
                            setCode={setCode}
                            hasCodeChanged={hasCodeChanged}
                            setHasCodeChanged={setHasCodeChanged}
                        />
                    </div>
                )}
            </div>
            <div className="flex w-full flex-wrap mt-4 justify-around">
                {interviewerStatus !== "waiting" && (
                    <>
                        <div onClick={() => setIdeEnabled(!ideEnabled)}>
                            <ShinyButton
                                text={`${ideEnabled ? "Close IDE" : "Launch IDE"}`}
                                className="text-primary-foreground bg-primary"
                            />
                        </div>

                        <div onClick={() => !gettingAIResponse && handleSubmit()}>
                            <ShinyButton
                                text={gettingAIResponse ? "Processing..." : "Submit Response"}
                                className="text-primary-foreground bg-primary"
                                disabled={gettingAIResponse}
                            />
                        </div>

                        <div onClick={() => endInterview()}>
                            <ShinyButton
                                text="End Interview"
                                className="text-primary-foreground bg-primary"
                            />
                        </div>
                    </>
                )}
            </div>

            {/* TEMP: Audio Upload for Whisper */}
            {/* <div className="w-full max-w-md mt-4">
                <input
                    type="file"
                    accept="audio/*"
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const text = await transcribeAudio(file);
                        setUserTranscript(text);
                    }}
                    className="block w-full text-sm text-foreground"
                />
            </div> */}

            {/* User Transcript Section */}
            {userTranscript && (
                <div className="w-full mt-4">
                    <label className="block text-sm text-muted-foreground mb-2">
                        Edit your answer before submitting:
                    </label>
                    <textarea
                        value={userTranscript}
                        onChange={(e) => setUserTranscript(e.target.value)}
                        rows={4}
                        className="w-full p-3 rounded-md bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="You can modify or add more details here..."
                    />
                </div>
            )}

        </div>
    );
};

export default Interview;
