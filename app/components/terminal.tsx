"use client";

import { useState } from 'react';

const TYPING_SPEED = 25; // Speed of typing animation (ms)
const LINE_DELAY = 25; // Delay between lines (ms)

const Terminal = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string[]>([]);
    const [isCommandRunning, setIsCommandRunning] = useState(false); // New state

    const commands: Record<string, string> = {
        help: `
            Available commands:
            - help: List all commands
            - projects: List my projects
            - education: Show my education history
            - work: Show previous work experience
            - certifications: Show certifications
        `,
        projects: `
            Projects:
            - Portfolio Website
            - Minecraft Q/A Chatbot
            - Video Conferencing Application
        `,
        education: `
            Education:
            - M.S. Computer Science - University of Texas at Dallas (2024)
            - B.S. Computer Science - University of Texas at Dallas (2022)
        `,
        work: `
            Work Experience:
            - Software Engineer at E-MetroTel (2022-2023)
            - Software Developer Intern at E-MetroTel (2022)
        `,
        certifications: `
            Certifications:
            - AWS Certified Cloud Practitioner (2024)
        `,
    };

    const handleCommand = (command: string) => {
        if (isCommandRunning) return; // Prevent submitting new command if one is running

        const commandOutput = commands[command] ? commands[command].trim().split('\n') : ['Command not found. Type "help" for a list of commands.'];
        addOutput(`> ${command}`);
        setIsCommandRunning(true); // Disable input during command execution
        animateLines(commandOutput);
        setInput(''); // Clear input after execution
    };

    const addOutput = (text: string) => {
        setOutput(prev => [...prev, text]);
    };

    const animateText = (text: string, callback: () => void) => {
        let currentIndex = 0;
        const fullText = text + "\n";

        const typingInterval = setInterval(() => {
            if (currentIndex < fullText.length) {
                setOutput(prev => {
                    const newOutput = [...prev];
                    newOutput[newOutput.length - 1] = fullText.slice(0, currentIndex + 1);
                    return newOutput;
                });
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                callback();
            }
        }, TYPING_SPEED);
    };

    const animateLines = (lines: string[]) => {
        let lineIndex = 0;

        const typeNextLine = () => {
            if (lineIndex < lines.length) {
                const currentLine = lines[lineIndex]?.trim();
                if (currentLine) {
                    addOutput(""); // Add an empty line before the current line
                    animateText(currentLine, () => {
                        lineIndex++;
                        setTimeout(typeNextLine, LINE_DELAY);
                    });
                } else {
                    lineIndex++;
                    setTimeout(typeNextLine, LINE_DELAY);
                }
            } else {
                setIsCommandRunning(false); // Re-enable input once animation completes
            }
        };

        typeNextLine();
    };

    const handleCommandClick = (command: string) => {
        if (isCommandRunning) return; // Prevent command clicks if a command is running
        handleCommand(command); // Execute the command directly when button is clicked
    };

    return (
        <div>
            <div className="bg-black text-green-500 font-mono p-4 rounded-lg w-full min-w-[100vh] max-w-6xl min-h-[70vh] overflow-y-auto">
                <div>
                    {output.map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleCommand(input); }}>
                    <div className="flex">
                        <span className="mr-2">{'>'}</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-black text-green-500 outline-none flex-grow"
                            autoFocus
                            disabled={isCommandRunning} // Disable input if a command is running
                        />
                    </div>
                </form>
            </div>

            <div className="mt-4 p-2">
                <p className="text-white">Click a command to execute:</p>
                <div className="flex flex-wrap">
                    {Object.keys(commands).map((command) => (
                        <button
                            key={command}
                            onClick={() => handleCommandClick(command)}
                            className={`bg-green-600 text-black rounded p-2 m-2 hover:bg-green-500 transition-colors ${isCommandRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isCommandRunning} // Disable buttons if a command is running
                        >
                            {command}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Terminal;
