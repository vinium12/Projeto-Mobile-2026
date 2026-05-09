import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/button';
import { List } from '../../components/list/index.android';
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
  footer: {
    backgroundColor: '#F5F5F0',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
});