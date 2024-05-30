import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function PokemonDetail() {
    const { name } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemonsDetails = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const detailsData = response.data;

                // Fetch generation from species endpoint
                const speciesResponse = await axios.get(detailsData.species.url);
                const speciesData = speciesResponse.data;

                setPokemon({
                    name: detailsData.name,
                    type: detailsData.types.map(type => type.type.name).join(', '),
                    image: detailsData.sprites.front_default,
                    generation: speciesData.generation.name,
                    height: detailsData.height,
                    weight: detailsData.weight,
                    abilities: detailsData.abilities.map(ability => ability.ability.name).join(', '),
                    stats: detailsData.stats.map(stat => ({
                        name: stat.stat.name,
                        value: stat.base_stat
                    }))
                });

            } catch (error) {
                console.log('socoro deu erro ç-ç', error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchPokemonsDetails();
    }, [name]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {pokemon && (
                <div>
                    <h1>{pokemon.name}</h1>
                    <img src={pokemon.image} alt={pokemon.name} />
                    <p>Type: {pokemon.type}</p>
                    <p>Generation: {pokemon.generation}</p>
                    <p>Height: {pokemon.height}</p>
                    <p>Weight: {pokemon.weight}</p>
                    <p>Abilities: {pokemon.abilities}</p>
                    <h2>Stats</h2>
                    <ul>
                        {pokemon.stats.map((stat, index) => (
                            <li key={index}>
                                <p>{stat.name}: {stat.value}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default PokemonDetail;
