import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.scss';

function PokemonList() {
    const [pokemons, setPokemons] = useState([]);
    const [nextPage, setNextPage] = useState('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1015');
    const [loading, setLoading] = useState(false);

    const fetchPokemons = async () => {
        setLoading(true);
        try {
            const response = await axios.get(nextPage);
            const data = await response.data;
            setNextPage(data.next);

            // Fetch additional data for each pokemon
            const pokemonDetails = await Promise.all(data.results.map(async (pokemon) => {
                const detailsResponse = await axios.get(pokemon.url);
                const detailsData = await detailsResponse.data;

                return {
                    name: detailsData.name,
                    type: detailsData.types.map(type => type.type.name),
                    image: detailsData.sprites.front_default,
                };
            }));

            setPokemons(prevPokemons => {
                const newPokemons = [...prevPokemons, ...pokemonDetails];
                const uniquePokemons = Array.from(new Set(newPokemons.map(p => p.name)))
                    .map(name => newPokemons.find(p => p.name === name));
                return uniquePokemons; // Use find method to filter pokemons with the same name, and avoid duplicates
            });

        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        } finally {
            setLoading(false);
        }
    };

    const memorizedPokemons = useMemo(() => {
        const uniquePokemons = Array.from(new Set(pokemons.map(p => p.name)))
            .map(name => pokemons.find(p => p.name === name));
        return uniquePokemons;
    }, [pokemons]);

    useEffect(() => {
        fetchPokemons();
    }, []); // Run once on component mount

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10 &&
                !loading
            ) {
                fetchPokemons();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading]); // Listen for scroll events

    function getTypeColor(type) {
        switch (type.toLowerCase()) {
            case 'grass':
                return 'grass';
            case 'fire':
                return 'fire';
            case 'water':
                return 'water';
            case 'electric':
                return 'electric';
            case 'poison':
                return 'poison';
            case 'flying':
                return 'flying';
            case 'bug':
                return 'bug';
            case 'normal':
                return 'normal';
            case 'ground':
                return 'ground';
            case 'fairy':
                return 'fairy';
            case 'fighting':
                return 'fighting';
            case 'psychic':
                return 'psychic';
            case 'rock':
                return 'rock';
            case 'steel':
                return 'steel';
            case 'ice':
                return 'ice';
            case 'dragon':
                return 'dragon';
            case 'dark':
                return 'dark';
            case 'ghost':
                return 'ghost';
            // Add more cases for other types as needed
            default:
                return 'missigno'; // Default color
        }
    }

    return (
        <div>
            <h1>Pokémon Feed</h1>
            <ul className='pokemon-container'>
                {memorizedPokemons.map((pokemon, index) => (
                    <li key={index} className='pokemon-card'>
                        <Link to={`/pokemon/${pokemon.name}`}>
                            <div className="pokemon-img">
                                <img src={pokemon.image} alt={pokemon.name} />
                            </div>
                            <div className="pokemon-body">
                                <h3>{pokemon.name}</h3>
                                <div className='pokemon-types'>
                                    {pokemon.type && pokemon.type.length > 0 ? (
                                        <>
                                            <p className={getTypeColor(pokemon.type[0])}><span>{pokemon.type[0]}</span></p>
                                            {pokemon.type[1] && <p className={getTypeColor(pokemon.type[1])}><span>{pokemon.type[1]}</span></p>}
                                        </>
                                    ) : (
                                        <p style={{ color: getTypeColor('missigno') }}>missigno</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            {loading && <p>Loading...</p>}
        </div>
    );
}

export default PokemonList;
