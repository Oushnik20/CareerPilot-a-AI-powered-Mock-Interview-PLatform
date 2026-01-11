import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, RotateCcw } from "lucide-react";

const MicroPhone = (props) => {
  const {
    iconSize = 32,
    setUserTranscript = null,
    setInterviewerStatus = null,
  } = props;

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [browserSupport, setBrowserSupport] = useState(true);
  const [hasError, setHasError] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.warn("Browser doesn't support speech recognition.");
      setBrowserSupport(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setListening(true);
      console.log("Listening started...");
    };

    recognitionRef.current.onend = () => {
      setListening(false);
      console.log("Listening stopped...");
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t + " ";
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
    };

    // 🔥 IMPORTANT FIX: Handle network errors & stop retry loop
    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      setHasError(true);
      recognitionRef.current.stop();   // stop infinite restart loop
      setListening(false);

      if (event.error === "network") {
        alert(
          "Microphone speech recognition failed due to a network restriction.\n\n" +
          "This often happens on college WiFi, VPNs, or firewalls.\n\n" +
          "👉 Please type your answer instead."
        );
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Send transcript to parent
  useEffect(() => {
    if (setUserTranscript) {
      setUserTranscript(transcript);
    }
  }, [transcript, setUserTranscript]);

  const startListening = () => {
    if (recognitionRef.current && !hasError) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    setHasError(false);
  };

  if (!browserSupport) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center p-2">
        <div className="flex gap-5 justify-center items-center">
          {/* Mic toggle */}
          <div className="p-2 bg-card rounded-md cursor-pointer m-2 hover:shadow-[rgba(7,_65,_210,_0.5)_0px_9px_30px] text-primary-foreground">
            {listening ? (
              <Mic size={iconSize} onClick={stopListening} />
            ) : (
              <MicOff size={iconSize} onClick={startListening} />
            )}
          </div>

          {/* Reset transcript */}
          <div
            onClick={resetTranscript}
            className="px-2 pt-2 rounded-md bg-card hover:shadow-[rgba(7,_65,_210,_0.5)_0px_9px_30px] cursor-pointer text-primary-foreground"
          >
            <div className="py-1">
              <RotateCcw size={iconSize} />
            </div>
          </div>
        </div>

        {/* Show transcript only if parent is not controlling it */}
        {!setUserTranscript && (
          <p className="text-justify my-2 px-4 overflow-y-scroll capitalize text-foreground">
            {transcript}
          </p>
        )}
      </div>
    </div>
  );
};

export default MicroPhone;
