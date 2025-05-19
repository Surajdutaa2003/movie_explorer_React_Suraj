// // 


// import axios from 'axios';
// import toast from 'react-hot-toast';

// const BASE_URL = 'https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1';

// export const loginUser = async ({ email, password }: { email: string; password: string }) => {
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/users/sign_in`,
//       { email, password },
//       { headers: { 'Content-Type': 'application/json' } }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error('Login error:', error);
//     const errorMessage = error.response?.data?.error || 'Failed to sign in';
//     toast.error(errorMessage);
//     throw new Error(errorMessage);
//   }
// };

// export const createSubscription = async (planType: string) => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('You need to sign in first.');
//       throw new Error('No authentication token found');
//     }

//     const response = await axios.post(
//       `${BASE_URL}/subscriptions`,
//       { plan_id: planType },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log('Create subscription response:', response.data);

//     const responseData = response.data as { error?: string; client_secret?: string; payment_intent_id?: string; subscription_id?: string };
//     if (responseData.error) {
//       throw new Error(responseData.error);
//     }

//     if (!responseData.client_secret || !responseData.payment_intent_id) {
//       throw new Error('Invalid response: client_secret or payment_intent_id missing');
//     }

//     return {
//       client_secret: responseData.client_secret,
//       payment_intent_id: responseData.payment_intent_id,
//       subscription_id: responseData.subscription_id,
//     };
//   } catch (error: any) {
//     console.error('Error creating subscription:', error);
//     const errorMessage = error.response?.data?.error || error.message || 'Failed to initiate subscription';
//     toast.error(errorMessage);
//     throw new Error(errorMessage);
//   }
// };

// export const confirmSubscription = async (paymentIntentId: string) => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('You need to sign in first.');
//       throw new Error('No authentication token found');
//     }

//     const response = await axios.post(
//       `${BASE_URL}/subscriptions/confirm`,
//       { payment_intent_id: paymentIntentId },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log('Confirm subscription response:', response.data);

//     const responseData = response.data as { error?: string; [key: string]: any };
//     if (responseData.error) {
//       throw new Error(responseData.error);
//     }

//     return responseData;
//   } catch (error: any) {
//     console.error('Error confirming subscription:', error);
//     const errorMessage = error.response?.data?.error || error.message || 'Failed to confirm subscription';
//     toast.error(errorMessage);
//     throw new Error(errorMessage);
//   }
// };

// export const getSubscriptionStatus = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('You need to sign in first.');
//       throw new Error('No authentication token found');
//     }

//     const response = await axios.get(`${BASE_URL}/subscriptions/status`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log('Subscription status response:', response.data);

//     const responseData = response.data as { error?: string; [key: string]: any };

//     if (responseData.error) {
//       throw new Error(responseData.error);
//     }

//     return responseData;
//   } catch (error: any) {
//     console.error('Subscription status error:', {
//       message: error.message,
//       response: error.response,
//       status: error.response?.status,
//     });
//     const errorMessage = error.response?.data?.error || 'Failed to fetch subscription status';
//     toast.error(errorMessage);
//     throw new Error(errorMessage);
//   }
// };


import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1';

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/sign_in`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    const errorMessage = error.response?.data?.error || 'Failed to sign in';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const createSubscription = async (planType: string) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Creating subscription with token:', token);
    if (!token) {
      toast.error('You need to sign in first.');
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${BASE_URL}/subscriptions`,
      { plan_id: planType },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Create subscription response:', response.data);

    const responseData = response.data as { error?: string; client_secret?: string; payment_intent_id?: string; subscription_id?: string };
    if (responseData.error) {
      throw new Error(responseData.error);
    }

    if (!responseData.client_secret || !responseData.payment_intent_id || !responseData.subscription_id) {
      throw new Error('Invalid response: client_secret, payment_intent_id, or subscription_id missing');
    }

    return {
      client_secret: responseData.client_secret,
      payment_intent_id: responseData.payment_intent_id,
      subscription_id: responseData.subscription_id,
    };
  } catch (error: any) {
    console.error('Error creating subscription:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    const errorMessage = error.response?.data?.error || error.message || 'Failed to initiate subscription';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const confirmSubscription = async (paymentIntentId: string) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Confirming subscription with token:', token, 'and payment_intent_id:', paymentIntentId);
    if (!token) {
      toast.error('You need to sign in first.');
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${BASE_URL}/subscriptions/confirm`,
      { payment_intent_id: paymentIntentId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Confirm subscription response:', response.data);

    const responseData = response.data as { error?: string; plan?: string; status?: string; current_period_end?: string };
    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return responseData;
  } catch (error: any) {
    console.error('Error confirming subscription:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    const errorMessage = error.response?.data?.error || error.message || 'Failed to confirm subscription';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Fetching subscription status with token:', token);
    if (!token) {
      toast.error('You need to sign in first.');
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${BASE_URL}/subscriptions/status`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Subscription status response:', response.data);

    const responseData = response.data as { error?: string; plan?: string; status?: string; current_period_end?: string };
    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return responseData;
  } catch (error: any) {
    console.error('Subscription status error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch subscription status';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};