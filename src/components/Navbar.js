import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../images/logo.png";
import "../css/Navbar.css";
import {
  fetchProducts,
  fetchCategories,
  getCart,
  getUserData,
  logout,
} from "./HandleAPI";

// Komponen Navbar
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
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

        setAllProducts(mergedProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = allProducts.filter((product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getCart();
        const productsData = await fetchProducts();

        // Merge cart items by product id
        const mergedCartItems = cartData.reduce((acc, cartItem) => {
          const existingItemIndex = acc.findIndex(
            (item) => item.id_product === cartItem.id_product
          );
          if (existingItemIndex > -1) {
            acc[existingItemIndex].quantity += cartItem.quantity;
          } else {
            const product = productsData.find(
              (prod) => prod.id_product === cartItem.id_product
            );
            acc.push({
              ...cartItem,
              product_name: product ? product.product_name : "Unknown",
              image: product ? product.image : null,
            });
          }
          return acc;
        }, []);

        setCartItems(mergedCartItems);
      } catch (error) {
        return;
      }
    };

    fetchCart();
  }, []);
  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const fetchUserData = async () => {
    try {
      const data = await getUserData();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderItems = () => {
    if (!cartItems || cartItems.length === 0) {
      return (
        <li className="dropdown-item">
          <b>No items in cart</b>
        </li>
      );
    }

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    const total = cartItems
      .reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0)
      .toFixed(2);

    return (
      <>
        {cartItems.map((item) => (
          <li key={item.id_cart} className="dropdown-item d-flex">
            <img
              src={`http://localhost:4000${item.image}`}
              alt={item.title}
              width="64"
              height="64"
              className="flex-shrink-0"
            />
            <div className="d-flex flex-column justify-content-between ms-3">
              <h6>{item.product_name}</h6>
              <p>
                {item.quantity} x $ {formatter.format(item.price)}
              </p>
            </div>
          </li>
        ))}
        <li className="dropdown-item">
          <b>Total</b>: {formatter.format(total)}
        </li>
        <li className="dropdown-divider"></li>
        <li>
          <Link to="/cart" className="dropdown-item text-center">
            View Cart
          </Link>
        </li>
      </>
    );
  };

  // Return navbar
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img
              src={logo}
              alt="Mebelin Furniture Logo"
              style={{
                width: "75px",
                height: "auto",
              }}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar2"
            aria-controls="offcanvasNavbar2"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex="-1"
            id="offcanvasNavbar2"
            aria-labelledby="offcanvasNavbar2Label"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbar2Label">
                Mebel
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="nav navbar-nav justify-content-center">
                <li className="nav-item">
                  <HashLink to="/#hero" className="nav-link">
                    Tentang Kami
                  </HashLink>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Kategori
                  </a>
                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category.id_category}>
                        <Link
                          to={`/category/${category.category_name}`}
                          className="dropdown-item"
                        >
                          {category.category_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="/all-products" className="nav-link">
                    Produk
                  </Link>
                </li>
                <li className="nav-item">
                  <HashLink to="/#faq" className="nav-link">
                    FAQS
                  </HashLink>
                </li>
              </ul>
              <div className="nav navbar-nav justify-content-center flex-grow-1 pe-3">
                <div className="container fluid">
                  <form
                    className="d-flex mt-3 mt-lg-0 mx-auto search-form position-relative w-100"
                    role="search"
                  >
                    <div className="input-group w-100">
                      <span className="input-group-text">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                      />
                    </div>
                    {searchResults.length > 0 && (
                      <ul className="dropdown-menu show search-dropdown position-absolute">
                        {searchResults.map((result) => (
                          <li key={result.id_product}>
                            <Link
                              to={`/product/${result.id_product}`}
                              className="dropdown-item"
                            >
                              {result.product_name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </form>
                </div>
              </div>
              <ul className="nav navbar-nav d-flex justify-content-center">
                <li className="nav-item dropdown">
                  <a
                    href="#"
                    className="nav-link"
                    id="cartDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span className="position-absolute top-5 translate-middle badge bg-danger navbar-badge">
                      {cartItems.length}
                    </span>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="cartDropdown"
                  >
                    {renderItems()}
                  </ul>
                </li>
                {isLoggedIn ? (
                  <li className="nav-item dropdown">
                    <a
                      href="#"
                      className="nav-link"
                      id="userDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {/* <FontAwesomeIcon icon={faUser} /> */}
                      {/* <img
                        src={userData.avatarUrl}
                        alt={userData.username}
                        className="avatar"
                      /> */}
                      {userData.username}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <a className="dropdown-item" href="/profile">
                          Profile
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href=""
                          onClick={handleLogout}
                        >
                          Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link
                      to="/login"
                      className="btn btn-outline-light ms-2 px-4"
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
