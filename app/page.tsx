import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50">
      <h1 className="text-5xl font-bold text-blue-900">
        Hello, Tailwind CSS!
      </h1>
      <p className="mt-4 text-xl text-gray-700">Tailwind is working 🎉</p>
      <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Click Me
      </button>
    </div>
  );
}
