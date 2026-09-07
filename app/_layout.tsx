import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";

//componente para manejar la lógica de redirección en la sesión
function RootNavigation() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === "(tabs)";

    if (!isAuthenticated && inTabsGroup) {
      //si no está autentificado y trata de entrar a los tabs, se redirige al login
      router.replace('/');
    } else if (isAuthenticated && !inTabsGroup) {
      //si está autentificado y está en login, se redirige a la calculadora
      router.replace('/(tabs)/calculator');
    }
  }, [isAuthenticated, segments, router]);
  
  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </AuthProvider>
  );
}