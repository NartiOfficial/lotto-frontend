"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "../../services/api";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<RegisterFormInputs>();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await api.post("/register", data);
      router.push("/login"); 
    } catch (err) {
      setError("Failed to register. Please check your details.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
      <div className="mb-4">
        <label htmlFor="name">Name</label>
        <input
          {...register("name", { required: true })}
          type="text"
          id="name"
          className="w-full p-2 border"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email">Email</label>
        <input
          {...register("email", { required: true })}
          type="email"
          id="email"
          className="w-full p-2 border"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password">Password</label>
        <input
          {...register("password", { required: true })}
          type="password"
          id="password"
          className="w-full p-2 border"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password_confirmation">Confirm Password</label>
        <input
          {...register("password_confirmation", { required: true })}
          type="password"
          id="password_confirmation"
          className="w-full p-2 border"
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
