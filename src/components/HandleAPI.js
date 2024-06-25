// API.js
import axios from "axios";

const BASE_URL = "https://szdn6rxb-4000.asse.devtunnels.ms";

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
