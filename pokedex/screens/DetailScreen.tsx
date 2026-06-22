import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { detailStyles as styles } from '../styles/detailStyles';
import GameBoyScreen from '../components/GameBoyScreen';

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  sprites: { front_default: string };
}

type Props = {
  route: RouteProp<RootStackParamList, 'Detail'>;
};

export default function DetailScreen({ route }: Props) {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b4cca" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.center}>
        <Text>Erro ao carregar dados.</Text>
      </View>
    );
  }

  return (
    <GameBoyScreen>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
          <Text style={styles.id}>#{pokemon.id}</Text>
          <Text style={styles.name}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Altura:</Text>
          <Text style={styles.value}>{pokemon.height / 10} m</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>{pokemon.weight / 10} kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Experiência Base:</Text>
          <Text style={styles.value}>{pokemon.base_experience}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos</Text>
        <View style={styles.tagContainer}>
          {pokemon.types.map((t, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{t.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.tagContainer}>
          {pokemon.abilities.map((a, i) => (
            <View key={i} style={[styles.tag, styles.abilityTag]}>
              <Text style={styles.tagText}>{a.ability.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
    </GameBoyScreen>
  );
}
