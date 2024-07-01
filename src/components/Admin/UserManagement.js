import React, { useState, useEffect } from "react";
import "../../css/Admin-css/usermanagement.css";
import { fetchAllUsers, changeRole } from "./HandleAPI_Admin";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allUsersData = await fetchAllUsers();
        setUsers(allUsersData);
      } catch (error) {
        console.error("Error fetching data product & category", error);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const changeRoles = await changeRole(userId, newRole);
      if (changeRoles.payload) {
        const allUsersData = await fetchAllUsers();
        setUsers(allUsersData);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  return (
    <div className="user-management">
      <h2>Manage Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Edit Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_user}>
              <td>{user.id_user}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.id_user, e.target.value)
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
