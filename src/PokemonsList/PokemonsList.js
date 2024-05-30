import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss'

function PokemonList() {
    const [pokemons, setPokemons] = useState([]);
    const [nextPage, setNextPage] = useState('https://pokeapi.co/api/v2/pokemon?offset=0&limit=36');
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
                    type: detailsData.types.map(type => type.type.name).join(', '),
                    image: detailsData.sprites.front_default,
                };
            }));

            setPokemons(prevPokemons => {
                const newPokemons = [...prevPokemons, ...pokemonDetails];
                const uniquePokemons = Array.from(new Set(newPokemons.map(p => p.name)))
                    .map(name => newPokemons.find(p => p.name === name));
                return uniquePokemons; // Use find method to filter pokemons withe same name, and avoid duplicates
            });
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div>
            <h1>Pokémon Feed</h1>
            <ul className='pokemon-container'>
                {pokemons.map((pokemon, index) => (
                    <li key={index} className='pokemon-card'>
                        <div>
                            <img src={pokemon.image} alt={pokemon.name} />
                        </div>
                        <div>
                            <p>Name: {pokemon.name}</p>
                            <p>Type: {pokemon.type}</p>
                        </div>
                    </li>
                ))}
            </ul>
            {loading && <p>Loading...</p>}
        </div>
    );
}

export default PokemonList;
