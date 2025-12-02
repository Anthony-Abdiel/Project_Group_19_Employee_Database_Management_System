import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);
const API_BASE_URL = "/api";

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // fetch from the backend database on first render
  useEffect(() => {

    async function fetchUser() {
      
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        credentials: "include" 
        });

        if(!response.ok) {
          //user is not logged in 
          console.log("Detected New User!!")
          setCurrentUser(null);

        } else {
          const fetchedUser = await response.json();

          setCurrentUser(fetchedUser);
        }

      } catch(err){
        console.log("Error fetching from /me: ", err);
        setCurrentUser(null);
      }
      
    }

    fetchUser();
  }, []);

  const login = async (credentials) => {

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(credentials)
      });

      //verifying the response
      if(response.ok) {
        //if successful, log it and set the user based on backend data
        console.log("Successful User Login");
        const user = await response.json();

        setCurrentUser(user);
        return user;

      } else {
        console.log("Login Unsuccessful");
        setCurrentUser(null);
        return null;
      }

      
    } catch(err) {  
      console.error("Error loggin in: ", err);
      setCurrentUser(null);
      return null;
    }    
  };

  const logout = async () => {

    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include"
      });

      if(response.ok) {
        setCurrentUser(null);

        console.log("Successful Logout");
      } else {
        console.error("Logout Failed");
      }
    } catch(err) {
      console.error("Logout Error: ", err);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
