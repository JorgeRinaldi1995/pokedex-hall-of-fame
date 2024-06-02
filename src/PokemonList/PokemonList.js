import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.scss';
import PokemonType from '../PokemonType/PokemonType';

function PokemonList() {
    const [pokemons, setPokemons] = useState([]);
    const [displayedPokemons, setDisplayedPokemons] = useState([]);
    const [nextPage, setNextPage] = useState('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1015');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
                    image: detailsData.sprites.other['official-artwork'].front_default,
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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);

    };

    useEffect(() => {
        const filteredPokemons = memorizedPokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedPokemons(filteredPokemons);
    }, [searchTerm, memorizedPokemons]);

    return (
        <div>
            <h1>Pokémon Feed</h1>
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <ul className='pokemon-container'>
                {displayedPokemons.map((pokemon, index) => (
                    <li key={index} className='pokemon-card'>
                        <Link to={`/pokemon/${pokemon.name}`}>
                            <div className="pokemon-img">
                                <img src={pokemon.image} alt={pokemon.name} />
                            </div>
                            <div className="pokemon-body">
                                <h3>{pokemon.name}</h3>
                                <PokemonType types={pokemon.type} />
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
