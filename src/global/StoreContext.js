import React, { useState, createContext, useEffect } from "react";

export const StoreContext = createContext();

export const StoreContextProvider = (props) => {
  // Store user 1 start
  const [loggedInUser, setLoggedInUser] = useState("");
  const [users, setUsers] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUsers = localStorage.getItem("users");
      return storedUsers ? JSON.parse(storedUsers) : [];
    } else {
      return [];
    }
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);
  // Store user 1 end

  // Store user 2 start
  // Store user 2 end

  // Store user 3 start
  // Store user 3 end

  const Store = {
    // Store user 1 start
    loggedInUser,
    setLoggedInUser,
    users,
    setUsers,
    // Store user 1 end

    // Store user 2 start
    // Store user 2 end

    // Store user 3 start
    // Store user 3 end
  };

  return <StoreContext.Provider value={[Store]}>{props.children}</StoreContext.Provider>;
};
