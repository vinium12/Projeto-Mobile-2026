import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

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
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#CC0000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
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
        fontWeight: '500',
        textAlign: 'center',
    },
});

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
