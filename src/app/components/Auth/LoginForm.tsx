"use client";

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext)!;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
      <div className="mb-4">
        <label>Email</label>
        <input {...register("email")} type="email" className="w-full p-2 border" />
      </div>
      <div className="mb-4">
        <label>Password</label>
        <input {...register("password")} type="password" className="w-full p-2 border" />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="bg-blue-500 text-white p-2 mt-2">Login</button>
    </form>
  );
};

export default LoginForm;
