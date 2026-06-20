import React, { useEffect, useState, useCallback } from 'react';
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
import type { Pokemon } from '../../@types/pokemon';
import { useAuth } from '../../context/AuthContext';
import { getTeam, updateTeam } from '../../integration/teamIntegration';

export default function TeamScreen() {
    const { userProfile } = useAuth();
    const [team, setTeam] = useState<Pokemon[]>([]);
    const [captured, setCaptured] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadTeam = useCallback(async () => {
        if (!userProfile) return;
        try {
            const { team: teamData, capture } = await getTeam(userProfile.id);
            setTeam(teamData);
            // Filtra capturados que já estão no time
            const teamIndexes = new Set(teamData.map((p: Pokemon) => p.index));
            setCaptured(capture.filter((p: Pokemon) => !teamIndexes.has(p.index)));
        } catch (err) {
            console.error('Erro ao carregar time:', err);
        } finally {
            setLoading(false);
        }
    }, [userProfile]);

    useEffect(() => {
        loadTeam();
    }, [loadTeam]);

    const isInTeam = (pokemonIndex: string) => {
        return team.some(p => p.index === pokemonIndex);
    };

    const handleAddToTeam = async (pokemon: Pokemon) => {
        if (!userProfile || isInTeam(pokemon.index) || team.length >= 5) return;

        const previousTeam = [...team];
        const previousCaptured = [...captured];
        setTeam(prev => [...prev, pokemon]);
        setCaptured(prev => prev.filter(p => p.index !== pokemon.index));
        setSaving(true);
        try {
            await updateTeam(userProfile.id, null, undefined, pokemon.index);
        } catch (err) {
            console.error('Erro ao adicionar ao time:', err);
            setTeam(previousTeam);
            setCaptured(previousCaptured);
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveFromTeam = async (pokemon: Pokemon) => {
        if (!userProfile) return;

        const previousTeam = [...team];
        const previousCaptured = [...captured];
        setTeam(prev => prev.filter(p => p.index !== pokemon.index));
        setCaptured(prev => [...prev, pokemon]);
        setSaving(true);
        try {
            await updateTeam(userProfile.id, null, pokemon.index, undefined);
        } catch (err) {
            console.error('Erro ao remover do time:', err);
            setTeam(previousTeam);
            setCaptured(previousCaptured);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#CC0000" />
                </View>
            </SafeAreaView>
        );
    }

    const teamSize = team.length;
    const emptySlots = 5 - teamSize;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.headerTitleRow}>
                        <Text style={styles.headerTitle}>Meu Time</Text>
                        {saving && <ActivityIndicator size="small" color="#FFF" />}
                    </View>
                    <Text style={styles.slotInfo}>{teamSize} / 5 Pokémons selecionados</Text>

                    <View style={styles.slotContainer}>
                        {team.map((pokemon) => (
                            <View key={pokemon.index} style={styles.slotWrapper}>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveFromTeam(pokemon)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.removeButtonText}>✕</Text>
                                </TouchableOpacity>
                                <View style={[styles.slot, styles.slotFilled]}>
                                    <Image
                                        source={{ uri: pokemon.imagem }}
                                        style={styles.slotImage}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.slotText}>{pokemon.nome}</Text>
                                </View>
                            </View>
                        ))}

                        {Array.from({ length: emptySlots }).map((_, index) => (
                            <View key={`empty-${index}`} style={styles.slotWrapper}>
                                <View style={styles.slot}>
                                    <Text style={[styles.slotText, { fontSize: 32, color: 'rgba(255, 255, 255, 0.6)' }]}>+</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Pokémons Capturados ({captured.length})</Text>

                    {captured.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>
                                Você ainda não capturou nenhum Pokémon. Vença batalhas para capturar novos Pokémons!
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.gridContainer}>
                            {captured.map((pokemon) => (
                                <View key={pokemon.index} style={styles.pokemonCard}>
                                    <Image
                                        source={{ uri: pokemon.imagem }}
                                        style={styles.pokemonImage}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.pokemonName}>{pokemon.nome}</Text>

                                    <TouchableOpacity
                                        style={[styles.addButton, teamSize >= 5 && styles.disabledButton]}
                                        disabled={teamSize >= 5}
                                        onPress={() => handleAddToTeam(pokemon)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.addButtonText}>+ Adicionar</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
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
        paddingHorizontal: 40,
        paddingTop: 30,
        overflow: 'visible' as any,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    slotContainer: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'center',
        marginTop: 24,
        overflow: 'visible' as any,
    },
    slotWrapper: {
        position: 'relative',
        paddingTop: 14,
        overflow: 'visible' as any,
    },
    slot: {
        width: 100,
        height: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    slotFilled: {
        borderColor: '#FFF',
    },
    slotImage: {
        width: 80,
        height: 80,
    },
    slotText: {
        color: '#FFF',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '600',
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: -8,
        backgroundColor: '#CC0000',
        borderRadius: 16,
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderWidth: 2,
        borderColor: '#FFF',
        cursor: 'pointer' as any,
    },
    removeButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
        lineHeight: 14,
        userSelect: 'none' as any,
    },
    content: {
        paddingHorizontal: 40,
        paddingVertical: 40,
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 25,
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        maxWidth: 400,
        lineHeight: 22,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 20,
    },
    pokemonCard: {
        width: '15%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        elevation: 3,
    },
    pokemonImage: {
        width: 70,
        height: 70,
        marginBottom: 8,
    },
    pokemonName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#CC0000',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 6,
        alignSelf: 'center',
        minWidth: 50,
        cursor: 'pointer' as any,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#CCC',
        cursor: 'default' as any,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slotInfo: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 15,
    },
});