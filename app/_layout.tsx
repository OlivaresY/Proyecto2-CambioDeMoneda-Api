import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";

//componente para manejar la logpica de redireccion en la session
function RootNavihation() {
  const { user, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === "(tabs)";

    if (!isAuthenticated && inTabsGroup) {
      //si no esta autentificado y trata de entrar alos tabs, se redirige al login
      router.replace('/');
    } else if (isAuthenticated && !inTabsGroup) {
      //si esta autentificado y esta en login, se redirige a la calculadora
      router.replace('/(tabs)/calculator');
    }
  }, [isAuthenticated, segments]);
  
  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootNavihation />
      </ThemeProvider>
    </AuthProvider>
  );
}