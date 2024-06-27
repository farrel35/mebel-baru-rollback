import React, { useState, useEffect } from "react";
import "../css/Profile.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import EditPhoto from "./EditPhoto";
import { getUserData, updateProfile } from "./HandleAPI";

const Profile = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    "https://via.placeholder.com/150"
  );
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    no_hp: "",
    password: "", // State for password
  });
  const [file, setFile] = useState(null); // State to hold the selected file

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await getUserData();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = () => {
    const inputData = {
      username: userData.username,
      email: userData.email,
      no_hp: userData.no_hp,
      password: userData.password, // Include password in inputData
    };

    // Call updateProfile with both profile data and file
    updateProfile(inputData, file)
      .then((response) => {
        console.log("Profile updated successfully:", response);
      })
      .catch((error) => {
        console.error("Failed to update profile:", error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h1>Profil Pengguna</h1>
        <div className="profile-details">
          <img src={profilePicture} alt="Profile" className="profile-picture" />

          <div className="profile-info">
            <p>
              <strong>Nama:</strong> {userData.username}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>No Hp:</strong> {userData.no_hp}
            </p>
            <button className="edit-button" onClick={openModal}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <h2>Edit Profil</h2>
              <form>
                <label>
                  Nama:
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  No Hp:
                  <input
                    type="text"
                    name="no_hp"
                    value={userData.no_hp}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Password:
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Foto Profil:
                  <input type="file" onChange={handleFileChange} />
                </label>

                <button
                  type="button"
                  className="edit-button"
                  onClick={handleSubmit}
                >
                  Simpan Perubahan
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
