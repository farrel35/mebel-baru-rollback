import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:4000";

export const fetchAllUsers = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      title: "Error!",
      text: "Anda harus login.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.payload;
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.response
        ? error.response.data.message
        : "Something went wrong. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
  }
};

export const fetchProducts = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      title: "Error!",
      text: "Anda harus login.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}/admin/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.payload;
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.response
        ? error.response.data.message
        : "Something went wrong. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
  }
};

export const fetchCategories = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      title: "Error!",
      text: "Anda harus login.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}/admin/category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.payload;
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.response
        ? error.response.data.message
        : "Something went wrong. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
  }
};

export const createProduct = async (formData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`${BASE_URL}/admin/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Set content type for FormData
      },
    });

    Swal.fire({
      title: "Success!",
      text: "Sukses menambahkan produk.",
      icon: "success",
      confirmButtonText: "OK",
    });

    return response.data; // Ensure the response is correctly structured
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};

export const updateProduct = async (formData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(`${BASE_URL}/admin/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Set content type for FormData
      },
    });

    Swal.fire({
      title: "Success!",
      text: "Sukses update produk.",
      icon: "success",
      confirmButtonText: "OK",
    });

    return response.data; // Ensure the response is correctly structured
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};

export const deleteProduct = async (idProduct) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  // Show confirmation dialog
  const result = await Swal.fire({
    title: "Apakah kamu yakin?",
    text: "Apakah kamu yakin menghapus produk ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
  });

  // Proceed with deletion if the user confirms
  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`${BASE_URL}/admin/products`, {
        data: { id_product: idProduct }, // Correctly send id_product in the request body
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Sukses!",
        text: "Berhasil menghapus produk.",
        icon: "success",
        confirmButtonText: "OK",
      });

      return response.data;
    } catch (error) {
      // Handle error, e.g., show error message
      console.error("Error deleting product:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal menghapus produk.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } else {
    // If the user cancels the action, show a cancellation message
    Swal.fire({
      title: "Batal",
      text: "Produk batal dihapus",
      icon: "info",
      confirmButtonText: "OK",
    });
  }
};

export const createCategory = async (formData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`${BASE_URL}/admin/category`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Set content type for FormData
      },
    });

    Swal.fire({
      title: "Success!",
      text: "Sukses menambahkan category.",
      icon: "success",
      confirmButtonText: "OK",
    });

    return response.data; // Ensure the response is correctly structured
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};

export const updateCategory = async (formData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(`${BASE_URL}/admin/category`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Set content type for FormData
      },
    });

    Swal.fire({
      title: "Sukses!",
      text: "Sukses update category.",
      icon: "success",
      confirmButtonText: "OK",
    });

    return response.data; // Ensure the response is correctly structured
  } catch (error) {
    console.error("Error updating category", error);
    throw error;
  }
};

export const deleteCategory = async (idCategory) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  // Show confirmation dialog
  const result = await Swal.fire({
    title: "Apakah kamu yakin?",
    text: "Apakah kamu yakin menghapus kategori ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
  });

  // Proceed with deletion if the user confirms
  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`${BASE_URL}/admin/category`, {
        data: { id_category: idCategory }, // Correctly send id_product in the request body
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Sukses!",
        text: "Berhasil menghapus kategori.",
        icon: "success",
        confirmButtonText: "OK",
      });
      return response.data;
    } catch (error) {
      // Handle error, e.g., show error message
      console.error("Error deleting kategori:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal menghapus kategori.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } else {
    // If the user cancels the action, show a cancellation message
    Swal.fire({
      title: "Batal",
      text: "Kategori batal dihapus",
      icon: "info",
      confirmButtonText: "OK",
    });
  }
};

export const changeRole = async (userId, newRole) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:4000/admin`,
      { id_user: userId, role: newRole }, // Correctly send id_user and role in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    Swal.fire({
      title: "Sukses!",
      text: "Sukses mengganti role.",
      icon: "success",
      confirmButtonText: "OK",
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
  }
};
