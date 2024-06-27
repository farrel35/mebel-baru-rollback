import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";
import "../css/ProductByCategory.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import {
  fetchProductsByCategory,
  fetchCategories,
  addToCart,
} from "./HandleAPI";

const ProductByCategory = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProductsByCategory(category);
        const categoriesData = await fetchCategories();

        const mergedProducts = productsData.map((product) => {
          const category = categoriesData.find(
            (cat) => cat.id_category === product.id_category
          );
          return {
            ...product,
            category_name: category ? category.category_name : "Unknown",
          };
        });

        setProducts(mergedProducts);
      } catch (error) {
        console.error("Error fetching data product & category", error);
      }
    };
    fetchData();
  }, [category]);

  if (!products) {
    return console.log("fasfas");
  }

  return (
    <>
      <Navbar />
      <div
        id="our-products"
        className="our-products-section container container-pcategory"
      >
        <h1>Products in {category}</h1>
        <div className="row g-4 row-cols-1 row-cols-md-3 row-cols-lg-5">
          {products.map((product) => (
            <div className="col" key={product.id_product}>
              <div className="card card-product">
                <div className="card-body">
                  <div className="text-center position-relative">
                    <Link to={`/product/${product.id_product}`}>
                      <img
                        src={`http://localhost:4000${product.image}`}
                        alt="Grocery Ecommerce Template"
                        className="mb-3 img-fluid card-img-top"
                      />
                    </Link>
                  </div>
                  <div className="text-small mb-1">
                    <Link
                      to={`/category/${product.category_name}`}
                      className="text-inherit text-decoration-none text-dark"
                    >
                      <small>{product.category_name}</small>
                    </Link>
                  </div>
                  <h5 className="card-title fs-6">
                    <Link
                      to={`/product/${product.id_product}`}
                      className="text-inherit text-decoration-none text-dark"
                    >
                      {product.product_name}
                    </Link>
                  </h5>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <span className="text-dark">
                        {formatter.format(product.price)}
                      </span>
                    </div>
                    <div>
                      <button
                        className="btn add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FontAwesomeIcon icon={faCartPlus} />
                      </button>
                    </div>
                  </div>
                </div>
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
