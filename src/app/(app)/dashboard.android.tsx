import { Image, StatusBar, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Button } from '../../components/button';
import { List } from '../../components/list/index.android';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { getPokemons } from '../../integration/pokemonIntegration';
import { TYPE_MAP } from '../../constants/pokemon';
import { Pokemon } from '../../@types/pokemon';

function TypeBadge({ label }: { label: string }) {
  const color = Colors.pokemonTypes[label as keyof typeof Colors.pokemonTypes] ?? '#BDBDBD';
  return (
    <View style={[styles.badge, { backgroundColor: color + '33', borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

interface PokemonItem {
  id: string;
  title: string;
  types: string[];
  image: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [pokemons, setPokemons] = useState<PokemonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPokemons(151);
        
        // Mapear dados da API para o formato esperado
        const mappedData: PokemonItem[] = data.map((pokemon: Pokemon) => ({
          id: pokemon.index,
          title: pokemon.nome.charAt(0).toUpperCase() + pokemon.nome.slice(1),
          types: pokemon.tipos.map(tipo => TYPE_MAP[tipo] || tipo),
          image: pokemon.imagem,
        }));
        
        setPokemons(mappedData);
      } catch (err) {
        setError('Erro ao carregar pokémons');
        console.error('Erro ao carregar pokémons:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
  }, []);

  if (loading) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={() => window.location.reload?.()} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#CC0000" />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo, {user}</Text>
      </View>

      <View style={styles.listWrapper}>
        <List
          data={pokemons}
          onLoadMore={() => {}}
          renderItemContent={(item) => (
            <View style={styles.card}>
              <Text style={styles.cardNumber}>#{String(item.id).padStart(3, '0')}</Text>

              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.pokemonImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.typesRow}>
                  {item.types.map((type: string) => <TypeBadge key={type} label={type} />)}
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.footer}>
        <Button title="Sair da Pokédex" onPress={signOut} />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#CC0000',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  listWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#CC0000',
  },
  cardNumber: {
    fontSize: 11,
    color: '#AAAAAA',
    fontWeight: '600',
    minWidth: 38,
  },
  imageWrapper: {
    width: 72,
    height: 72,
    backgroundColor: '#F0F0F0',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  pokemonImage: {
    width: 60,
    height: 60,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  typesRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  arrow: {
    fontSize: 24,
    color: '#CCCCCC',
    marginLeft: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  footer: {
    backgroundColor: '#F5F5F0',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
});