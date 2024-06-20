import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";
import "../css/ProductByCategory.css";

const ProductByCategory = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/category/${category}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products by category:", error);
      });
  }, [category]);

  return (
    <>
      <Navbar />
      <div
        id="our-products"
        className="our-products-section container container-pcategory"
      >
        <h1>Products in {category}</h1>
        <div className="row">
          {products.map((product) => (
            <div className="col-md-3 mb-5" key={product.id}>
              <div className="card our-produk-card">
                <Link to={`/product/${product.id}`} className="card-link">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}
                  />
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
      <Footer />
      <BackToTopButton />
    </>
  );
};

export default ProductByCategory;
