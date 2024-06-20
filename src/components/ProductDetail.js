// src/components/ProductDetail.js
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";
import { useCart } from "../components/CartContext";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const totalPages = Math.ceil(availableProducts.length / productsPerPage);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the product details:", error);
      });

    axios
      .get(`https://fakestoreapi.com/products`)
      .then((response) => {
        setAvailableProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching available products:", error);
      });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handlePageChange = (action) => {
    if (action === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (action === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (!product || !availableProducts.length) {
    return <div>Loading...</div>;
  }

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = availableProducts.slice(startIndex, endIndex);

  return (
    <>
      <Navbar />
      <div className="container-detail">
        <div className="main-product">
          <div className="product-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="product-details">
            <p className="product-id">Product ID : {product.id}</p>
            <h1 className="product-name">{product.title}</h1>
            <p className="product-price">Harga : ${product.price}</p>
            <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
              Tambah ke keranjang
            </button>
          </div>
        </div>
        <div className="product-info">
          <div className="description">
            <h2>Deskripsi</h2>
            <p>{product.description}</p>
          </div>
        </div>
        <div className="product-slider">
          <h2>Featured Products</h2>
          <div className="slider-container">
            <button className="slider-button prev" onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
              {"<"}
            </button>
            <div className="our-products-section product-cards">
              <div className="row justify-content-center p-3">
                {currentProducts.map((product) => (
                  <div className="col-md-3" key={product.id}>
                    <div className="card our-produk-card">
                      <Link to={`/product/${product.id}`} className="card-link">
                        <img src={product.image} className="card-img-top" alt={product.title} />
                        <div className="card-body">
                          <h5 className="card-title-allproduct">{product.title}</h5>
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
            <button className="slider-button next" onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
              {">"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTopButton />
    </>
  );
};

export default ProductDetail;
