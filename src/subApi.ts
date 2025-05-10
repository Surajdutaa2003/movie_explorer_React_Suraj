const BASE_URL=`https://movie-explorer-ror-aalekh-2ewg.onrender.com`
import axios from "axios";
import toast from "react-hot-toast";

export const createSubscription = async (planType: string): Promise<string> => {
    try {
      const token = localStorage.getItem("token");
      console.log("Retrieved token:", token);
      if (!token) {
        toast.error("You need to sign in first.");
        throw new Error("No authentication token found");
      }

const response = await axios.post(
  `${BASE_URL}/api/v1/subscriptions`,
  { plan_type: planType },
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
);

console.log('API Response:', response.data);

type SubscriptionResponse = {
  error?: string;
  checkoutUrl?: string;
  data?: { checkoutUrl?: string };
  url?: string;
}

const responseData = response.data as SubscriptionResponse;
if (responseData.error) {
  throw new Error(responseData.error);
}

const checkoutUrl = responseData.checkoutUrl || responseData.data?.checkoutUrl || responseData.url;
      if (!checkoutUrl) {
        throw new Error('No checkout URL returned from server.');
      }

      return checkoutUrl;
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      throw new Error(error.message || 'Failed to initiate subscription');
    }
};
















export const getSubscriptionStatus = async (token: string) => {
    try {
      if (!token) {
        toast.error('You need to sign in first.');
        throw new Error('No authentication token found');
      }
  
      const response = await axios.get(
        `${BASE_URL}/api/v1/subscriptions/status`,
        {
          headers: {
            Authorization:`Bearer ${token}`,
          },
        }
      );
  
      const responseData = response.data as { error?: string };
      if ('error' in responseData) {
        const responseData = response.data as { error?: string };
        throw new Error(responseData.error || 'Unknown error');
      }
  
      return response.data;
    } catch (error) {
      console.error('Subscription Status Error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
             response: error,   status: (error as any)?.isAxiosError ? error.response?.status : undefined,
      });
      if ((error as any).isAxiosError) {
          throw new Error(error.response?.data?.error || 'Failed to fetch subscription status');
        }
      }
    throw new Error('An unexpected error occurred');
    }
  