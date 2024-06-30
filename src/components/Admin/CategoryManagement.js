import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/Admin-css/Category-admin.css";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./HandleAPI_Admin";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [newCategory, setNewCategory] = useState({
    category_name: "",
    categorys: "", // Check if this should be `category_code` or similar
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedCategory) {
      setSelectedCategory({
        ...selectedCategory,
        [name]: value,
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: value,
      });
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedCategory(null);
    setEditModalOpen(false);
  };

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setError(""); // Clear error on modal close
    setNewCategory({
      category_name: "",
      categorys: "",
    });
    setFile(null); // Reset file state on modal close
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleDeleteCategory = async (id_category) => {
    const result = await deleteCategory(id_category);
    if (result.payload.isSuccess) {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedCategory.category_name || !selectedCategory.categorys) {
      setError("Please fill out all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("id_category", selectedCategory.id_category);
    formData.append("category_name", selectedCategory.category_name);
    formData.append("categorys", selectedCategory.categorys);

    if (file) {
      formData.append("image", file);
    }
    console.log(selectedCategory.categorys);
    try {
      await updateCategory(formData);
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
      closeEditModal();
    } catch (error) {
      alert("Failed to update category");
    }
  };

  const handleSubmitCreate = async () => {
    if (!newCategory.category_name || !newCategory.categorys || !file) {
      setError("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", newCategory.category_name);
    formData.append("categorys", newCategory.categorys);

    if (file) {
      formData.append("image", file);
    }

    try {
      await createCategory(formData);
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
      closeCreateModal();
    } catch (error) {
      alert("Failed to create category");
    }
  };

  return (
    <div className="category-management">
      <h2>Manage Categories</h2>
      <div className="add-category">
        <button className="btn btn-primary" onClick={openCreateModal}>
          Add Category
        </button>
      </div>
      <table className="category-table">
        <thead>
          <tr>
            <th>Category Code</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id_category}>
              <td>{category.categorys}</td>
              <td>{category.category_name}</td>
              <td>
                <button onClick={() => openEditModal(category)}>Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteCategory(category.id_category)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editModalOpen && selectedCategory && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeEditModal}>
              &times;
            </span>
            <div className="row">
              <div className="col-lg-7">
                <h2>Edit Category</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form>
                  <label>
                    Nama Kategori:
                    <input
                      type="text"
                      name="category_name"
                      value={selectedCategory.category_name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </label>

                  <label>
                    Kode Kategori:
                    <input
                      type="text"
                      name="categorys"
                      value={selectedCategory.categorys}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </label>

                  <label>
                    Category Image:
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
                    src={`http://localhost:4000${selectedCategory.image}`}
                    alt="Default Preview"
                    className="img-fluid"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {createModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeCreateModal}>
              &times;
            </span>
            <div className="row">
              <div className={!file ? "col-12" : "col-lg-7"}>
                <h2>Create Category</h2>

                <form>
                  <label>
                    Category Name:
                    <input
                      type="text"
                      name="category_name"
                      value={newCategory.category_name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </label>

                  <label>
                    Category Code:
                    <input
                      type="text"
                      name="categorys"
                      value={newCategory.categorys}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </label>

                  <label>
                    Category Image:
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="form-control-file"
                    />
                  </label>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <button
                    type="button"
                    className="create-button btn btn-primary"
                    onClick={handleSubmitCreate}
                  >
                    Create Category
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

export default CategoryManagement;
