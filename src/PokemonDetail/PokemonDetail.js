import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonType from "../PokemonType/PokemonType";
import { useParams } from "react-router-dom";
import './style.scss'

function PokemonDetail() {
    const { name } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [moveDetails, setMoveDetails] = useState({});

    useEffect(() => {
        const fetchPokemonsDetails = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const detailsData = response.data;
                // Fetch generation from species endpoint
                const speciesResponse = await axios.get(detailsData.species.url);
                const speciesData = speciesResponse.data;

                console.log('detalhes', detailsData)

                setPokemon({
                    name: detailsData.name,
                    type: detailsData.types.map(type => type.type.name),
                    image: detailsData.sprites.other['official-artwork'].front_default,
                    generation: speciesData.generation.name,
                    height: detailsData.height,
                    weight: detailsData.weight,
                    abilities: detailsData.abilities.map(ability => ability.ability.name).join(' / '),
                    stats: detailsData.stats.map(stat => ({
                        name: stat.stat.name,
                        value: stat.base_stat
                    })),
                    moves: detailsData.moves.map(move => ({
                        move: move.move.name,
                        url: move.move.url,
                        details: move.version_group_details.map(details => ({
                            level: details.level_learned_at,
                            method: details.move_learn_method.name,
                        }))
                    }))
                });
            } catch (error) {
                console.log('socoro deu erro ç-ç', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonsDetails();
    }, [name]);

    useEffect(() => {
        const fetchMoveDetails = async () => {
            if (pokemon) {
                const moveDetailsPromises = pokemon.moves.map(async (move) => {
                    const response = await axios.get(move.url);
                    return { [move.move]: response.data };
                });
                const moveDetailsArray = await Promise.all(moveDetailsPromises);
                const moveDetailsObject = Object.assign({}, ...moveDetailsArray);
                setMoveDetails(moveDetailsObject);
            }
        };

        fetchMoveDetails();
    }, [pokemon]);

    /* console.log('pokemon', pokemon); */
    console.log('moveDetails', moveDetails);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {pokemon && (
                <div className="pokemon-details">
                    <img src={pokemon.image} alt={pokemon.name} />
                    <h1>{pokemon.name}</h1>
                    <PokemonType types={pokemon.type} />
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
                    <h2>Moves</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Power</th>
                                <th>PP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pokemon.moves.map((move, index) => (
                                <tr key={index}>
                                    <td>{move.move}</td>
                                    {/* WIP - <td>
                                        {move.details.map((detail, detailIndex) => (
                                            <div key={detailIndex}>
                                                {detail.level}
                                            </div>
                                        ))}
                                    </td> 
                                    <td>
                                        {move.details.map((detail, detailIndex) => (
                                            <div key={detailIndex}>
                                                {detail.method}
                                            </div>
                                        ))}
                                    </td> - WIP */} 

                                    {moveDetails[move.move] && (
                                        <>
                                            <td>Type: {moveDetails[move.move].type.name}</td>
                                            <td>Power: {moveDetails[move.move].power}</td>
                                            <td>PP: {moveDetails[move.move].pp}</td>
                                        </>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PokemonDetail;
