import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { detailStyles as styles } from '../styles/detailStyles';

const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#6b6b6b',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

const getTypeColor = (typeName: string) => {
  return typeColors[typeName as keyof typeof typeColors] || '#777777';
};

// Cores para os stats
const statColors = {
  hp: '#8fec94',
  attack: '#f5e978',
  defense: '#fab278',
  'special-attack': '#9df2f5',
  'special-defense': '#a8b4f7',
  speed: '#dc92fa'
};

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string; url: string } }[];
  moves: { move: { name: string; url: string } }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: { name: string };
  }[];
  sprites: {
    front_default: string;
    front_shiny: string;
    front_female: string;
    front_shiny_female: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      dream_world: {
        front_default: string;
      };
      home: {
        front_default: string;
      };
    };
  };
}

interface AbilityDetail {
  name: string;
  effect: string;
  short_effect: string;
  generation: string;
}

interface MoveDetail {
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number | null;
  type: string;
  damage_class: string;
  level_learned_at: number;
  effect: string;
  short_effect: string;
}

type Props = {
  route: RouteProp<RootStackParamList, 'Detail'>;
};

export default function DetailScreen({ route }: Props) {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [abilitiesDetails, setAbilitiesDetails] = useState<{ [key: string]: AbilityDetail }>({});
  const [movesDetails, setMovesDetails] = useState<{ [key: string]: MoveDetail }>({});
  const [loadingAbilities, setLoadingAbilities] = useState(true);
  const [loadingMoves, setLoadingMoves] = useState(true);
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    abilities: false,
    moves: false,
    stats: true, 
    info: true 
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        setPokemon(data);
        
        // Buscar detalhes das habilidades
        await fetchAllAbilities(data.abilities);
        // Buscar detalhes dos movimentos
        await fetchAllMoves(data.moves);
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Buscar todas as habilidades em paralelo
  const fetchAllAbilities = async (abilities: any[]) => {
    setLoadingAbilities(true);
    try {
      const promises = abilities.map(async (a) => {
        const res = await fetch(a.ability.url);
        const data = await res.json();
        const englishEffect = data.effect_entries.find(
          (entry: any) => entry.language.name === 'en'
        );
        return {
          key: a.ability.name,
          detail: {
            name: data.name,
            effect: englishEffect?.effect || 'Efeito não disponível',
            short_effect: englishEffect?.short_effect || 'Efeito não disponível',
            generation: data.generation?.name || 'Desconhecida'
          }
        };
      });
      
      const results = await Promise.all(promises);
      const detailsMap: { [key: string]: AbilityDetail } = {};
      results.forEach(({ key, detail }) => {
        detailsMap[key] = detail;
      });
      setAbilitiesDetails(detailsMap);
    } catch (err) {
      console.error('Erro ao buscar habilidades:', err);
    } finally {
      setLoadingAbilities(false);
    }
  };

  // Busca todos os movimentos 
const fetchAllMoves = async (moves: any[]) => {
  setLoadingMoves(true);
  try {
    // Numero de movimentos que carrega
    const limitedMoves = moves.slice(0, 20);
    
    const promises = limitedMoves.map(async (m) => {
      const res = await fetch(m.move.url);
      const data = await res.json();
      
      // Encontrar o nível de aprendizado para este Pokémon
      let levelLearnedAt = 0;
      if (data.version_group_details) {
        // Procura em versões principais primeiro
        const versionDetail = data.version_group_details.find(
          (detail: any) => 
            detail.version_group.name === 'scarlet-violet' ||
            detail.version_group.name === 'sword-shield' ||
            detail.version_group.name === 'sun-moon' ||
            detail.version_group.name === 'x-y'
        ) || data.version_group_details[0];
        
        levelLearnedAt = versionDetail?.level_learned_at || 0;
      }
      
      // Busca efeito 
      const englishEffect = data.effect_entries?.find(
        (entry: any) => entry.language.name === 'en'
      );
      
      // Busca descrição 
      const flavorText = data.flavor_text_entries?.find(
        (entry: any) => entry.language.name === 'en'
      );
      
      return {
        key: m.move.name,
        detail: {
          name: data.name || m.move.name,
          accuracy: data.accuracy ?? null,
          power: data.power ?? null,
          pp: data.pp ?? null,
          type: data.type?.name || 'unknown',
          damage_class: data.damage_class?.name || 'unknown',
          level_learned_at: levelLearnedAt,
          effect: englishEffect?.effect || flavorText?.flavor_text || 'Efeito não disponível',
          short_effect: englishEffect?.short_effect || flavorText?.flavor_text || 'Efeito não disponível'
        }
      };
    });
    
    const results = await Promise.all(promises);
    const detailsMap: { [key: string]: MoveDetail } = {};
    results.forEach(({ key, detail }) => {
      detailsMap[key] = detail;
    });
    setMovesDetails(detailsMap);
  } catch (err) {
    console.error('Erro ao buscar movimentos:', err);
  } finally {
    setLoadingMoves(false);
  }
};

  // Função para trocar sprite
  const changeSprite = () => {
    if (!pokemon) return;
    
    const sprites = [
      pokemon.sprites.front_default,
      pokemon.sprites.front_shiny,
      pokemon.sprites.front_female,
      pokemon.sprites.front_shiny_female,
      pokemon.sprites.other?.['official-artwork']?.front_default,
      pokemon.sprites.other?.dream_world?.front_default,
      pokemon.sprites.other?.home?.front_default,
    ].filter(sprite => sprite !== null && sprite !== undefined);
    
    const nextIndex = (currentSpriteIndex + 1) % sprites.length;
    setCurrentSpriteIndex(nextIndex);
  };

  // Obter lista de sprites disponíveis
  const getAvailableSprites = () => {
    if (!pokemon) return [];
    
    return [
      pokemon.sprites.front_default,
      pokemon.sprites.front_shiny,
      pokemon.sprites.front_female,
      pokemon.sprites.front_shiny_female,
      pokemon.sprites.other?.['official-artwork']?.front_default,
      pokemon.sprites.other?.dream_world?.front_default,
      pokemon.sprites.other?.home?.front_default,
    ].filter(sprite => sprite !== null && sprite !== undefined);
  };

  // Toggle expandir seção
  const toggleSection = (section: 'abilities' | 'moves' | 'stats'| 'info' ) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Função para obter nome amigável do stat
  const getStatName = (statName: string) => {
    const names: { [key: string]: string } = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defesa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defesa Especial',
      speed: 'Velocidade'
    };
    return names[statName] || statName;
  };

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

  const sprites = getAvailableSprites();
  const currentSprite = sprites[currentSpriteIndex] || pokemon.sprites.front_default;

  // Calcular total de stats
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  return (
    <ScrollView style={styles.container}>
      {/* Header com imagem clicável */}
      <View style={styles.header}>
        <TouchableOpacity onPress={changeSprite} activeOpacity={0.7}>
          <Image source={{ uri: currentSprite }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.name}>
          #{pokemon.id}. {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>

        <View style={styles.tagContainer}>
          {pokemon.types.map((t, i) => (
            <View key={i} style={[styles.tag, { backgroundColor: getTypeColor(t.type.name) }]}>
              <Text style={styles.tagText}>{t.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Seção de Stats */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleSection('stats')} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <Text style={styles.sectionArrow}>{expandedSections.stats ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        
        {expandedSections.stats && (
          <View style={styles.statsContainer}>
            {pokemon.stats.map((stat, index) => {
              const statName = stat.stat.name;
              const baseStat = stat.base_stat;
              const percentage = (baseStat / 255) * 100; // 255 é o máximo teórico
              
              return (
                <View key={index} style={styles.statRow}>
                  <Text style={styles.statLabel}>{getStatName(statName)}</Text>
                  <View style={styles.statBarContainer}>
                    <View 
                      style={[
                        styles.statBar, 
                        { 
                          width: `${percentage}%`,
                          backgroundColor: statColors[statName as keyof typeof statColors] || '#999'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.statValue}>{baseStat}</Text>
                </View>
              );
            })}
            <View style={styles.totalStatsRow}>
              <Text style={styles.totalStatsLabel}>Total</Text>
              <Text style={styles.totalStatsValue}>{totalStats}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Informações */}
      

       <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleSection('info')} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <Text style={styles.sectionArrow}>{expandedSections.stats ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {expandedSections.info && (
          <><View style={styles.row}>
            <Text style={styles.label}>Altura:</Text>
            <Text style={styles.value}>{pokemon.height / 10} m</Text>
          </View><View style={styles.row}>
              <Text style={styles.label}>Peso:</Text>
              <Text style={styles.value}>{pokemon.weight / 10} kg</Text>
            </View><View style={styles.row}>
              <Text style={styles.label}>Experiência Base:</Text>
              <Text style={styles.value}>{pokemon.base_experience}</Text>
            </View></>
        )}
      </View>

      {/* Habilidades com efeitos inline */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleSection('abilities')} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <Text style={styles.sectionArrow}>{expandedSections.abilities ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        
        {expandedSections.abilities && (
          <View>
            {loadingAbilities ? (
              <ActivityIndicator size="small" color="#3b4cca" />
            ) : (
              pokemon.abilities.map((a, i) => {
                const detail = abilitiesDetails[a.ability.name];
                return (
                  <View key={i} style={styles.abilityCard}>
                    <View style={styles.abilityHeader}>
                      <Text style={styles.abilityName}>
                        {a.ability.name.toUpperCase()}
                      </Text>
                      {detail && (
                        <Text style={styles.abilityGeneration}>
                          Geração: {detail.generation}
                        </Text>
                      )}
                    </View>
                    {detail && (
                      <Text style={styles.abilityEffect}>
                        {detail.short_effect || detail.effect}
                      </Text>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}
      </View>

      {/* Movimentos com informações inline */}
      {/* Movimentos com informações inline */}
<View style={styles.section}>
  <TouchableOpacity onPress={() => toggleSection('moves')} style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Movimentos</Text>
    <Text style={styles.sectionArrow}>{expandedSections.moves ? '▲' : '▼'}</Text>
  </TouchableOpacity>
  
  {expandedSections.moves && (
    <View>
      {loadingMoves ? (
        <ActivityIndicator size="small" color="#3b4cca" />
      ) : (
        <>
          {pokemon.moves.slice(0, 20).map((m, i) => {
            const detail = movesDetails[m.move.name];
            
            // Se ainda não carregou o detalhe, mostra apenas o nome
            if (!detail) {
              return (
                <View key={i} style={styles.moveCard}>
                  <Text style={styles.moveName}>{m.move.name.toUpperCase()}</Text>
                  <Text style={styles.moveLoading}>Carregando...</Text>
                </View>
              );
            }
            
            return (
              <View key={i} style={styles.moveCard}>
                {/* Cabeçalho do ataque */}
                <View style={styles.moveHeader}>
                  <Text style={styles.moveName}>{m.move.name.toUpperCase()}</Text>
                  <View style={styles.moveTypeContainer}>
                    <View style={[styles.moveTypeTag, { backgroundColor: getTypeColor(detail.type) }]}>
                      <Text style={styles.moveTypeText}>{detail.type}</Text>
                    </View>
                    <Text style={styles.moveLevel}>Nv. {detail.level_learned_at}</Text>
                  </View>
                </View>
                
                {/* Infos do ataque*/}
                <View style={styles.moveStatsGrid}>
                  <View style={styles.moveStatItem}>
                    <Text style={styles.moveStatLabel}>Poder</Text>
                    <Text style={styles.moveStatValue}>{detail.power || '—'}</Text>
                  </View>
                  <View style={styles.moveStatItem}>
                    <Text style={styles.moveStatLabel}>Precisão</Text>
                    <Text style={styles.moveStatValue}>{detail.accuracy || '—'}%</Text>
                  </View>
                  <View style={styles.moveStatItem}>
                    <Text style={styles.moveStatLabel}>PP</Text>
                    <Text style={styles.moveStatValue}>{detail.pp || '—'}</Text>
                  </View>
                  <View style={styles.moveStatItem}>
                    <Text style={styles.moveStatLabel}>Classe</Text>
                    <Text style={styles.moveStatValue}>{detail.damage_class}</Text>
                  </View>
                </View>
                
                {/* Efeito do movimento */}
                <Text style={styles.moveEffect} numberOfLines={3}>
                  {detail.short_effect || detail.effect}
                </Text>
              </View>
            );
          })}
        </>
      )}
    </View>
  )}
</View>
    </ScrollView>
  );
}