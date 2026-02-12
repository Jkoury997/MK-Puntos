"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/auth/user/info`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data);

      // Fetch points if we have DNI
      if (data?.dni) {
        await fetchPoints(data.dni);
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPoints = async (dni) => {
    try {
      const response = await fetch(`/api/nasus/cliente/puntos?dni=${encodeURIComponent(dni)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setUserPoints(data);
      }
    } catch (error) {
      console.error("Error al obtener puntos:", error);
    }
  };

  const refreshPoints = async () => {
    if (userData?.dni) {
      await fetchPoints(userData.dni);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <UserContext.Provider value={{
      userData,
      userPoints,
      loading,
      refreshPoints,
      refetchUser: fetchUserDetails
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
