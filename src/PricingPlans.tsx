import React from "react";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    name: "Starter",
    price: 5,
    color: "from-blue-500 to-purple-500",
    textColor: "text-white",
    buttonColor: "bg-[#1c1f4a]",
    features: [
      "Browse movie database",
      "IMDb-style rating access",
      "Short plot summaries",
      "Genre filters",
    ],
  },
  {
    name: "Cinephile",
    price: 10,
    color: "from-orange-400 to-pink-500",
    textColor: "text-white",
    buttonColor: "bg-[#1c1f4a]",
    features: [
      "All Starter features",
      "Director biographies",
      "Critic and user reviews",
      "Top trending charts",
    ],
  },
  {
    name: "Director’s Cut",
    price: 20,
    color: "from-green-400 to-blue-500",
    textColor: "text-white",
    buttonColor: "bg-[#1c1f4a]",
    features: [
      "All Cinephile features",
      "Behind-the-scenes interviews",
      "Detailed metadata & production notes",
      "Ad-free experience + priority access",
    ],
  },
];

const PricingPlans = () => {
  return (
    <div className="bg-[#1c1f4a] min-h-screen py-16 px-4">
      <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
        Choose Your Movie Experience
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingTiers.map((tier, index) => (
          <motion.div
            key={index}
            className={`rounded-3xl overflow-hidden shadow-lg border border-gray-600 hover:scale-105 transition-transform duration-500 cursor-pointer bg-gradient-to-br ${tier.color} ${tier.textColor} animate-float`}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
          >
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-semibold">{tier.name}</h3>

              <ul className="space-y-2">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <p className="text-3xl font-bold">${tier.price}</p>
                <p className="text-sm opacity-80">per month</p>
              </div>

              <button
                className={`mt-4 px-6 py-2 rounded-full text-sm font-semibold text-white transition duration-300 hover:brightness-110 ${tier.buttonColor}`}
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
