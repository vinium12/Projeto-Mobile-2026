import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getPokemons } from '../../integration/pokemonIntegration';
import type { Pokemon } from '../../@types/pokemon';
import type { TeamPokemon } from '../../context/AuthContext';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F0',
    },
    header: {
        backgroundColor: '#CC0000',
        paddingVertical: 30,
        paddingHorizontal: 40,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 25,
    },
    slotContainer: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'center',
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
        position: 'relative',
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
        top: -8,
        right: -8,
        backgroundColor: '#CC0000',
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    removeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
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
    pokemonCardSelected: {
        borderColor: '#CC0000',
        borderWidth: 3,
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
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#CCC',
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

interface SelectablePokemon extends Pokemon {
    isSelected?: boolean;
}

export default function TeamScreen() {
    const { userProfile, addToTeam, removeFromTeam } = useAuth();
    const [availablePokemons, setAvailablePokemons] = useState<SelectablePokemon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPokemons = async () => {
            try {
                const data = await getPokemons(151);
                // Embaralha e pega 25 aleatórios
                const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 25);
                setAvailablePokemons(shuffled);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao carregar pokémons:', err);
                setLoading(false);
            }
        };

        loadPokemons();
    }, []);

    const isInTeam = (pokemonId: string) => {
        return userProfile?.team.some(p => p.index === pokemonId);
    };

    const handleAddToTeam = (pokemon: SelectablePokemon) => {
        if (!isInTeam(pokemon.index) && userProfile && userProfile.team.length < 5) {
            addToTeam({
                id: `${pokemon.index}-${Date.now()}`,
                index: pokemon.index,
                nome: pokemon.nome,
                imagem: pokemon.imagem,
            });
        }
    };

    const handleRemoveFromTeam = (pokemonId: string) => {
        removeFromTeam(pokemonId);
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

    const teamSize = userProfile?.team.length || 0;
    const emptySlots = 5 - teamSize;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Meu Time</Text>
                    <Text style={styles.slotInfo}>{teamSize} / 5 Pokémons selecionados</Text>
                    
                    <View style={styles.slotContainer}>
                        {/* Pokémons no time */}
                        {userProfile?.team.map((pokemon, index) => (
                            <View key={pokemon.id} style={[styles.slot, styles.slotFilled]}>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveFromTeam(pokemon.id)}
                                >
                                    <Text style={styles.removeButtonText}>✕</Text>
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: pokemon.imagem }}
                                    style={styles.slotImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.slotText}>{pokemon.nome}</Text>
                            </View>
                        ))}
                        
                        {/* Slots vazios */}
                        {Array.from({ length: emptySlots }).map((_, index) => (
                            <View key={`empty-${index}`} style={styles.slot}>
                                <Text style={styles.slotText} style={{fontSize: 32, color: 'rgba(255, 255, 255, 0.6)'}}>+</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Escolha 25 Pokémons para seu Time</Text>
                    
                    <View style={styles.gridContainer}>
                        {availablePokemons.map((pokemon) => {
                            const inTeam = isInTeam(pokemon.index);
                            return (
                                <View
                                    key={pokemon.index}
                                    style={[styles.pokemonCard, inTeam && styles.pokemonCardSelected]}
                                >
                                    <Image
                                        source={{ uri: pokemon.imagem }}
                                        style={styles.pokemonImage}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.pokemonName}>{pokemon.nome}</Text>
                                    
                                    <TouchableOpacity
                                        style={[
                                            styles.addButton,
                                            (inTeam || teamSize >= 5) && styles.disabledButton
                                        ]}
                                        disabled={inTeam || teamSize >= 5}
                                        onPress={() => handleAddToTeam(pokemon)}
                                    >
                                        <Text style={styles.addButtonText}>
                                            {inTeam ? '✓ Adicionado' : '+ Adicionar'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
