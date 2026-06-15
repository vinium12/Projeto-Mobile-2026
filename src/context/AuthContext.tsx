import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type TeamPokemon = {
    id: string;
    index: string;
    nome: string;
    imagem: string;
};

export type UserProfile = {
    id: string;
    name: string;
    image: any;
    victories: number;
    defeats: number;
    matches: number;
    team: TeamPokemon[];
};

type AuthContextData = {
    isAuthenticated: boolean;
    user: string | null;
    userProfile: UserProfile | null;
    isLoading: boolean;
    signIn: (username: string, userId: string) => Promise<void>;
    signOut: () => void;
    addToTeam: (pokemon: TeamPokemon) => void;
    removeFromTeam: (pokemonId: string) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storageUser = await AsyncStorage.getItem('@Auth:user');
            const storageUserId = await AsyncStorage.getItem('@Auth:userId');
            const storageTeam = await AsyncStorage.getItem('@Auth:team');

            if (storageUser && storageUserId) {
                const team = storageTeam ? JSON.parse(storageTeam) : [];
                setUser(storageUser);
                setUserProfile({
                    id: storageUserId,
                    name: storageUser,
                    image: null,
                    victories: 0,
                    defeats: 0,
                    matches: 0,
                    team,
                });
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        }
        loadStorageData();
    }, []);

    async function signIn(username: string, userId: string) {
        setUser(username);
        setUserProfile({
            id: userId,
            name: username,
            image: null,
            victories: 0,
            defeats: 0,
            matches: 0,
            team: [],
        });
        setIsAuthenticated(true);
        await AsyncStorage.setItem('@Auth:user', username);
        await AsyncStorage.setItem('@Auth:userId', userId);
    }

    async function signOut() {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        await AsyncStorage.removeItem('@Auth:user');
        await AsyncStorage.removeItem('@Auth:userId');
        await AsyncStorage.removeItem('@Auth:team');
    }

    async function addToTeam(pokemon: TeamPokemon) {
        if (userProfile && userProfile.team.length < 5) {
            const updatedProfile = {
                ...userProfile,
                team: [...userProfile.team, pokemon],
            };
            setUserProfile(updatedProfile);
            await AsyncStorage.setItem('@Auth:team', JSON.stringify(updatedProfile.team));
        }
    }

    async function removeFromTeam(pokemonId: string) {
        if (userProfile) {
            const updatedTeam = userProfile.team.filter(p => p.id !== pokemonId);
            const updatedProfile = {
                ...userProfile,
                team: updatedTeam,
            };
            setUserProfile(updatedProfile);
            await AsyncStorage.setItem('@Auth:team', JSON.stringify(updatedTeam));
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userProfile, signIn, signOut, isLoading, addToTeam, removeFromTeam }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
