"use client";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../services/api";
import { useRouter } from "next/navigation";

interface Coupon {
  id: number;
  drawDate: string;
  numbers: number[];
  result: string | null;
}

const UserDashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext)!;
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchUserCoupons();
    }
  }, [user]);

  const fetchUserCoupons = async () => {
    try {
      const response = await api.get("/user/coupons");
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>

      <div className="mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Your Coupons</h2>
      {coupons.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Draw Date</th>
              <th className="border border-gray-300 p-2">Numbers</th>
              <th className="border border-gray-300 p-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="border border-gray-300 p-2">{coupon.drawDate}</td>
                <td className="border border-gray-300 p-2">
                  {coupon.numbers.join(", ")}
                </td>
                <td className="border border-gray-300 p-2">
                  {coupon.result || "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No coupons found.</p>
      )}
    </div>
  );
};

export default UserDashboard;
