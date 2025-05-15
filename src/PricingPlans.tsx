// import React from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { EffectCoverflow, Pagination } from "swiper/modules";
// import "swiper/css";
// // @ts-ignore
// import "swiper/css/effect-coverflow";
// import "swiper/css/pagination";

// const pricingTiers = [
//   {
//     name: "Starter",
//     price: 5,
//     color: "from-blue-100 to-blue-200",
//     textColor: "text-blue-900",
//     buttonColor: "bg-blue-600",
//     features: [
//       "Browse movie database",
//       "IMDb-style rating access",
//       "Short plot summaries",
//       "Genre filters",
//     ],
//   },
//   {
//     name: "Cinephile",
//     price: 10,
//     color: "from-blue-200 to-blue-300",
//     textColor: "text-blue-900",
//     buttonColor: "bg-blue-700",
//     features: [
//       "All Starter features",
//       "Director biographies",
//       "Critic and user reviews",
//       "Top trending charts",
//     ],
//   },
//   {
//     name: "Director’s Cut",
//     price: 20,
//     color: "from-blue-300 to-blue-400",
//     textColor: "text-blue-900",
//     buttonColor: "bg-blue-800",
//     features: [
//       "All Cinephile features",
//       "Behind-the-scenes interviews",
//       "Detailed metadata & production notes",
//       "Ad-free experience + priority access",
//     ],
//   },
// ];

// const PricingPlans = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-white min-h-screen py-16 px-4">
//       <div className="max-w-6xl mx-auto mb-8">
//         <button
//           onClick={() => navigate("/home")}
//           className="text-blue-700 hover:underline font-medium text-sm"
//         >
//           ← Go Back Home
//         </button>
//       </div>

//       <h2 className="text-4xl md:text-5xl font-bold text-blue-900 text-center mb-12">
//         Choose Your Experience
//       </h2>

//       <Swiper
//         effect={"coverflow"}
//         grabCursor={true}
//         centeredSlides={true}
//         slidesPerView={1}
//         coverflowEffect={{
//           rotate: 50,
//           stretch: 0,
//           depth: 100,
//           modifier: 1,
//           slideShadows: true,
//         }}
//         pagination={{ clickable: true }}
//         modules={[EffectCoverflow, Pagination]}
//         className="w-full max-w-6xl mx-auto"
//         breakpoints={{
//           640: {
//             slidesPerView: 2,
//             coverflowEffect: {
//               rotate: 40,
//               depth: 150,
//               modifier: 1,
//               slideShadows: true,
//             },
//           },
//           1024: {
//             slidesPerView: 3,
//             coverflowEffect: {
//               rotate: 30,
//               depth: 200,
//               modifier: 1,
//               slideShadows: true,
//             },
//           },
//         }}
//       >
//         {pricingTiers.map((tier, index) => (
//           <SwiperSlide key={index}>
//             <motion.div
//               className={`rounded-3xl overflow-hidden shadow-md border border-blue-200 bg-gradient-to-br ${tier.color} ${tier.textColor} max-w-sm mx-auto`}
//               whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
//             >
//               <div className="p-6 space-y-4">
//                 <h3 className="text-2xl font-semibold">{tier.name}</h3>

//                 <ul className="space-y-2">̥
//                   {tier.features.map((feature, i) => (
//                     <li key={i} className="flex items-center gap-2">
//                       <span className="text-blue-700">✔</span>
//                       <span>{feature}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 <div className="mt-6">
//                   <p className="text-3xl font-bold">${tier.price}</p>
//                   <p className="text-sm text-blue-600">per month</p>
//                 </div>

//                 <button
//                   className={`mt-4 px-6 py-2 rounded-full text-sm font-semibold text-white transition duration-300 hover:brightness-110 ${tier.buttonColor}`}
//                 >
//                   Sign Up
//                 </button>
//               </div>
//             </motion.div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default PricingPlans;






























































import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Check, ArrowForward } from '@mui/icons-material';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createSubscription, confirmSubscription } from './subApi';
import { Plan } from './Types';

export default function SubscriptionPage() {
  window.scrollTo(0, 0);
  const stripe = useStripe();
  const elements = useElements();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'basic',
      name: '1 Day Pass',
      price: '$1.99',
      features: [
        'Full access to all movies',
        'Unlimited streaming',
        'HD quality',
        'No ads',
      ],
      duration: '24 hours of premium access',
    },
    {
      id: 'premium',
      name: '7 Day Pass',
      price: '$7.99',
      features: [
        'Full access to all movies',
        'Unlimited streaming',
        'HD & 4K quality',
        'No ads',
        'Offline downloads',
      ],
      duration: '7 days of premium access',
      popular: true,
    },
    {
      id: '1_month',
      name: '1 Month Premium',
      price: '$19.99',
      features: [
        'Full access to all movies',
        'Unlimited streaming',
        'HD & 4K quality',
        'No ads',
        'Offline downloads',
        'Priority customer support',
        'Early access to new releases',
      ],
      duration: '30 days of premium access',
    },
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Please select a plan.');
      return;
    }

    if (!stripe || !elements) {
      setError('Payment system not loaded. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCardError(null);

    try {
      const { client_secret, payment_intent_id, subscription_id } = await createSubscription(selectedPlan);
      console.log('Created subscription:', { client_secret, payment_intent_id, subscription_id });

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { email: JSON.parse(localStorage.getItem('user') || '{}').email || '' },
        },
      });

      if (result.error) {
        setCardError(result.error.message || 'Payment failed. Please try another card.');
        setIsProcessing(false);
        return;
      }

      const confirmResult = await confirmSubscription(payment_intent_id);
      console.log('Confirmed subscription:', confirmResult);
      window.location.href = '/success';
    } catch (err: any) {
      console.error('Error in handleSubscribe:', err);
      setError(err.message || 'Failed to process subscription. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'rgb(20, 20, 30)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ color: '#fff' }}>
              Choose Your Movie Explorer Plan
            </Typography>
            <Typography variant="h6" color="rgba(255,255,255,0.7)">
              Unlock premium content with a subscription that fits your schedule
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: 6, gap: 4, '@media (max-width: 900px)': { flexDirection: 'column', alignItems: 'center' } }}>
            {plans.map((plan) => (
              <Card
                key={plan.id}
                elevation={selectedPlan === plan.id ? 8 : 3}
                sx={{
                  position: 'relative',
                  width: { xs: '100%', md: 'calc(33.33% - 32px)' },
                  maxWidth: '400px',
                  transition: 'all 0.3s',
                  transform: selectedPlan === plan.id ? 'scale(1.05)' : 'scale(1)',
                  border: selectedPlan === plan.id ? 2 : 0,
                  borderColor: 'primary.main',
                  bgcolor: '#fff',
                  color: '#000',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                {plan.popular && (
                  <Chip
                    label="MOST POPULAR"
                    color="warning"
                    size="small"
                    sx={{ position: 'absolute', top: 0, right: 0, borderRadius: '0 4px 0 4px', fontWeight: 'bold' }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {plan.duration}
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" sx={{ my: 2 }}>
                    {plan.price}
                  </Typography>
                  <List dense sx={{ mb: 2 }}>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <Check color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant={selectedPlan === plan.id ? 'contained' : 'outlined'}
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => setSelectedPlan(plan.id)}
                    sx={{
                      color: selectedPlan === plan.id ? '#fff' : '#000',
                      borderColor: '#00b7bf',
                      bgcolor: selectedPlan === plan.id ? '#E50914' : 'transparent',
                      '&:hover': { bgcolor: selectedPlan === plan.id ? '#c7000d' : 'rgba(0, 183, 191, 0.1)', borderColor: '#00b7bf' },
                    }}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {selectedPlan && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  width: '100%',
                  maxWidth: 'md',
                  bgcolor: 'rgba(20, 20, 20, 0.9)',
                  color: '#fff',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Typography variant="h4" component="h2" gutterBottom>
                  Confirm Your Subscription
                </Typography>
                <Typography variant="body1" color="rgba(255,255,255,0.7)" gutterBottom sx={{ mb: 3 }}>
                  You have selected the {plans.find((p) => p.id === selectedPlan)?.name} for {plans.find((p) => p.id === selectedPlan)?.price}.
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)" gutterBottom>
                    Enter your payment details
                  </Typography>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#fff',
                          '::placeholder': { color: 'rgba(255,255,255,0.5)' },
                        },
                        invalid: { color: '#e57373' },
                      },
                    }}
                  />
                  {cardError && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {cardError}
                    </Typography>
                  )}
                </Box>
                {error && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isProcessing || !stripe || !elements}
                  onClick={handleSubscribe}
                  sx={{ py: 1.5, bgcolor: '#E50914', '&:hover': { bgcolor: '#c7000d' } }}
                >
                  {isProcessing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Processing...
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Subscribe Now <ArrowForward sx={{ ml: 1 }} />
                    </Box>
                  )}
                </Button>
                <Typography variant="body2" color="rgba(255,255,255,0.7)" align="center" sx={{ mt: 2 }}>
                  You can cancel your subscription at any time from your account settings
                </Typography>
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}