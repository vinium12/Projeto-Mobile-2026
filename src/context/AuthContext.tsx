import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getStats, login as loginApi, register as registerApi } from "../integration/authIntegration";

export type TeamPokemon = {
    id: string;
    index: string;
    nome: string;
    imagem: string;
};

export type UserProfile = {
    id: string;
    name: string;
    image: string | null;
    victories: number;
    defeats: number;
    matches: number;
    team: TeamPokemon[];
};

type AuthContextData = {
    isAuthenticated: boolean;
    user: string | null;
    token: string | null;
    userProfile: UserProfile | null;
    isLoading: boolean;
    statsLoading: boolean;
    signIn: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    signUp: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    signOut: () => void;
    refreshStats: () => Promise<void>;
    addToTeam: (pokemon: TeamPokemon) => void;
    removeFromTeam: (pokemonId: string) => void;
    updateAvatar: (base64: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(false);

    function fetchStats(userId: string) {
        setStatsLoading(true);
        getStats(userId)
            .then((stats) => {
                setUserProfile((prev) => prev ? {
                    ...prev,
                    victories: stats.vitorias,
                    defeats: stats.derrotas,
                    matches: stats.vitorias + stats.derrotas,
                } : prev);
            })
            .catch((e) => console.error('Erro ao carregar stats:', e))
            .finally(() => setStatsLoading(false));
    }

    useEffect(() => {
        async function loadStorageData() {
            const storageUser = await AsyncStorage.getItem('@Auth:user');
            const storageUserId = await AsyncStorage.getItem('@Auth:userId');
            const storageToken = await AsyncStorage.getItem('@Auth:token');
            const storageTeam = await AsyncStorage.getItem('@Auth:team');
            const storageAvatar = storageUserId
                ? await AsyncStorage.getItem(`@Auth:avatar:${storageUserId}`)
                : null;

            if (storageUser && storageUserId && storageToken) {
                const team = storageTeam ? JSON.parse(storageTeam) : [];
                setUser(storageUser);
                setToken(storageToken);
                setUserProfile({
                    id: storageUserId,
                    name: storageUser,
                    image: storageAvatar ?? null,
                    victories: 0,
                    defeats: 0,
                    matches: 0,
                    team,
                });
                setIsAuthenticated(true);
                fetchStats(storageUserId);
            }
            setIsLoading(false);
        }
        loadStorageData();
    }, []);

    async function signIn(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
        try {
            const response = await loginApi({ username, password });

            const cleanUsername = username.trim();
            const savedAvatar = await AsyncStorage.getItem(`@Auth:avatar:${response.userId}`);

            setUser(cleanUsername);
            setToken(response.token ?? null);
            setIsAuthenticated(true);
            setUserProfile({
                id: response.userId,
                name: cleanUsername,
                image: savedAvatar ?? null,
                victories: 0,
                defeats: 0,
                matches: 0,
                team: [],
            });

            await AsyncStorage.setItem('@Auth:user', cleanUsername);
            await AsyncStorage.setItem('@Auth:userId', response.userId);
            if (response.token) {
                await AsyncStorage.setItem('@Auth:token', response.token);
            } else {
                console.warn('[signIn] Backend não retornou token no login. Verificar rota /auth/v1/login.');
            }

            fetchStats(response.userId);

            return { ok: true };
        } catch (err: any) {
            const message = err?.response?.data?.message ?? 'Nome ou senha incorretos.';
            return { ok: false, error: message };
        }
    }

    async function signUp(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
        try {
            await registerApi({ username, password });
            return { ok: true };
        } catch (err: any) {
            const message = err?.response?.data?.message ?? 'Não foi possível criar a conta.';
            return { ok: false, error: message };
        }
    }

    async function refreshStats() {
        if (!userProfile) return;
        fetchStats(userProfile.id);
    }

    async function signOut() {
        setUser(null);
        setToken(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        await AsyncStorage.removeItem('@Auth:user');
        await AsyncStorage.removeItem('@Auth:userId');
        await AsyncStorage.removeItem('@Auth:token');
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

    async function updateAvatar(base64: string) {
        if (!userProfile) return;
        setUserProfile(prev => prev ? { ...prev, image: base64 } : prev);
        await AsyncStorage.setItem(`@Auth:avatar:${userProfile.id}`, base64);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, userProfile, signIn, signUp, signOut, isLoading, statsLoading, refreshStats, addToTeam, removeFromTeam, updateAvatar }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);