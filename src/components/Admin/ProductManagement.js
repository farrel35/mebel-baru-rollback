import React, { useState, useEffect } from "react";
import "../../css/Admin-css/produkadmin.css";
import { fetchProducts, updateProduct, deleteProduct } from "./HandleAPI_Admin";

const ProductManagement = () => {
  const [products, setProducts] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold the selected product
  const [file, setFile] = useState(null); // State to hold the selected file

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({
      ...selectedProduct,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleDeleteProduct = async (id_product) => {
    deleteProduct(id_product);
    const productsData = await fetchProducts();
    setProducts(productsData);
  };

  const handleSubmit = async () => {
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
      const response = await updateProduct(formData);
      const productsData = await fetchProducts();
      setProducts(productsData);
      closeModal();
    } catch (error) {
      alert("Failed to update product");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data product & category", error);
      }
    };
    fetchData();
  }, []);

  if (!products) {
    return null;
  }

  return (
    <div className="product-management">
      <h2>Manage Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
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
              <td>
                <button className="edit-btn" onClick={() => openModal(product)}>
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

      {modalOpen && selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="row">
              <div className="col-lg-7">
                <h2>Edit Product</h2>
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
                      rows="5" // You can adjust the number of rows as needed
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
                    onClick={handleSubmit}
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
    </div>
  );
};

export default ProductManagement;
