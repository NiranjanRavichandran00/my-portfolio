"use client";

import { useState, useRef, useEffect } from 'react';

const TYPING_SPEED = 10;
const LINE_DELAY = 25;

const Terminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string[]>([]);
    const [isCommandRunning, setIsCommandRunning] = useState(false);
    const [lineHeight, setLineHeight] = useState(0);
    const [showWorkSubCommands, setShowWorkSubCommands] = useState(false);

    const commands: Record<string, string> = {
        help: `
            Available commands:
            - help: List all commands
            - projects: List my projects
            - education: Show my education history
            - work: List previous work experience
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
            1. Software Engineer at E-MetroTel (2022-2023)
            2. Software Developer Intern at E-MetroTel (2022)
            Type 'work 1' or 'work 2' for details.
        `,
        'work 1': `
            Software Engineer at E-MetroTel (2022-2023):
            - Developed and optimized a video conferencing application, resolving resource management issues.
            - Led feature development and code reviews for 10+ features per sprint.
            - Worked with Docker and Linux for containerization and deployment.
            - Collaborated with global teams to resolve server stability issues.
        `,
        'work 2': `
            Software Developer Intern at E-MetroTel (2022):
            - Worked on full-stack development for business communication software.
            - Implemented new features for customer management systems.
            - Gained experience in Java, Python, and web development.
            - Developed RPM packages for Linux deployment.
        `,
        certifications: `
            Certifications:
            - AWS Certified Cloud Practitioner (2024)
        `,
    };

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

    const willOutputOverflow = (newLines: string[]) => {
        const terminalHeight = terminalRef.current?.clientHeight ?? 0;
        if (lineHeight === 0) return false;
        const totalLines = output.length + newLines.length + 10; 
        return totalLines * lineHeight > terminalHeight;
    };

    // Function to clear the terminal
    const clearTerminal = () => {
        setOutput([]);
    };

    const scrollToBottom = () => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    };

    const handleCommand = (command: string) => {
        if (isCommandRunning) return;

        const commandOutput = commands[command] ? commands[command].trim().split('\n') : ['Command not found. Type "help" for a list of commands.'];

        // Check for overflow before adding any output and clear the terminal if needed
        if (willOutputOverflow(commandOutput)) {
            clearTerminal(); // Clear terminal if overflow is detected
            addOutput("[Notice] Terminal cleared due to overflow.");
        }

        addOutput(`> ${command}`);
        setIsCommandRunning(true);
        animateLines(commandOutput);
        setInput('');
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
                    addOutput("");
                    animateText(currentLine, () => {
                        lineIndex++;
                        setTimeout(typeNextLine, LINE_DELAY);
                    });
                } else {
                    lineIndex++;
                    setTimeout(typeNextLine, LINE_DELAY);
                }
            } else {
                setIsCommandRunning(false);
                scrollToBottom(); // Ensure scrolling to bottom after command finishes
            }
        };

        typeNextLine();
    };

    const handleCommandClick = (command: string) => {
        if (isCommandRunning) return;
        handleCommand(command);
    };

    const toggleWorkSubCommands = () => {
        setShowWorkSubCommands(!showWorkSubCommands);
    };

    return (
        <div>
            <div
                ref={terminalRef}
                className="bg-black text-green-500 font-mono p-4 rounded-lg w-full min-w-[100vh] max-w-[100vh] min-h-[70vh] h-[70vh] overflow-y-auto break-words whitespace-pre-wrap"
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
                            disabled={isCommandRunning}
                        />
                    </div>
                </form>
            </div>

            <div className="mt-4 p-2">
                <p className="text-white">Click a command to execute:</p>
                <div className="flex flex-wrap">
                    <button
                        onClick={() => handleCommandClick('help')}
                        className={`bg-green-600 text-black rounded p-2 m-2 hover:bg-green-500 transition-colors ${isCommandRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isCommandRunning}
                    >
                        help
                    </button>

                    <button
                        onClick={() => handleCommandClick('projects')}
                        className={`bg-green-600 text-black rounded p-2 m-2 hover:bg-green-500 transition-colors ${isCommandRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isCommandRunning}
                    >
                        projects
                    </button>

                    <button
                        onClick={() => handleCommandClick('education')}
                        className={`bg-green-600 text-black rounded p-2 m-2 hover:bg-green-500 transition-colors ${isCommandRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isCommandRunning}
                    >
                        education
                    </button>

                    <div className="flex items-center space-x-1">
                        <button
                            onClick={toggleWorkSubCommands}
                            className={`bg-green-600 text-black rounded-l p-2 hover:bg-green-500 transition-colors ${isCommandRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isCommandRunning}
                        >
                            work
                        </button>

                        {showWorkSubCommands && (
                            <div className="bg-green-600 rounded-r-lg flex">
                                <button
                                    onClick={() => handleCommandClick('work')}
                                    className={`bg-green-500 text-black p-2 hover:bg-green-400 transition-colors ${isCommandRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isCommandRunning}
                                >
                                    work
                                </button>
                                <button
                                    onClick={() => handleCommandClick('work 1')}
                                    className={`bg-green-500 text-black p-2 hover:bg-green-400 transition-colors ${isCommandRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isCommandRunning}
                                >
                                    work 1
                                </button>
                                <button
                                    onClick={() => handleCommandClick('work 2')}
                                    className={`bg-green-500 text-black rounded-r p-2 hover:bg-green-400 transition-colors ${isCommandRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isCommandRunning}
                                >
                                    work 2
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => handleCommandClick('certifications')}
                        className={`bg-green-600 text-black rounded p-2 m-2 hover:bg-green-500 transition-colors ${isCommandRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isCommandRunning}
                    >
                        certifications
                    </button>

                    <button
                        onClick={clearTerminal}
                        className={`bg-red-600 text-white rounded p-2 m-2 hover:bg-red-500 transition-colors ${isCommandRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isCommandRunning}
                    >
                        clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Terminal;
