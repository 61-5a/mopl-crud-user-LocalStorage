/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { StoreContext } from "@/global/StoreContext";
import AddOrEditUsers from "@/components/addOrEditUsers";

import styles from "./index.module.css";

type UserType = {
  id: number;
  name: string;
  email: string;
  photo: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [Store] = useContext(StoreContext);
  const loggedInUser = Store.loggedInUser;
  const setLoggedInUser = Store.setLoggedInUser;
  const users = Store.users;
  const setUsers = Store.setUsers;

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setLoggedInUser(loggedInUser);
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const toggleUserSelection = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    }
  };
  const handleDeleteClick = () => {
    if (selectedUsers.length === 0) {
      return;
    }
    setIsConfirmationDialogOpen(true);
  };

  const confirmDelete = () => {
    setIsConfirmationDialogOpen(false);
    const updatedUsers = users.reduce((accumulator: UserType[], user: UserType) => {
      if (!selectedUsers.includes(user.id)) {
        accumulator.push(user);
      }
      return accumulator;
    }, []);
    setUsers(updatedUsers);
    setSelectedUsers([]);
  };

  return (
    <>
      {loggedInUser ? (
        <div>
          <div className="flex items-center justify-between p-4 pb-0">
            <h2>User list</h2>

            <div>
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleDeleteClick}
                  className="px-4 py-2 mr-4 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                >
                  Delete Selected
                </button>
              )}
              <button
                className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                onClick={() => {
                  setIsModalOpen(true);
                  setEditUser(null);
                }}
              >
                Add user
              </button>
            </div>
            <>
              {isModalOpen && (
                <>
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                      onClick={() => setIsModalOpen(false)}
                      className="fixed inset-0 z-51 bg-black bg-opacity-40"
                    ></div>
                    <div className="bg-white p-8 w-1/2 fixed z-52">
                      <AddOrEditUsers editUser={editUser} setEditUser={setEditUser} setIsModalOpen={setIsModalOpen} />
                    </div>
                  </div>
                </>
              )}
            </>
            <>
              {isConfirmationDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div
                    onClick={() => setIsConfirmationDialogOpen(false)}
                    className="fixed inset-0 z-51 bg-black bg-opacity-40"
                  ></div>
                  <div className="bg-white p-8 w-1/3 text-center rounded-md shadow-md  fixed z-52">
                    <p className="text-lg font-semibold mb-4">Confirm Deletion</p>
                    <p className="text-gray-700">Are you sure you want to delete the selected users?</p>
                    <div className="mt-6 flex justify-center space-x-4">
                      <button
                        onClick={() => setIsConfirmationDialogOpen(false)}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          </div>
          <div className="p-4 pt-0">
            <div className="flex flex-col">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th scope="col" className="px-6 py-4"></th>
                        <th scope="col" className="px-6 py-4">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Photo
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((user: UserType) => (
                        <tr key={user?.id} className="border-b dark:border-neutral-500">
                          <td className="whitespace-nowrap px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                            />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">{user?.id}</td>
                          <td className="whitespace-nowrap px-6 py-4 font-medium">{user?.name}</td>
                          <td className="whitespace-nowrap px-6 py-4">{user?.email}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <img src={user?.photo} className={styles.profile_img} alt="image" />{" "}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <button
                              onClick={() => {
                                setIsModalOpen(true);
                                setEditUser(user);
                              }}
                              className="px-4 py-2 mr-4 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setIsConfirmationDialogOpen(true);
                                setSelectedUsers([user.id]);
                              }}
                              className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div onClick={() => router.push(`/`)}>Go to login</div>{" "}
        </div>
      )}
    </>
  );
}
