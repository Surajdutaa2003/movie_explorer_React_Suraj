import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
// @ts-ignore
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const pricingTiers = [
  {
    name: "Starter",
    price: 5,
    color: "from-blue-100 to-blue-200",
    textColor: "text-blue-900",
    buttonColor: "bg-blue-600",
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
    color: "from-blue-200 to-blue-300",
    textColor: "text-blue-900",
    buttonColor: "bg-blue-700",
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
    color: "from-blue-300 to-blue-400",
    textColor: "text-blue-900",
    buttonColor: "bg-blue-800",
    features: [
      "All Cinephile features",
      "Behind-the-scenes interviews",
      "Detailed metadata & production notes",
      "Ad-free experience + priority access",
    ],
  },
];

const PricingPlans = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigate("/home")}
          className="text-blue-700 hover:underline font-medium text-sm"
        >
          ← Go Back Home
        </button>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold text-blue-900 text-center mb-12">
        Choose Your Experience
      </h2>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="w-full max-w-6xl mx-auto"
        breakpoints={{
          640: {
            slidesPerView: 2,
            coverflowEffect: {
              rotate: 40,
              depth: 150,
              modifier: 1,
              slideShadows: true,
            },
          },
          1024: {
            slidesPerView: 3,
            coverflowEffect: {
              rotate: 30,
              depth: 200,
              modifier: 1,
              slideShadows: true,
            },
          },
        }}
      >
        {pricingTiers.map((tier, index) => (
          <SwiperSlide key={index}>
            <motion.div
              className={`rounded-3xl overflow-hidden shadow-md border border-blue-200 bg-gradient-to-br ${tier.color} ${tier.textColor} max-w-sm mx-auto`}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-semibold">{tier.name}</h3>

                <ul className="space-y-2">̥
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-blue-700">✔</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <p className="text-3xl font-bold">${tier.price}</p>
                  <p className="text-sm text-blue-600">per month</p>
                </div>

                <button
                  className={`mt-4 px-6 py-2 rounded-full text-sm font-semibold text-white transition duration-300 hover:brightness-110 ${tier.buttonColor}`}
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PricingPlans;