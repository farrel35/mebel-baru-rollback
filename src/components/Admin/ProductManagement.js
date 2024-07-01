import React, { useState, useEffect } from "react";
import "../../css/Admin-css/produkadmin.css";
import {
  fetchProducts,
  updateProduct,
  deleteProduct,
  createProduct,
  fetchCategories, // Import fetchCategories function
} from "./HandleAPI_Admin";

const ProductManagement = () => {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null); // State to hold categories
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product for editing
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    description: "",
    price: "",
    stock: "",
    id_category: "", // Initialize id_category state
  });
  const [file, setFile] = useState(null); // State to hold selected file
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
        const categoriesData = await fetchCategories(); // Fetch categories
        setProducts(productsData);
        setCategories(categoriesData); // Assuming categories are in payload[0]
      } catch (error) {
        console.error("Error fetching data product & category", error);
      }
    };
    fetchData();
  }, []);

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
    setEditModalOpen(false);
  };

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        [name]: value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleDeleteProduct = async (id_product) => {
    await deleteProduct(id_product);

    const productsData = await fetchProducts();
    setProducts(productsData);
  };

  const handleSubmitEdit = async () => {
    if (
      !selectedProduct.product_name ||
      !selectedProduct.description ||
      !selectedProduct.price ||
      !selectedProduct.stock
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("id_product", selectedProduct.id_product);
    formData.append("product_name", selectedProduct.product_name);
    formData.append("description", selectedProduct.description);
    formData.append("price", selectedProduct.price);
    formData.append("stock", selectedProduct.stock);

    if (file) {
      formData.append("image", file);
    }

    try {
      const updateProducts = await updateProduct(formData);
      if (updateProducts.payload.isSuccess) {
        const productsData = await fetchProducts();
        setProducts(productsData);
      }

      closeEditModal();
    } catch (error) {
      alert("Failed to update product");
    }
  };

  const handleSubmitCreate = async () => {
    if (
      !newProduct.product_name ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.id_category ||
      !file
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", newProduct.product_name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    formData.append("id_category", newProduct.id_category);

    if (file) {
      formData.append("image", file);
    }

    try {
      const createProducts = await createProduct(formData);
      if (createProducts.payload.isSuccess) {
        const productsData = await fetchProducts();
        setProducts(productsData);
      }
      closeCreateModal();
    } catch (error) {
      alert("Failed to create product");
    }
  };

  if (!products || !categories) {
    return null; // or loading indicator
  }

  return (
    <div className="product-management">
      <h2>Manage Products</h2>
      <button className="create-btn" onClick={openCreateModal}>
        Create New Product
      </button>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th> {/* Add Category header */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id_product}>
              <td>{product.id_product}</td>
              <td>{product.product_name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.category_name}</td> {/* Display category name */}
              <td>
                <button
                  className="edit-btn"
                  onClick={() => openEditModal(product)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product.id_product)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Product Modal */}
      {editModalOpen && selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeEditModal}>
              &times;
            </span>
            <div className="row">
              <div className="col-lg-7">
                <h2>Edit Product</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="product_name"
                      value={selectedProduct.product_name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </label>

                  <label>
                    Description:
                    <textarea
                      name="description"
                      value={selectedProduct.description}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="5"
                    />
                  </label>

                  <label>
                    Price:
                    <input
                      type="number"
                      name="price"
                      value={selectedProduct.price}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </label>

                  <label>
                    Stock:
                    <input
                      type="number"
                      name="stock"
                      value={selectedProduct.stock}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </label>

                  <label>
                    Product Image:
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="form-control-file"
                    />
                  </label>

                  <button
                    type="button"
                    className="edit-button btn btn-primary"
                    onClick={handleSubmitEdit}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
              <div className="col-lg-5">
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src={`http://localhost:4000${selectedProduct.image}`}
                    alt="Default Preview"
                    className="img-fluid"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {createModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeCreateModal}>
              &times;
            </span>
            <div className="row">
              <div className={!file ? "col-12" : "col-lg-7"}>
                <h2>Create Product</h2>
                {error && <div className="alert alert-danger">{error}</div>}

                <form>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="product_name"
                      value={newProduct.product_name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </label>

                  <label>
                    Description:
                    <textarea
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="5"
                    />
                  </label>

                  <label>
                    Price:
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </label>

                  <label>
                    Stock:
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </label>

                  <label>
                    Category:
                    <select
                      name="id_category"
                      value={newProduct.id_category}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option
                          key={category.id_category}
                          value={category.id_category}
                        >
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Product Image:
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="form-control-file"
                    />
                  </label>

                  <button
                    type="button"
                    className="create-button btn btn-primary"
                    onClick={handleSubmitCreate}
                  >
                    Create Product
                  </button>
                </form>
              </div>
              {file && (
                <div className="col-lg-5">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="img-fluid"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
