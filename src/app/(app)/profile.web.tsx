import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
    const { userProfile } = useAuth();

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
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <Image
                        source={userProfile.image}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{userProfile.name}</Text>
                </View>

                <View style={styles.boardContainer}>
                    <Text style={styles.boardTitle}>Estatísticas</Text>
                    
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
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 5,
        borderColor: '#FFF',
        marginBottom: 20,
        backgroundColor: '#FFF',
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
