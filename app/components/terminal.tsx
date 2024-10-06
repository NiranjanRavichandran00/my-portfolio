"use client"; // Ensure this is at the top of the file

import { useState } from 'react';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const commands = {
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

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    const commandOutput = commands[input]
      ? commands[input]
      : 'Command not found. Type "help" for a list of commands.';

    animateText(`> ${input}`, true); // Animate the command text
    animateText(commandOutput, false); // Animate the command output
    setInput(''); // Clear input
  };

  const animateText = (text: string, isCommand: boolean = false) => {
    let currentIndex = 0;
    const fullText = isCommand ? text : text + "\n"; // Add a newline after commands

    // Add the initial command or command output to the output state
    setOutput((prev) => [...prev, fullText]);

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setOutput((prev) => {
          const newOutput = [...prev];
          // If it’s a command, update the last line with the animated output
          newOutput[newOutput.length - 1] = fullText.slice(0, currentIndex + 1);
          return newOutput;
        });
        currentIndex++;
      } else {
        clearInterval(typingInterval); // Stop the interval when done
      }
    }, 10); // Adjust typing speed as necessary
  };

  const handleCommandClick = (command: string) => {
    setInput(command); // Autofill input with clicked command
  };

  return (
    <div>
      {/* Terminal display */}
      <div className="bg-black text-green-500 font-mono p-4 rounded-lg w-full max-w-2xl h-96 overflow-y-auto">
        <div>
          {output.map((line, index) => (
            <p key={index}>{line}</p> // Render output lines
          ))}
        </div>

        <form onSubmit={handleCommand}>
          <div className="flex">
            <span className="mr-2">{'>'}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)} // Update input state
              className="bg-black text-green-500 outline-none flex-grow"
              autoFocus
            />
          </div>
        </form>
      </div>

      {/* Command buttons */}
      <div className="mt-4 p-2">
        <p className="text-white">Click a command to autofill:</p>
        <div className="flex flex-wrap">
          {Object.keys(commands).map((command) => (
            <button
              key={command}
              onClick={() => handleCommandClick(command)}
              className="bg-green-600 text-black rounded p-2 m-2 hover:bg-green-500 transition-colors"
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
