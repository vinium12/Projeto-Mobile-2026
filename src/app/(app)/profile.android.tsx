import React from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_AVATAR = require('../../../assets/images/SemFoto.png');

export default function ProfileScreen() {
    const { userProfile, statsLoading } = useAuth();

    if (!userProfile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.name}>Carregando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Image
                        source={userProfile.image ? { uri: userProfile.image } : DEFAULT_AVATAR}
                        style={styles.avatar}
                    />
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
    header: {
        backgroundColor: '#CC0000',
        paddingVertical: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#FFF',
        marginBottom: 15,
        backgroundColor: '#FFF',
        elevation: 4,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },
    boardContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    boardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    statCard: {
        flex: 1,
        minWidth: 110,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#CC0000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 6,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#CC0000',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
});