
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
    signIn: (username: string) => void;
    signOut: () => void;
    addToTeam: (pokemon: TeamPokemon) => void;
    removeFromTeam: (pokemonId: string) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const mockProfiles: Record<string, UserProfile> = {
    kleber: {
        id: '1',
        name: 'Kleber',
        image: require('../../assets/images/Madruga.jpg'),
        victories: 12,
        defeats: 5,
        matches: 17,
        team: [],
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storageUser = await AsyncStorage.getItem('@Auth:user')
            const storageTeam = await AsyncStorage.getItem('@Auth:team')

            if(storageUser) {
                const profile = mockProfiles[storageUser];
                if(profile && storageTeam) {
                    profile.team = JSON.parse(storageTeam);
                }
                setUser(storageUser);
                setUserProfile(profile || null);
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        }
        loadStorageData();
    }, []);
    
    async function signIn(username: string) {
        const profile = mockProfiles[username];
        setUser(username);
        setUserProfile(profile || null);
        setIsAuthenticated(true);
        await AsyncStorage.setItem('@Auth:user', username);
    }

    async function signOut() {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        await AsyncStorage.removeItem('@Auth:user');
        await AsyncStorage.removeItem('@Auth:team');
    }

    async function addToTeam(pokemon: TeamPokemon) {
        if(userProfile && userProfile.team.length < 5) {
            const updatedProfile = {
                ...userProfile,
                team: [...userProfile.team, pokemon]
            };
            setUserProfile(updatedProfile);
            await AsyncStorage.setItem('@Auth:team', JSON.stringify(updatedProfile.team));
        }
    }

    async function removeFromTeam(pokemonId: string) {
        if(userProfile) {
            const updatedTeam = userProfile.team.filter(p => p.id !== pokemonId);
            const updatedProfile = {
                ...userProfile,
                team: updatedTeam
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