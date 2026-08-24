import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getStats, login as loginApi, register as registerApi, RegisterRequest } from "../integration/authIntegration";
import { decodeToken, isTokenExpired } from "../utils/jwt";

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
    roles: string[];
    token: string | null;
    userProfile: UserProfile | null;
    isLoading: boolean;
    statsLoading: boolean;
    signIn: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    signUp: (data: RegisterRequest) => Promise<{ ok: boolean; error?: string }>;
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
    const [roles, setRoles] = useState<string[]>([]);
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

    async function persistSession(newToken: string) {
        const payload = decodeToken(newToken);
        if (!payload) {
            await clearSession();
            return;
        }

        const username = payload.sub;
        const userRoles = payload.roles || [];
        
        setUser(username);
        setRoles(userRoles);
        setToken(newToken);
        setIsAuthenticated(true);

        await AsyncStorage.setItem('@Auth:user', username);
        await AsyncStorage.setItem('@Auth:token', newToken);
        await AsyncStorage.setItem('@Auth:roles', JSON.stringify(userRoles));
        
        // Simular um userId usando o username temporariamente até a API prover um ID fixo ou usarmos apenas username
        await AsyncStorage.setItem('@Auth:userId', username);

        // Inicializar profile básico
        const savedAvatar = await AsyncStorage.getItem(`@Auth:avatar:${username}`);
        const storageTeam = await AsyncStorage.getItem('@Auth:team');
        const team = storageTeam ? JSON.parse(storageTeam) : [];

        setUserProfile({
            id: username,
            name: username,
            image: savedAvatar ?? null,
            victories: 0,
            defeats: 0,
            matches: 0,
            team,
        });

        // Buscar stats reais
        fetchStats(username);
    }

    async function clearSession() {
        setUser(null);
        setRoles([]);
        setToken(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        await AsyncStorage.removeItem('@Auth:user');
        await AsyncStorage.removeItem('@Auth:userId');
        await AsyncStorage.removeItem('@Auth:token');
        await AsyncStorage.removeItem('@Auth:roles');
        await AsyncStorage.removeItem('@Auth:team');
    }

    useEffect(() => {
        async function loadStorageData() {
            try {
                const storageToken = await AsyncStorage.getItem('@Auth:token');
                if (storageToken) {
                    const payload = decodeToken(storageToken);
                    if (payload && !isTokenExpired(payload.exp)) {
                        await persistSession(storageToken);
                    } else {
                        await clearSession();
                    }
                }
            } catch (e) {
                console.error("Erro ao ler token", e);
                await clearSession();
            } finally {
                setIsLoading(false);
            }
        }
        loadStorageData();
    }, []);

    async function signIn(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
        try {
            const response = await loginApi({ username, password });
            
            if (response.token) {
                await persistSession(response.token);
                return { ok: true };
            } else {
                return { ok: false, error: 'Token não recebido' };
            }
        } catch (err: any) {
            const message = err?.response?.data?.message ?? 'Nome ou senha incorretos.';
            return { ok: false, error: message };
        }
    }

    async function signUp(data: RegisterRequest): Promise<{ ok: boolean; error?: string }> {
        try {
            await registerApi(data);
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
        await clearSession();
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
        <AuthContext.Provider value={{ isAuthenticated, user, roles, token, userProfile, signIn, signUp, signOut, isLoading, statsLoading, refreshStats, addToTeam, removeFromTeam, updateAvatar }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);