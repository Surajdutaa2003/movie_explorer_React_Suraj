import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swiper from 'swiper';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { createSubscription, confirmSubscription, getSubscriptionStatus } from '../services/subApi';
import { Plan } from '../Types';

const plans: Plan[] = [
  {
    id: 'basic',
    name: '7 Day Pass',
    price: '$9.99',
    features: ['Full access to all movies', 'Unlimited streaming', 'HD quality', 'No ads'],
    duration: '24 hours of premium access',
  },
  {
    id: 'premium',
    name: '1 Month Pass',
    price: '$14.99',
    features: ['Full access to all movies', 'Unlimited streaming', 'HD & 4K quality', 'No ads', 'Offline downloads'],
    duration: '7 days of premium access',
    popular: true,
  },
  {
    id: '1_month',
    name: '1 Year Premium',
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

const SubscriptionPage: React.FC = () => {
  window.scrollTo(0, 0);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

  useEffect(() => {
    const swiper = new Swiper('.swiper', {
      modules: [EffectCoverflow, Navigation],
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    return () => swiper.destroy();
  }, []);

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
      // Check subscription status first
      const subStatus = await getSubscriptionStatus();
      if (subStatus.plan !== 'free') {
        toast.error('You already have an active subscription.');
        setIsProcessing(false);
        return;
      }

      // Proceed with subscription creation if plan is free
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
    <div className="bg-white min-h-screen flex flex-col text-blue-900">
      <ToastContainer />
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold">Choose Your Movie Explorer Plan</h1>
            <p className="text-lg text-blue-600 mt-2">
              Unlock premium content with a subscription that fits your schedule
            </p>
          </motion.div>

          <div className="swiper my-12">
            <div className="swiper-wrapper">
              {plans.map((plan) => (
                <div key={plan.id} className="swiper-slide max-w-sm mx-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`relative bg-blue-50 rounded-lg shadow-lg p-6 border-2 ${
                      selectedPlan === plan.id ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl rounded-tr">
                        MOST POPULAR
                      </span>
                    )}
                    <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                    <p className="text-sm text-blue-600 mb-4">{plan.duration}</p>
                    <p className="text-3xl font-bold mb-4">{plan.price}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                        selectedPlan === plan.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                    </button>
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>

          {selectedPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto mt-12 bg-blue-50 rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-4">Confirm Your Subscription</h2>
              <p className="text-blue-600 mb-6">
                You have selected the {plans.find((p) => p.id === selectedPlan)?.name} for{' '}
                {plans.find((p) => p.id === selectedPlan)?.price}.
              </p>
              <div className="mb-6">
                <p className="text-sm text-blue-600 mb-2">Enter your payment details</p>
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#1e3a8a',
                          '::placeholder': { color: '#93c5fd' },
                        },
                        invalid: { color: '#ef4444' },
                      },
                      hidePostalCode: true,
                    }}
                  />
                </div>
                {cardError && <p className="text-red-500 text-sm mt-2">{cardError}</p>}
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center transition-colors ${
                  isProcessing || !stripe || !elements
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={isProcessing || !stripe || !elements}
                onClick={handleSubscribe}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Subscribe Now
                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
              <p className="text-sm text-blue-600 text-center mt-4">
                You can cancel your subscription at any time from your account settings
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;