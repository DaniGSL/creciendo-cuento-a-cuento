// src/app/components/GenerateTaleForm.tsx
'use client'; // Añade esta línea al principio del archivo

import React, { useState } from 'react';

interface Character {
  id: string;
  name: string;
  description: string;
}

const GenerateTaleForm: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [newCharacter, setNewCharacter] = useState<Character>({ id: '', name: '', description: '' });
  const [genre, setGenre] = useState('');
  const [location, setLocation] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [readingTime, setReadingTime] = useState(10);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]); // Simulación de personajes guardados
  const [selectedSavedCharacter, setSelectedSavedCharacter] = useState<string>('');
  const [saveNewCharacter, setSaveNewCharacter] = useState(false);

  const handleAddCharacter = () => {
    if (newCharacter.name && newCharacter.description) {
      const characterToAdd = { ...newCharacter, id: Date.now().toString() };
      setCharacters([...characters, characterToAdd]);
      if (saveNewCharacter) {
        setSavedCharacters([...savedCharacters, characterToAdd]);
      }
      setNewCharacter({ id: '', name: '', description: '' });
      setSaveNewCharacter(false);
    }
  };

  const handleRemoveCharacter = (id: string) => {
    setCharacters(characters.filter(char => char.id !== id));
  };

  const handleSelectSavedCharacter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedSavedCharacter(selectedId);
    if (selectedId) {
      const selectedChar = savedCharacters.find(char => char.id === selectedId);
      if (selectedChar && !characters.some(char => char.id === selectedChar.id)) {
        setCharacters([...characters, selectedChar]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí irá la lógica para enviar los datos a la API de generación de cuentos
    console.log('Datos del formulario:', { characters, genre, location, educationLevel, language, readingTime });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#28405F]">Generar Cuento</h2>
      
      {/* Sección de personajes */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-[#3F69D9]">Personajes</h3>
        <div className="flex mb-2">
          <input
            type="text"
            value={newCharacter.name}
            onChange={(e) => setNewCharacter({...newCharacter, name: e.target.value})}
            placeholder="Nombre del personaje"
            className="flex-grow mr-2 p-2 border rounded"
          />
          <input
            type="text"
            value={newCharacter.description}
            onChange={(e) => setNewCharacter({...newCharacter, description: e.target.value})}
            placeholder="Descripción"
            className="flex-grow mr-2 p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddCharacter}
            className="px-4 py-2 bg-[#3D8BF2] text-white rounded hover:bg-[#3F69D9]"
          >
            Añadir
          </button>
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={saveNewCharacter}
              onChange={(e) => setSaveNewCharacter(e.target.checked)}
              className="mr-2"
            />
            Guardar este personaje para futuros cuentos
          </label>
        </div>
        <select
          value={selectedSavedCharacter}
          onChange={handleSelectSavedCharacter}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Seleccionar personaje guardado</option>
          {savedCharacters.map(char => (
            <option key={char.id} value={char.id}>{char.name}</option>
          ))}
        </select>
        <ul className="list-disc pl-5">
          {characters.map((char) => (
            <li key={char.id} className="mb-1">
              {char.name} - {char.description}
              <button
                type="button"
                onClick={() => handleRemoveCharacter(char.id)}
                className="ml-2 text-[#F24949] hover:text-red-700"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Género del cuento */}
      <div className="mb-4">
        <label htmlFor="genre" className="block mb-1 font-medium text-[#28405F]">Género del cuento</label>
        <input
          type="text"
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ej: Fantasía, Aventura, Misterio"
        />
      </div>

      {/* Ubicación */}
      <div className="mb-4">
        <label htmlFor="location" className="block mb-1 font-medium text-[#28405F]">Ubicación</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ej: Bosque encantado, Ciudad futurista"
        />
      </div>

      {/* Nivel educativo */}
      <div className="mb-4">
        <label htmlFor="educationLevel" className="block mb-1 font-medium text-[#28405F]">Nivel educativo</label>
        <select
          id="educationLevel"
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona un nivel</option>
          <option value="preescolar">Preescolar</option>
          <option value="primaria">Primaria</option>
          <option value="secundaria">Secundaria</option>
          <option value="universitaria">Universitaria</option>
          <option value="maxima">Máxima complejidad</option>
        </select>
      </div>

      {/* Idioma */}
      <div className="mb-4">
        <label htmlFor="language" className="block mb-1 font-medium text-[#28405F]">Idioma</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona un idioma</option>
          <option value="español">Español</option>
          <option value="catalán">Catalán</option>
          <option value="inglés">Inglés</option>
          <option value="francés">Francés</option>
          <option value="alemán">Alemán</option>
          <option value="urdu">Urdu</option>
          <option value="árabe">Árabe</option>
          <option value="canario">Canario</option>
        </select>
      </div>

      {/* Tiempo de lectura */}
      <div className="mb-6">
        <label htmlFor="readingTime" className="block mb-1 font-medium text-[#28405F]">Tiempo de lectura: {readingTime} minutos</label>
        <input
          type="range"
          id="readingTime"
          min="2"
          max="20"
          value={readingTime}
          onChange={(e) => setReadingTime(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-[#3F69D9] text-white rounded hover:bg-[#28405F]"
      >
        Generar Cuento
      </button>
    </form>
  );
};

export default GenerateTaleForm;