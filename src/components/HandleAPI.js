import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:4000";

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    if (!exp) {
      throw new Error("Token does not have an expiration time");
    }
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    const isExpired = currentTime > exp;
    if (isExpired) {
      localStorage.removeItem("token");
      Swal.fire({
        title: "Error!",
        text: "Session Expired.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
    }
    return isExpired;
  } catch (error) {
    console.error("Failed to decode token:", error);
    window.location.href = "/login";
    return true; // consider the token expired if there's an error
  }
}

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (category) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/products/category/${category}`
    );

    return response.data.payload;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

export const fetchAllProducts = async (category = "") => {
  try {
    let url = `${BASE_URL}/products`;
    if (category) {
      url = `${BASE_URL}/products/category/${category}`;
    }
    const response = await axios.get(url);

    return response.data.payload;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/category`);
    return response.data.payload[0];
  } catch (error) {
    console.error("Error fetching categories", error);
    throw error;
  }
};

export const fetchProductDetail = async (product) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${product}`);
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

export const login = async (email, password, setError) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);

    Swal.fire({
      title: "Success!",
      text: "Login successful.",
      icon: "success",
      confirmButtonText: "OK",
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);

    // Optionally return response.data if needed
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    setError("Invalid email or password");
    throw error;
  }
};

export const register = async (username, email, password, setError) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, {
      username,
      email,
      password,
    });

    // Optionally handle success message or redirect
    Swal.fire({
      title: "Registered!",
      text: "Registration successful.",
      icon: "success",
      confirmButtonText: "OK",
    });
    // Optionally return response.data if needed
    return response.data;
  } catch (error) {
    console.error("Error registering", error);
    setError("Registration failed. Please try again.");
    throw error;
  }
};

export const addToCart = async (product, quantity) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    if (!isTokenExpired(token)) {
      const decodedToken = jwtDecode(token);

      const BASE_URL = "http://localhost:4000";

      const response = await axios.post(
        `${BASE_URL}/cart/add`,
        {
          id_user: decodedToken.id_user,
          id_product: product.id_product,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Success!",
        text: `${product.product_name} has been added to the cart.`,
        icon: "success",
        confirmButtonText: "OK",
      });

      // Optionally return response.data if needed
      return response.data;
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Anda Harus Login.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
    console.error("Error adding to cart", error);
  }
};

export const getCart = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    if (!isTokenExpired(token)) {
      const BASE_URL = "http://localhost:4000";

      const response = await axios.get(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }
  } catch (error) {
    console.error("Error get cart", error);
  }
};

export const getUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Error!",
        text: "Anda Harus Login.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      throw new Error("User not authenticated");
    }
    if (!isTokenExpired(token)) {
      const BASE_URL = "http://localhost:4000";

      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error get user data", error);
  }
};
