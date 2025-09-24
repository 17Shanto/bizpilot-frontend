const API_BASE_URL = "https://bizpilot-backend.vercel.app/bizpilot-api";

// Login with email and password using backend API
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return data; // Should contain user object + token
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
};

// Get stored user data
export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    return null;
  }
};

// Get stored token
export const getStoredToken = () => {
  return localStorage.getItem("authToken");
};

// Store user data and token
export const storeAuthData = (user, token) => {
  localStorage.setItem("userData", JSON.stringify(user));
  localStorage.setItem("authToken", token);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  return !!(token && user);
};

// Generate business idea using AI with iterative support
export const generateBusinessIdea = async (
  prompt,
  userId,
  token,
  accountType,
  modification = null,
  previousOutput = null
) => {
  try {
    let finalPrompt = prompt;

    // If this is an iterative call with modification and previous output
    if (modification && previousOutput) {
      // Construct the iterative prompt by combining previous JSON with modification
      const previousJSON = JSON.stringify(previousOutput, null, 2);

      console.log("🔄 ITERATIVE UPDATE DETECTED:");
      console.log("📝 Modification:", modification);
      console.log("📊 Previous Output:", previousOutput);
      console.log("📋 Previous JSON:", previousJSON);

      finalPrompt = `Based on the previous business idea output: ${previousJSON}, now recalculate considering that ${modification}, and model will remain same as our json data`;

      console.log("🚀 Iterative prompt constructed:", finalPrompt);
    } else {
      console.log("🆕 Initial prompt:", finalPrompt);
    }

    console.log("✅ Final prompt:", finalPrompt);

    const response = await fetch(`${API_BASE_URL}/idea`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        prompt: finalPrompt,
        user: userId,
        account: accountType || "Free",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate business idea");
    }

    const data = await response.json();
    return data; // Should contain idea, business_models, roadmap, feasibility
  } catch (error) {
    console.error("Business idea generation error:", error);
    throw error;
  }
};

// Get error message for authentication errors
export const getErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  }

  switch (error.code) {
    case "NETWORK_ERROR":
      return "Network error. Please check your internet connection.";
    case "INVALID_CREDENTIALS":
      return "Invalid email or password.";
    case "USER_NOT_FOUND":
      return "No account found with this email.";
    case "WRONG_PASSWORD":
      return "Incorrect password.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};
