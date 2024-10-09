"use client";

import { useState, useEffect, useRef } from 'react';

const TYPING_SPEED = 10; // Speed of typing animation (ms)
const LINE_DELAY = 25; // Delay between lines (ms)

const Terminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null); 
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string[]>([]);
    const [isCommandRunning, setIsCommandRunning] = useState(false); 
    const [lineHeight, setLineHeight] = useState(0); 

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

    // Measure line height after the component mounts
    useEffect(() => {
        if (terminalRef.current) {
            const tempElement = document.createElement('div');
            tempElement.style.fontFamily = 'monospace';
            tempElement.style.visibility = 'hidden'; 
            tempElement.innerHTML = 'M';
            terminalRef.current.appendChild(tempElement); 
            setLineHeight(tempElement.clientHeight); 
            terminalRef.current.removeChild(tempElement); 
        }
    }, []);

    // Calculate if the terminal will overflow with the new command's output
    const willOutputOverflow = (newLines: string[]) => {
        const terminalHeight = terminalRef.current?.clientHeight ?? 0;
        if (lineHeight === 0) return false; 
        const totalLines = output.length + newLines.length + 6; 
        return totalLines * lineHeight > terminalHeight;
    };

    /**
     * Handles the command logic by executing the given command string.
     * If a command is already running, it prevents further execution.
     * It checks if the terminal will overflow and handles command output animation.
     *
     * @param {string} command - The command to be executed.
     */
    const handleCommand = (command: string) => {
        if (isCommandRunning) return; 

        const commandOutput = commands[command] ? commands[command].trim().split('\n') : ['Command not found. Type "help" for a list of commands.'];

        // Check if the terminal will overflow with the new output
        if (willOutputOverflow(commandOutput)) {
            setOutput([]);
        }

        addOutput(`> ${command}`); 
        setIsCommandRunning(true); 
        animateLines(commandOutput); 
        setInput(''); 
    };

    /**
     * Adds the given text to the terminal output.
     *
     * @param {string} text - The text to add to the output.
     */
    const addOutput = (text: string) => {
        setOutput(prev => [...prev, text]);
    };

    /**
     * Animates the typing of the given text, calling the callback
     * once the animation is complete.
     *
     * @param {string} text - The text to animate.
     * @param {function} callback - The callback to execute after the animation.
     */
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

    /**
     * Animates the typing of each line in the provided array of lines.
     * It manages the timing and handles empty lines accordingly.
     *
     * @param {string[]} lines - The lines to animate.
     */
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

    /**
     * Handles the click event of a command button, executing the command
     * if no other command is currently running.
     *
     * @param {string} command - The command to execute.
     */
    const handleCommandClick = (command: string) => {
        if (isCommandRunning) return; // Prevent command clicks if a command is running
        handleCommand(command); // Execute the command directly when button is clicked
    };

    return (
        <div>
            <div
                ref={terminalRef} // Attach the terminal ref
                className="bg-black text-green-500 font-mono p-4 rounded-lg w-full min-w-[100vh] max-w-6xl min-h-[70vh] h-[70vh] overflow-hidden"
            >
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
