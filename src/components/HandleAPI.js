import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:4000";

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
