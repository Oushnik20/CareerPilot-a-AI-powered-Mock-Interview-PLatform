import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
    ChevronDown,
    CircleCheck,
    Sun,
    MoonIcon,
    Play,
    Pause,
    RotateCcw,
} from "lucide-react";
import {
    languageOptions,
    codeSnippets,
    judge0APIKEY,
    judge0ResponseIDs,
} from "./constants.js";

const Ide = ({ code, setCode, hasCodeChanged, setHasCodeChanged }) => {
    const [theme, setTheme] = useState("hc-black");
    const [languageIDX, setLanguageIDX] = useState(0);
    const [isCodeRunning, setIsCodeRunning] = useState(false);
    const [outputStatus, setOutputStatus] = useState("Not Submitted");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState({
        Time: "",
        Memory: "",
        Output: "",
    });

    useEffect(() => {
        setCode(codeSnippets[languageOptions[languageIDX].id]);
    }, []);

    useEffect(() => {
        setHasCodeChanged(
            code !== codeSnippets[languageOptions[languageIDX].id]
        );
    }, [code]);

    const toggleTheme = () => {
        setTheme((prevTheme) =>
            prevTheme === "hc-black" ? "light" : "hc-black"
        );
    };

    const handleLanguageChange = async (idx) => {
        setLanguageIDX(idx);
        setCode(codeSnippets[languageOptions[idx].id]);
    };

    const submitCode = async () => {
        try {
            const judge0LanguageId = languageOptions[languageIDX].id;
            const encodedCode = btoa(code);
            const encodedInput = btoa(input);

            const response = await axios.post(
                "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*",
                {
                    language_id: judge0LanguageId,
                    source_code: encodedCode,
                    stdin: encodedInput,
                },
                {
                    headers: {
                        "x-rapidapi-key": judge0APIKEY,
                        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                        "content-type": "application/json",
                        accept: "*/*",
                    },
                }
            );
            setOutputStatus("Submitted");
            setTimeout(() => {
                fetchOutput(response.data.token);
            }, 2000);
        } catch (error) {
            console.log(error);
            setIsCodeRunning(false);
            setOutputStatus("Not Submitted");
        }
    };
    const fetchOutput = async (token) => {
        try {
            const response = await axios.get(
                `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`,
                {
                    headers: {
                        "x-rapidapi-key": judge0APIKEY,
                        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                        accept: "*/*",
                    },
                }
            );
            if (response.data.status.id <= 2) {
                setTimeout(() => {
                    fetchOutput(token);
                }, 1000);
            } else {
                console.log(response.data);
                setOutputStatus(response.data.status.description);
                setOutput({
                    Time: response.data.time,
                    Memory: response.data.memory,
                    Output:
                        atob(response.data.stdout) ||
                        atob(response.data.stderr),
                });
                setIsCodeRunning(false);
            }
        } catch (error) {
            console.log(error);
            setIsCodeRunning(false);
            setOutputStatus("Not Submitted");
        }
    };

    const runCode = async () => {
        setIsCodeRunning(true);
        await submitCode();
    };

    return (
        <div>
            <div className="flex justify-between mx-8 py-1">
                <Menu>
                    <MenuButton className="min-w-56 inline-flex justify-between items-center gap-2 rounded-t-md bg-card py-1.5 px-3 text-sm/6 font-semibold text-foreground shadow-inner shadow-white/5 focus:outline-none data-[hover]:bg-card/95 data-[open]:bg-card/95 data-[focus]:outline-1 data-[focus]:outline-primary">
                            <span>
                            {languageOptions[languageIDX].label} &nbsp;{" "}
                            <span className="font-light text-xs">
                                {languageOptions[languageIDX].version}
                            </span>
                        </span>
                        <ChevronDown className="size-6 text-muted-foreground" />
                    </MenuButton>
                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-56 left-7 origin-top-right rounded-b-xl border border-white/5 bg-card p-1 text-sm/6 text-justify text-foreground transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        {languageOptions.map((language, index) => (
                            <MenuItem key={index}>
                                <button
                                    className={`group flex justify-between w-full items-center gap-2 rounded-lg py-1.5 px-3 ${
                                        languageIDX === index
                                            ? "bg-blue-500"
                                            : "data-[focus]:bg-primary/10"
                                    }`}
                                    onClick={() => handleLanguageChange(index)}
                                >
                                    <span>
                                        {language.label} &nbsp;{" "}
                                        <span className="font-light text-xs">
                                            {language.version}
                                        </span>
                                    </span>
                                    {languageIDX === index && (
                                        <CircleCheck className="size-6 text-primary" />
                                    )}
                                </button>
                            </MenuItem>
                        ))}
                    </MenuItems>
                </Menu>
                    <div className="flex items-center gap-2">
                    <div onClick={toggleTheme}>
                        {theme === "hc-black" ? (
                            <Sun className="size-8 text-muted-foreground p-1 cursor-pointer hover:text-foreground hover:bg-card/75 rounded-full transition-all" />
                        ) : (
                            <MoonIcon className="size-8 text-muted-foreground p-1 cursor-pointer hover:text-foreground hover:bg-card/75 rounded-full transition-all" />
                        )}
                    </div>
                    <div
                        onClick={() =>
                            setCode(
                                codeSnippets[languageOptions[languageIDX].id]
                            )
                        }
                    >
                        <RotateCcw
                            className="size-8 p-1 cursor-pointer hover:bg-card/75 rounded-full transition-all text-muted-foreground"
                        />
                    </div>
                    <div onClick={runCode}>
                        {isCodeRunning ? (
                            <Pause className="size-8 text-muted-foreground p-1 cursor-pointer hover:text-foreground hover:bg-card/75 rounded-full transition-all" />
                        ) : (
                            <Play className="size-8 text-muted-foreground p-1 cursor-pointer hover:text-foreground hover:bg-card/75 rounded-full transition-all" />
                        )}
                    </div>
                </div>
            </div>
            <Editor
                height="50vh"
                language={languageOptions[languageIDX].value}
                theme={theme}
                value={code}
                onChange={(value) => setCode(value.trim())}
            />
            <div className="flex gap-1 m-2">
                <div
                    className={`${
                        outputStatus !== "Not Submitted"
                            ? "min-w-[50%]"
                            : "min-w-full"
                    }`}
                >
                    <label
                        htmlFor="message"
                        className="block mb-2 mx-1 text-sm font-medium text-foreground"
                    >
                        Input (If any)
                    </label>
                    <textarea
                        id="message"
                        rows="4"
                        className={`min-h-40 block p-2.5 w-full text-sm rounded-lg ${
                            theme === "light"
                                ? "text-foreground bg-card border border-muted-foreground/20 focus:ring-primary focus:border-primary"
                                : "bg-card border border-white/5 placeholder-muted-foreground text-foreground focus:ring-primary focus:border-primary"
                        }`}
                        placeholder="Write your input here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></textarea>
                </div>
                {outputStatus !== "Not Submitted" && (
                    <div className="min-w-[50%] min-h-full overflow-y-hidden">
                        <div className="flex justify-between mx-1">
                            <label
                                htmlFor="message"
                                className="block mb-2 text-sm font-medium text-foreground"
                            >
                                Output
                            </label>
                            <div
                                className={`${
                                    outputStatus === "Submitted" ||
                                    outputStatus === "Accepted" ||
                                    outputStatus === "Processing"
                                        ? "text-green-500"
                                        : "text-red-500"
                                } font-semibold font-xl`}
                            >
                                {outputStatus}
                            </div>
                        </div>
                        <div
                            id="message"
                            className={`min-h-40 block p-2.5 w-full text-sm rounded-lg overflow-y-scroll ${
                                theme === "light"
                                    ? "text-foreground bg-card border border-muted-foreground/20 focus:ring-primary focus:border-primary"
                                    : "bg-card border border-white/5 placeholder-muted-foreground text-foreground focus:ring-primary focus:border-primary"
                            }`}
                        >
                            <div className="flex gap-1">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium ">
                                        Time
                                    </label>
                                    <div className="text-xs ">
                                        {output.Time * 1000} ms
                                    </div>
                                </div>
                                <div className="flex-1 text-right">
                                    <label className="block text-xs font-medium ">
                                        Memory
                                    </label>
                                    <div className="text-xs ">
                                        {output.Memory / 1000} KB
                                    </div>
                                </div>
                            </div>
                            <hr className={`h-px my-2 border-0 bg-muted-foreground`} />
                            <div className="text-left">{output.Output}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ide;
