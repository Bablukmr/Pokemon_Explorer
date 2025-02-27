'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PokemonDetailPage () {
    const { id } = useParams();
    // console.log(id);
    const [pokemon, setPokemon] = useState(null);
    // console.log(pokemon);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await res.json();
            setPokemon(data);
        };

        fetchPokemonDetails();
    }, [id]);

    if (!pokemon) return <p className="text-center text-xl p-10">Loading Pokémon data...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-4xl font-bold text-center capitalize mb-4">{pokemon.name}</h1>

                <div className="flex justify-center mb-6">
                    <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        className="w-48 h-48"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 text-lg">
                    <div><strong>Height:</strong> {pokemon.height / 10} m</div>
                    <div><strong>Weight:</strong> {pokemon.weight / 10} kg</div>
                    <div><strong>Base Experience:</strong> {pokemon.base_experience}</div>
                    <div><strong>Order:</strong> {pokemon.order}</div>
                </div>

                <h2 className="text-2xl font-semibold mt-6">Types</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {pokemon.types.map((t, index) => (
                        <span
                            key={index}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                        >
                            {t.type.name}
                        </span>
                    ))}
                </div>

                <h2 className="text-2xl font-semibold mt-6">Abilities</h2>
                <ul className="list-disc list-inside mt-2">
                    {pokemon.abilities.map((a, index) => (
                        <li key={index} className="capitalize">{a.ability.name}</li>
                    ))}
                </ul>

                <h2 className="text-2xl font-semibold mt-6">Stats</h2>
                <div className="space-y-2 mt-2">
                    {pokemon.stats.map((stat, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <span className="capitalize">{stat.stat.name}</span>
                            <div className="w-2/3 bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-green-500 h-4 rounded-full"
                                    style={{ width: `${stat.base_stat}%` }}
                                ></div>
                            </div>
                            <span>{stat.base_stat}</span>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-semibold mt-6">Cries</h2>
                <div className="flex gap-4 items-center mt-2">
                    <audio controls>
                        <source src={pokemon.cries.latest} type="audio/ogg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>

                <h2 className="text-2xl font-semibold mt-6">Moves</h2>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2 mt-2">
                    {pokemon.moves.slice(0, 30).map((m, index) => (
                        <span key={index} className="inline-block bg-gray-200 text-sm rounded px-2 py-1 m-1">
                            {m.move.name}
                        </span>
                    ))}
                    {pokemon.moves.length > 30 && (
                        <p className="text-sm text-gray-500 mt-2">+ {pokemon.moves.length - 30} more...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
