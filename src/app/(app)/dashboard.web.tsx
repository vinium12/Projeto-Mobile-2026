import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/button';
import { List } from '../../components/list/index.web';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

const pokemons = [
    { id: '1',   title: 'Bulbasaur',  types: ['Planta', 'Veneno'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
    { id: '4',   title: 'Charmander', types: ['Fogo'],             image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
    { id: '7',   title: 'Squirtle',   types: ['Água'],             image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
    { id: '25',  title: 'Pikachu',    types: ['Elétrico'],         image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
    { id: '39',  title: 'Jigglypuff', types: ['Normal', 'Fada'],   image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png' },
    { id: '52',  title: 'Meowth',     types: ['Normal'],           image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png' },
    { id: '122', title: 'Mr. Mime',   types: ['Psíquico', 'Fada'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/122.png' },
];

function TypeBadge({ label }: { label: string }) {
  const color = Colors.pokemonTypes[label as keyof typeof Colors.pokemonTypes] ?? '#BDBDBD';
  return (
    <View style={[styles.badge, { backgroundColor: color + '33', borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();

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
          numColumns={3}
          renderItemContent={(item) => (
            <View style={styles.card}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.pokemonImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.cardNumber}>#{String(item.id).padStart(3, '0')}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <View style={styles.typesRow}>
                {item.types.map((type: string) => <TypeBadge key={type} label={type} />)}
              </View>
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
    padding: 16,
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    borderTopWidth: 4,
    borderTopColor: '#CC0000',
    height: '100%',
},
imageWrapper: {
    width: '100%',
    aspectRatio: 1.4,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
},
  pokemonImage: {
    width: '80%',
    height: '80%',
  },
  cardNumber: {
    fontSize: 11,
    color: '#AAAAAA',
    fontWeight: '600',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  typesRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  footer: {
    backgroundColor: '#F5F5F0',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
});