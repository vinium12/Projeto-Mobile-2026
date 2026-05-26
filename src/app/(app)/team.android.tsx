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
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 15,
    },
    slotContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    slot: {
        flex: 1,
        minWidth: '18%',
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    slotFilled: {
        borderColor: '#FFF',
    },
    slotImage: {
        width: 60,
        height: 60,
    },
    slotText: {
        color: '#FFF',
        fontSize: 11,
        marginTop: 5,
        textAlign: 'center',
    },
    removeButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 12,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    pokemonCard: {
        width: '31%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        elevation: 2,
    },
    pokemonCardSelected: {
        borderColor: '#CC0000',
        borderWidth: 3,
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
        borderRadius: 6,
        alignSelf: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
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
                    <Text style={styles.headerTitle}>Meu Time ({teamSize}/5)</Text>
                    
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
                                <Text style={styles.slotText}>{pokemon.nome.substring(0, 8)}</Text>
                            </View>
                        ))}
                        
                        {/* Slots vazios */}
                        {Array.from({ length: emptySlots }).map((_, index) => (
                            <View key={`empty-${index}`} style={styles.slot}>
                                <Text style={styles.slotText}>+</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Pokémons Disponíveis (25)</Text>
                    
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
                                    <Text style={styles.pokemonName}>{pokemon.nome.substring(0, 10)}</Text>
                                    
                                    <TouchableOpacity
                                        style={[
                                            styles.addButton,
                                            (inTeam || teamSize >= 5) && styles.disabledButton
                                        ]}
                                        disabled={inTeam || teamSize >= 5}
                                        onPress={() => handleAddToTeam(pokemon)}
                                    >
                                        <Text style={styles.addButtonText}>
                                            {inTeam ? '✓' : '+'}
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
