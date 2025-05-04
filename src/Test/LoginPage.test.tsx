import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { withNavigate } from "../withNavigate";
import { login } from "../Api";

// Mocking the login function
jest.mock("../Api", () => ({
  login: jest.fn(),
}));

// Mocking the withNavigate HOC to avoid navigating during tests
jest.mock("../withNavigate", () => ({
  withNavigate: (Component: any) => (props: any) => <Component {...props} navigate={jest.fn()} />,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  test("renders login form", () => {
    render(<LoginPage />);

    // Check for email and password fields, and the login button
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  test("calls login function with correct credentials", async () => {
    render(<LoginPage />);

    // Simulate user input for email and password
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

    // Mock the login response
    (login as jest.Mock).mockResolvedValueOnce({
      user: { id: 1, email: "test@example.com" },
      token: "mock-token",
    });

    // Simulate form submission
    fireEvent.click(screen.getByText("Sign In"));

    // Wait for the mock login function to be called
    await waitFor(() => expect(login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    }));

    // Check that the login was successful
    expect(localStorage.getItem("user")).toBeDefined();
    expect(localStorage.getItem("token")).toBeDefined();
  });

 
});
