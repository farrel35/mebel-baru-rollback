import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";

import "../css/AllProduct.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = (category = "") => {
    let url = "https://fakestoreapi.com/products";
    if (category) {
      url = `https://fakestoreapi.com/products/category/${category}`;
    }
    axios
      .get(url)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const fetchCategories = () => {
    axios
      .get("https://fakestoreapi.com/products/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchProducts(category);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Navbar />
      <div className="container-allproduct">
        <div className="row align-items-start">
          <div className="col-12">
            <h1 className="my-4">All Products</h1>
          </div>
          <div className="col-md-2">
            <div className="card-category">
              <div className="card-header">Category</div>
              <ul className="list-group list-group-flush">
                <li
                  className={`list-group-item ${
                    selectedCategory === "" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick("")}
                >
                  All Products
                </li>
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`list-group-item ${
                      selectedCategory === category ? "active" : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-10">
            <section id="all-products" className="all-products-section">
              <div id="our-products" className="our-products-section">
                <div className="row">
                  {currentProducts.map((product) => (
                    <div className="col-md-3 mb-5" key={product.id}>
                      <div className="card our-produk-card">
                        <Link
                          to={`/product/${product.id}`}
                          className="card-link"
                        >
                          <img
                            src={product.image}
                            className="card-img-top"
                            alt={product.title}
                          />
                          <div className="card-body">
                            <h5 className="card-title-allproduct">
                              {product.title}
                            </h5>
                            <p className="card-text">
                              <strong>${product.price}</strong>
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <nav>
                <ul className="pagination">
                  {pageNumbers.map((number) => (
                    <li key={number} className="page-item">
                      <a
                        onClick={() => paginate(number)}
                        href="#!"
                        className="page-link"
                      >
                        {number}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTopButton />
    </>
  );
};

export default AllProducts;
