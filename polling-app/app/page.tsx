"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-100 text-gray-900" style={{ backgroundImage: "url('/whatsapp-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <h1 className="text-5xl font-bold mb-6">Simple Polling</h1>
      <p className="text-lg mb-8">Welcome to our platform. Let&apos;s get started!</p>
      <button
        onClick={() => router.push("/login")}
        className="px-6 py-3 text-lg font-semibold bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
      >
        Go to Login
      </button>
    </div>
  );
}
