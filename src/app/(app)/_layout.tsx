import { Redirect, Stack, Tabs, useRouter } from "expo-router";
import { Home, LogOut, User, Users } from "lucide-react-native";
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
    const { isAuthenticated, isLoading, signOut } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/" />;
    }

    // Mobile layout com Bottom Tabs
    if (Platform.OS !== 'web') {
        return (
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#CC0000',
                    tabBarInactiveTintColor: '#999',
                    tabBarStyle: {
                        backgroundColor: '#FFF',
                        borderTopColor: '#EEE',
                        borderTopWidth: 1,
                        paddingBottom: 8,
                        paddingTop: 8,
                        height: 70,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                        marginTop: 4,
                    },
                }}
            >
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: "Pokédex",
                        tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Perfil",
                        tabBarIcon: ({ color }) => <User size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="team"
                    options={{
                        title: "Time",
                        tabBarIcon: ({ color }) => <Users size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="logout"
                    options={{
                        title: "Sair",
                        tabBarIcon: ({ color }) => <LogOut size={24} color={color} />,
                        href: null,
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            signOut();
                        },
                    }}
                />
            </Tabs>
        );
    }

    // Web layout com Header customizado
    return (
        <View style={{ flex: 1 }}>
            {/* Header Navigation */}
            <View style={{
                backgroundColor: '#CC0000',
                paddingHorizontal: 20,
                paddingVertical: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Text style={{
                    color: '#FFF',
                    fontSize: 20,
                    fontWeight: 'bold',
                }}>
                    Pokédex
                </Text>
                
                <View style={{
                    flexDirection: 'row',
                    gap: 20,
                    alignItems: 'center',
                }}>
                    <TouchableOpacity
                        onPress={() => router.push('/dashboard')}
                        style={{ paddingVertical: 8, paddingHorizontal: 12 }}
                    >
                        <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>
                            Pokedex
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/profile')}
                        style={{ paddingVertical: 8, paddingHorizontal: 12 }}
                    >
                        <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>
                            Perfil
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/team')}
                        style={{ paddingVertical: 8, paddingHorizontal: 12 }}
                    >
                        <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>
                            Time
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => signOut()}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: 4,
                        }}
                    >
                        <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>
                            Sair
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content Stack */}
            <Stack screenOptions={{ headerShown: false }} />
        </View>
    );
}