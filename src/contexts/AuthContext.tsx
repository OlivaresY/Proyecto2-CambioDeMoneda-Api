import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Role = 'ADMIN' | 'CLIENT';

export interface User {
    id: string;
    name: string;
    role: Role;
}

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    login: (userDate: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextData => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};