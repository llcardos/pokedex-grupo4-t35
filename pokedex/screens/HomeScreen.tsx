
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image, RefreshControl} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { homeStyles as styles } from '../styles/homeStyles';
import GameBoyScreen from '../components/GameBoyScreen';

interface Pokemon {
  name: string;
  url: string;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await res.json();
      setPokemonList(data.results);
      setFilteredList(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setFilteredList(pokemonList);
    } else {
      const filtered = pokemonList.filter((p) =>
        p.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredList(filtered);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSearchText('');
    fetchPokemon();
  };

  const getId = (url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b4cca" />
      </View>
    );
  }

  return (
    <GameBoyScreen>

    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar Pokémon..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={handleSearch}
        />
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.name}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const pokemonId = getId(item.url);
          return (
            <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { id: pokemonId })}
            >
              <Image
                source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png` }}
                style={styles.sprite}
                />
              <View style={styles.cardInfo}>
                <Text style={styles.cardId}>#{pokemonId}</Text>
                <Text style={styles.cardName}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum Pokémon encontrado.</Text>
        }
        />
    </View>
        </GameBoyScreen>
  );
}

