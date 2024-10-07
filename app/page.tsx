"use client"; // Add this to the top of the file

import Terminal from './components/Terminal'; // Updated path

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Welcome to My Portfolio</h1>
      <Terminal />
    </div>
  );
}
