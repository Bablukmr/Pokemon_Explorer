'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage () {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // console.log(pokemon);
  // console.log(currentPage);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchPokemons = async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await res.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon, index) => {
          const detailsRes = await fetch(pokemon.url);
          const detailsData = await detailsRes.json();

          return {
            id: index + 1,
            name: pokemon.name,
            image: detailsData.sprites.front_default,
            abilities: detailsData.abilities.map(a => a.ability.name),
            types: detailsData.types.map(t => t.type.name),
          };
        })
      );

      setPokemons(detailedPokemons);
    };

    fetchPokemons();
  }, []);

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPokemons.length / itemsPerPage);

  const paginatedPokemons = filteredPokemons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Pokémon Explorer</h1>

        <input
          type="text"
          placeholder="Search Pokémon..."
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {paginatedPokemons.map((pokemon) => (
            <motion.div
              key={pokemon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: pokemon.id * 0.03 }}
            >
              <Link href={`/pokemon/${pokemon.id}`}>
                <div className="cursor-pointer bg-white p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-24 h-24 mx-auto mb-3 transition-transform duration-300 hover:rotate-6"
                  />
                  <h3 className="capitalize text-lg font-semibold text-center">{pokemon.name}</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Types: {pokemon.types.join(', ')}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex overflow-x-auto max-w-full space-x-2 px-2 py-2 scrollbar-hide">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`px-4 py-2 cursor-pointer rounded whitespace-nowrap ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>


        {filteredPokemons.length === 0 && (
          <div className="flex justify-center items-center mt-6">
            <div className="w-12 h-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-gray-600">Loading Pokémon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
