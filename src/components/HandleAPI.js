import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import bcrypt from "bcryptjs-react";

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

export const login = async (email, password) => {
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

export const register = async (username, email, password) => {
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

export const logout = async () => {
  localStorage.removeItem("token");

  // Optionally handle success message or redirect
  Swal.fire({
    title: "Sukses!",
    text: "Berhasil Logout.",
    icon: "success",
    confirmButtonText: "OK",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/login";
    }
  });
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

export const deleteCartItem = async (id_cart) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await axios.delete(`${BASE_URL}/cart/${id_cart}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    window.location.reload();

    return response.data; // Optionally return data confirming deletion
  } catch (error) {
    // Handle error, e.g., show error message
    console.error("Error deleting cart item:", error);
    throw error;
  }
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

export const updateProfile = async (inputData, file) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const { username, email, no_hp, password } = inputData; // Destructure inputData to get profile details

  // Ensure password is hashed before sending it to the server
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password using bcrypt

  const formData = new FormData();
  if (file) {
    formData.append("image", file); // Append your file here
  }

  // Append other data
  formData.append("username", username);
  formData.append("email", email);
  formData.append("no_hp", no_hp);
  formData.append("password", hashedPassword); // Append hashed password

  try {
    const response = await axios.put(
      `${BASE_URL}/profile/edit`, // Replace with your actual endpoint for updating profile
      formData, // Use formData instead of { username, email, no_hp, password }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Set content type for FormData
        },
      }
    );

    Swal.fire({
      title: "Success!",
      text: "Successfully updated profile.",
      icon: "success",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload(); // Refresh the page after successful update
      }
    });

    return response.data; // Return the updated profile data if needed
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
};
