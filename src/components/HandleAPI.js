import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:4000";

export const fetchProducts = async () => {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data.payload;
};

export const fetchProductsByCategory = async (category) => {
  const response = await axios.get(`${BASE_URL}/products/category/${category}`);

  return response.data.payload;
};

export const fetchAllProducts = async (category = "") => {
  let url = `${BASE_URL}/products`;
  if (category) {
    url = `${BASE_URL}/products/category/${category}`;
  }
  const response = await axios.get(url);

  return response.data.payload;
};

export const fetchCategories = async () => {
  const response = await axios.get(`${BASE_URL}/category`);
  return response.data.payload[0];
};

export const fetchProductDetail = async (product) => {
  const response = await axios.get(`${BASE_URL}/products/${product}`);
  return response.data.payload;
};

export const login = async (email, password, setError) => {
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
};

export const register = async (username, email, password, setError) => {
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
};

export const addToCart = async (product, quantity) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const decodedToken = jwtDecode(token);

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
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });

    return response.data;
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
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await axios.get(`${BASE_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateCartQuantity = async (id_cart, quantity) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }
  const response = await axios.put(
    `${BASE_URL}/cart/${id_cart}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  window.location.reload();

  return response.data;
};

export const getUserData = async () => {
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

  const response = await axios.get(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
