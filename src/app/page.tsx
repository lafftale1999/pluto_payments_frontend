"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/axios"
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = useMutation({
    mutationFn: () => api.postLogin({
      email: email,
      password: password
    }),
    onSuccess: (res) => {
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser.mutate();
    redirect("/app")
  };

  return (
    <div className="flex h-screen">
  {/* Left side */}
  <div className="w-1/2 flex items-center justify-center p-0 m-0">
    <Image src="/spaceman.png" alt="Spaceman" width={800} height={900}/>
  </div>

  {/* Right side */}
  <div className="w-1/2 flex flex-col items-center px-4 pt-5 gap-6">
    {/* Logo */}
    <Image
      src="/logo-no-coing.png"
      alt="My photo"
      width={300}
      height={300}
    />

    {/* Form */}
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center w-full max-w-sm gap-3"
    >
      <p className="text-lg font-medium">Login</p>

      <input
        type="email"
        placeholder="Email"
        className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={loginUser.isPending}
        className="w-full rounded-lg px-4 py-2 bg-accent hover:bg-blue-500 disabled:opacity-60"
      >
        {loginUser.isPending ? "Signing in..." : "Sign in"}
      </button>

      {loginUser.error && (
        <div className="w-full text-sm text-red-400">
          {(loginUser.error as any)?.message || "Login failed"}
        </div>
      )}

      {loginUser.isSuccess && (
        <div className="w-full text-sm text-green-400">
          Logged in successfully!
        </div>
      )}
    </form>
  </div>
</div>

    
  );
}
