// src/components/Admin/CategoryManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/Admin-css/Category-admin.css";
import {
  fetchCategories, // Import fetchCategories function
} from "./HandleAPI_Admin";
const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState({ id: "", name: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories(); // Fetch categories
        setCategories(categoriesData); // Assuming categories are in payload[0]
      } catch (error) {
        console.error("Error fetching data product & category", error);
      }
    };
    fetchData();
  }, []);

  const handleAddCategory = () => {
    if (newCategory) {
      axios
        .post("https://fakestoreapi.com/products/categories", {
          name: newCategory,
        })
        .then((response) => {
          fetchCategories();
          setNewCategory("");
        })
        .catch((error) => console.error("Error adding category:", error));
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
  };

  const handleUpdateCategory = () => {
    if (editCategory.name) {
      axios
        .put(
          `https://fakestoreapi.com/products/categories/${editCategory.id}`,
          { name: editCategory.name }
        )
        .then((response) => {
          fetchCategories();
          setEditCategory({ id: "", name: "" });
        })
        .catch((error) => console.error("Error updating category:", error));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "newCategory") {
      setNewCategory(value);
    } else {
      setEditCategory((prev) => ({ ...prev, name: value }));
    }
  };

  return (
    <div className="category-management">
      <h2>Manage Categories</h2>
      <div className="add-category">
        <input
          type="text"
          name="newCategory"
          value={newCategory}
          onChange={handleInputChange}
          placeholder="Add new category"
        />
        <button onClick={handleAddCategory}>Add</button>
      </div>
      <table className="category-table">
        <thead>
          <tr>
            <th>Kode Kategori</th>
            <th>Kategori</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id_category}>
              <td>{category.categorys}</td>
              <td>
                {editCategory.id === category.id_category ? (
                  <input
                    type="text"
                    name="editCategory"
                    value={editCategory.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  category.category_name
                )}
              </td>
              <td>
                {editCategory.id === category.id_category ? (
                  <button onClick={handleUpdateCategory}>Save</button>
                ) : (
                  <button
                    onClick={() =>
                      handleEditCategory({
                        id: category.id_category,
                        name: category.category_name,
                      })
                    }
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManagement;
