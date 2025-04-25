import axios from "axios";

export const signup = async (userData: {
  full_name: string;
  email: string;
  mobile_number: string;
  password: string;
  role: number;
}) => {
  try {
    const response = await axios.post(
      "https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1/signup",
      userData,
      {
        headers: {
          "Content-Type": "application/json", // <-- Important
          Accept: "application/json",          // <-- Also helps
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const login = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        "https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1/login",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Login error: ", error);
      throw error;
    }
  };
  