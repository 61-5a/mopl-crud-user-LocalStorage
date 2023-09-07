/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "@/global/StoreContext";

import styles from "./addOrEditUsers.module.css";

type UserType = {
  id: number;
  name: string;
  email: string;
  photo: string;
};
interface AddOrEditUsersProps {
  editUser: UserType | null;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const AddOrEditUsers: React.FC<AddOrEditUsersProps> = ({ editUser, setEditUser, setIsModalOpen }) => {
  const [Store] = useContext(StoreContext);
  const users = Store.users;
  const setUsers = Store.setUsers;

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    photo: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "name") {
      if (value.trim() === "") {
        setErrors({ ...errors, name: "Name is required" });
      } else {
        setErrors({ ...errors, name: "" });
      }
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors({ ...errors, email: "Invalid email format" });
      } else {
        setErrors({ ...errors, email: "" });
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData({ ...formData, photo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.photo) {
      alert("Please fill all fields");
      return;
    }
    if (errors.name || errors.email) {
      alert("Please fix the validation errors");
      return;
    }

    const newUser = {
      id: formData.id || Date.now(),
      name: formData.name,
      email: formData.email,
      photo: formData.photo,
    };

    if (editUser) {
      const updatedUsers = users.map((user: UserType) => (user.id === editUser.id ? newUser : user));
      setUsers(updatedUsers);
      setEditUser(null);
    } else {
      setUsers([...users, newUser]);
    }

    setFormData({
      id: 0,
      name: "",
      email: "",
      photo: "",
    });
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (editUser) {
      setFormData(editUser);
    }
  }, [editUser]);

  return (
    <>
      <form className="w-full" onSubmit={addUser}>
        <div className={styles.close} onClick={() => setIsModalOpen(false)}>
          <img src="/img/icons/close.svg" alt="Close" />
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-name">
              Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-name"
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email">
              Email
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3  leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-email"
              type="email"
              placeholder="test@mail.com"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
          </div>
        </div>

        <div className="m-4">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-name">
            Profile Image Upload
          </label>
          <div className="flex items-center justify-center w-full">
            {formData.photo ? <img src={formData.photo} className={styles.uploded_img} alt="image" /> : null}
            <label className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center pt-7">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">Attach a file</p>
                </div>
              </div>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handleFileInputChange}
                required={!editUser}
                className="opacity-0"
              />
            </label>
          </div>
        </div>
        <div className={styles.submit}>
          <button
            className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
            type="submit"
          >
            {editUser !== null ? "Update user" : "Add user"}
          </button>
        </div>
      </form>
    </>
  );
};
export default AddOrEditUsers;
