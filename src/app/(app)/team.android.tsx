import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
                                    <Text style={styles.slotText}>{pokemon.nome.substring(0, 8)}</Text>
                                </View>
                            </View>
                        ))}

                        {Array.from({ length: emptySlots }).map((_, index) => (
                            <View key={`empty-${index}`} style={styles.slotWrapper}>
                                <View style={styles.slot}>
                                    <Text style={[styles.slotText, { fontSize: 26, color: 'rgba(255, 255, 255, 0.6)' }]}>+</Text>
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
                                Você ainda não capturou nenhum Pokémon.{'\n'}Vença batalhas para capturar novos Pokémons!
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
                                    <Text style={styles.pokemonName}>{pokemon.nome.substring(0, 10)}</Text>

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
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.2,
    },
    slotInfo: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    slotContainer: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
        marginTop: 16,
    },
    slotWrapper: {
        position: 'relative',
        paddingTop: 10,
        flex: 1,
        minWidth: '18%',
    },
    slot: {
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    slotFilled: {
        borderColor: '#FFF',
        elevation: 3,
    },
    slotImage: {
        width: 56,
        height: 56,
    },
    slotText: {
        color: '#FFF',
        fontSize: 10,
        marginTop: 4,
        textAlign: 'center',
        fontWeight: '600',
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: -4,
        backgroundColor: '#CC0000',
        borderRadius: 14,
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderWidth: 2,
        borderColor: '#FFF',
        elevation: 4,
    },
    removeButtonText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
        lineHeight: 12,
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
    },
    emptyState: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        lineHeight: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    pokemonCard: {
        width: '31%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
        borderLeftWidth: 3,
        borderLeftColor: '#CC0000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    pokemonImage: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    pokemonName: {
        fontSize: 11,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 6,
    },
    addButton: {
        backgroundColor: '#CC0000',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.2,
    },
    disabledButton: {
        backgroundColor: '#CCC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});