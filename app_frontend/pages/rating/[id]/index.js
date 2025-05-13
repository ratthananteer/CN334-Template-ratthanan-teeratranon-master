"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await fetch(`http://localhost:3342/api/payment/${id}/`);
  const payment = await res.json();
  const productId = payment.Product_id;
  return {
    props: {
      productId,

    },
  };
}
export default function Rating({productId,}) {  
  const [rating, setRating] = useState(null);
  const router = useRouter();

  const ratings = [
    { id: 1, emoji: "😡", color: "bg-red-500", label: "Very Dissatisfied", shadow: "shadow-red-400" },
    { id: 2, emoji: "😞", color: "bg-orange-500", label: "Dissatisfied", shadow: "shadow-orange-400" },
    { id: 3, emoji: "😐", color: "bg-yellow-500", label: "Neutral", shadow: "shadow-yellow-400" },
    { id: 4, emoji: "🙂", color: "bg-green-400", label: "Satisfied", shadow: "shadow-green-400" },
    { id: 5, emoji: "😄", color: "bg-green-600", label: "Very Satisfied", shadow: "shadow-green-500" },
  ];

  const handleRating = async (ratingId) => {
    setRating(ratingId);

    try {
      console.log("product id",productId)
      console.log("rating id",ratingId)
      await fetch("http://localhost:3342/api/submit-rating/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: ratingId, product_id: productId }),
      });

      router.push("/homepage");
    } catch (error) {
      console.error("Error sending rating:", error);
      alert("ไม่สามารถส่งคะแนนได้ โปรดลองใหม่");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-700">
      <h1 className="text-4xl font-extrabold mb-10 text-white drop-shadow-2xl animate-pulse">ความพึงพอใจ</h1>
      <div className="flex space-x-8 mb-10">
        {ratings.map((item) => (
          <button
            key={item.id}
            onClick={() => handleRating(item.id)}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2) rotate(5deg)'; e.currentTarget.style.boxShadow = '0 0 25px rgba(255,255,255,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = ''; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = rating === item.id ? 'scale(1.1)' : 'scale(1)'; }}
            className={`w-20 h-20 rounded-full ${item.color} text-white flex items-center justify-center text-4xl transition-all duration-300 ease-in-out ${
              rating === item.id ? `${item.shadow} scale-110 ring-4 ring-offset-4 ring-${item.color.split('-')[1]}-300` : ''
            } hover:brightness-125 hover:shadow-2xl`}
            aria-label={item.label}
          >
            {item.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}