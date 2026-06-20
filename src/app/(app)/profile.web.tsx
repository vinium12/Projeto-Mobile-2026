import React from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_AVATAR = require('../../../assets/images/SemFoto.png');

export default function ProfileScreen() {
    const { userProfile, statsLoading, updateAvatar } = useAuth();

    if (!userProfile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.name}>Carregando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handlePickImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target?.result as string;
                updateAvatar(base64);
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} style={styles.avatarContainer}>
                        <Image
                            source={userProfile.image ? { uri: userProfile.image } : DEFAULT_AVATAR}
                            style={styles.avatar}
                        />
                        <View style={styles.avatarOverlay}>
                            <Text style={styles.avatarOverlayText}>✎ Alterar foto</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.name}>{userProfile.name}</Text>
                </View>

                <View style={styles.boardContainer}>
                    <Text style={styles.boardTitle}>Estatísticas</Text>

                    {statsLoading ? (
                        <ActivityIndicator size="large" color="#CC0000" style={{ marginTop: 20 }} />
                    ) : (
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{userProfile.victories}</Text>
                                <Text style={styles.statLabel}>Vitórias</Text>
                            </View>

                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{userProfile.defeats}</Text>
                                <Text style={styles.statLabel}>Derrotas</Text>
                            </View>

                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{userProfile.matches}</Text>
                                <Text style={styles.statLabel}>Partidas</Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F0',
    },
    scrollContent: {
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#CC0000',
        paddingVertical: 40,
        alignItems: 'center',
        paddingHorizontal: 40,
        width: '100%',
    },
    avatarContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: '#FFF',
        marginBottom: 20,
        backgroundColor: '#FFF',
        cursor: 'pointer' as any,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 36,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarOverlayText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },
    boardContainer: {
        paddingHorizontal: 40,
        paddingVertical: 40,
        maxWidth: 900,
        width: '100%',
    },
    boardTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
    },
    statCard: {
        width: 200,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        borderTopWidth: 5,
        borderTopColor: '#CC0000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
    },
    statValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#CC0000',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
        textAlign: 'center',
    },
});