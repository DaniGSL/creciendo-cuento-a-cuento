'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Eliminamos la importación de jsPDF
// import { jsPDF } from "jspdf";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Importamos los tipos necesarios de pdfmake
import { TDocumentDefinitions, ContentText, Style } from 'pdfmake/interfaces';
  // Extendemos TDocumentDefinitions para incluir la propiedad 'rtl'
interface CustomDocumentDefinitions extends TDocumentDefinitions {
  rtl?: boolean;
}

interface Character {
  id: string;
  name: string;
  description: string;
  toSave: boolean;
}

// Definimos una interfaz personalizada que extiende 'Style'
interface CustomStyle extends Style {
  direction?: 'ltr' | 'rtl';
}

const GenerateTaleForm: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [newCharacter, setNewCharacter] = useState<Omit<Character, 'id' | 'toSave'>>({ name: '', description: '' });
  const [genre, setGenre] = useState('');
  const [location, setLocation] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [readingTime, setReadingTime] = useState(10);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [selectedSavedCharacter, setSelectedSavedCharacter] = useState<string>('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchSavedCharacters();
    }
  }, [session]);

  const fetchSavedCharacters = async () => {
    try {
      const response = await fetch('/api/characters');
      if (response.ok) {
        const data = await response.json();
        setSavedCharacters(data);
      } else {
        console.error('Error fetching saved characters');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddCharacter = () => {
    if (newCharacter.name && newCharacter.description) {
      const characterToAdd = { ...newCharacter, id: Date.now().toString(), toSave: false };
      setCharacters([...characters, characterToAdd]);
      setNewCharacter({ name: '', description: '' });
    }
  };

  const handleRemoveCharacter = (id: string) => {
    setCharacters(characters.filter(char => char.id !== id));
  };

  const handleToggleSaveCharacter = (id: string) => {
    setCharacters(characters.map(char => 
      char.id === id ? { ...char, toSave: !char.toSave } : char
    ));
  };

  const handleSelectSavedCharacter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSavedCharacter(e.target.value);
  };

  const handleAddSavedCharacter = () => {
    const characterToAdd = savedCharacters.find(char => char.id === selectedSavedCharacter);
    if (characterToAdd && !characters.some(char => char.id === characterToAdd.id)) {
      setCharacters([...characters, { ...characterToAdd, toSave: false }]);
      setSelectedSavedCharacter('');
    }
  };

  const saveSelectedCharacters = async () => {
    const charactersToSave = characters.filter(char => char.toSave);
    for (const char of charactersToSave) {
      try {
        const response = await fetch('/api/characters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: char.name,
            description: char.description
          }),
        });
        if (!response.ok) {
          console.error('Error saving character:', char.name);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchSavedCharacters(); // Actualizar la lista de personajes guardados
  };

  const generatePDF = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  
    // Importación dinámica de pdfmake y las fuentes
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    const pdfFonts: any = await import('pdfmake/build/vfs_fonts');
    const customFonts = (await import('../utils/pdfFonts')).default;
  
    // Asignamos las fuentes al vfs de pdfmake
    pdfMake.vfs = {
      ...pdfFonts.pdfMake.vfs,
      ...customFonts,
    };
  
    // Configuramos las fuentes disponibles
    pdfMake.fonts = {
      NotoSansArabic: {
        normal: 'NotoSansArabic-Regular.ttf',
        bold: 'NotoSansArabic-Bold.ttf',
      },
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
      },
    };
  
    // Obtenemos el título y contenido del cuento
    const lines = generatedStory.split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
  
    // Determinamos el idioma y configuramos la fuente y dirección
    let font = 'Roboto';
    let isRTL = false;
    if (language.toLowerCase() === 'árabe' || language.toLowerCase() === 'urdu') {
      font = 'NotoSansArabic';
      isRTL = true;
    }
  
    // Creamos el contenido del PDF
    const pdfContent: any[] = [
      {
        text: title,
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],
        alignment: isRTL ? 'right' : 'left',
      },
      {
        text: content,
        fontSize: 12,
        alignment: isRTL ? 'right' : 'left',
      },
    ];
  
    // Definimos el documento PDF
    const docDefinition: CustomDocumentDefinitions = {
      content: pdfContent,
      defaultStyle: {
        font: font,
        alignment: isRTL ? 'right' : 'left',
      },
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      rtl: isRTL, // Añadimos esta línea para habilitar RTL globalmente
    };
  
    // Generamos y descargamos el PDF
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.download(`${title}.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  };

  const handleSaveStory = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!session) {
      alert('Debes iniciar sesión para guardar cuentos');
      return;
    }
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedStory.split('\n')[0],
          content: generatedStory,
          genre,
          characters: characters.map(char => char.name),
          language,
          readingTime
        }),
      });
      if (response.ok) {
        alert('Cuento guardado en la biblioteca');
        router.push('/biblioteca');
      } else {
        alert('Error al guardar el cuento');
      }
    } catch (error) {
      console.error('Error al guardar el cuento:', error);
      alert('Error al guardar el cuento');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Guardar personajes seleccionados antes de generar el cuento
    await saveSelectedCharacters();

    const characterDescriptions = characters.map(char => `${char.name}: ${char.description}`).join('\n');
    const prompt = `Genera una historia completa de ${genre} que ocurra en ${location}.
    Los personajes principales son: ${characters.map(char => char.name).join(', ')}.
    La historia debe ser apropiada para un nivel educativo ${educationLevel} y estar escrita en ${language}.
    La longitud aproximada debe ser de ${readingTime * 100} palabras.
    La historia debe tener un inicio, desarrollo y un final feliz.
    Genera un título creativo para la historia y colócalo en la primera línea, seguido de un salto de línea.
    No incluyas ningún texto introductorio o de cierre fuera de la historia en sí.
    Información adicional sobre los personajes:
    ${characterDescriptions}
    Por favor, genera la historia completa basándote en esta información.`;

    try {
      const response = await axios.post('/api/generate-story', { prompt });
      setGeneratedStory(response.data.story);
    } catch (error) {
      console.error('Error al generar el cuento:', error);
      setError('Hubo un error al generar el cuento. Por favor, inténtalo de nuevo. Si el error persiste, ponte en contacto con nosotros.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-4 sm:mt-8 p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#28405F]">Generar Cuento</h2>

      {/* Sección de personajes */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#3F69D9]">Personajes</h3>
        <div className="flex flex-col sm:flex-row mb-2">
          <input
            type="text"
            value={newCharacter.name}
            onChange={(e) => setNewCharacter({...newCharacter, name: e.target.value})}
            placeholder="Nombre del personaje"
            className="flex-grow mb-2 sm:mb-0 sm:mr-2 p-2 border rounded"
          />
          <input
            type="text"
            value={newCharacter.description}
            onChange={(e) => setNewCharacter({...newCharacter, description: e.target.value})}
            placeholder="Descripción"
            className="flex-grow mb-2 sm:mb-0 sm:mr-2 p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddCharacter}
            className="w-full sm:w-auto px-4 py-2 bg-[#3D8BF2] text-white rounded hover:bg-[#3F69D9]"
          >
            Añadir
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center mb-2">
          <select
            value={selectedSavedCharacter}
            onChange={handleSelectSavedCharacter}
            className="w-full sm:w-auto flex-grow p-2 border rounded mb-2 sm:mb-0 sm:mr-2"
          >
            <option value="">Seleccionar personaje guardado</option>
            {savedCharacters.map(char => (
              <option key={char.id} value={char.id}>{char.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddSavedCharacter}
            className="w-full sm:w-auto px-4 py-2 bg-[#3D8BF2] text-white rounded hover:bg-[#3F69D9]"
            disabled={!selectedSavedCharacter}
          >
            Añadir Seleccionado
          </button>
        </div>
        <ul className="list-disc pl-5">
          {characters.map((char) => (
            <li key={char.id} className="mb-1 flex flex-wrap items-center">
              <span className="mr-2">{char.name} - {char.description}</span>
              <button
                type="button"
                onClick={() => handleRemoveCharacter(char.id)}
                className="mr-2 text-[#F24949] hover:text-red-700"
              >
                Eliminar
              </button>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={char.toSave}
                  onChange={() => handleToggleSaveCharacter(char.id)}
                  className="mr-1"
                />
                Guardar en galería
              </label>
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
          <option value="gallego">Gallego</option>
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
        disabled={isLoading}
      >
        {isLoading ? 'Generando...' : 'Generar Cuento'}
      </button>

      {/* Mostrar error si existe */}
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Mostrar la historia generada */}
      {generatedStory && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2 text-[#3F69D9]">Historia Generada</h3>
          <p className="whitespace-pre-wrap">{generatedStory}</p>
          <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={generatePDF}
              className="w-full sm:w-auto px-4 py-2 bg-[#3D8BF2] text-white rounded hover:bg-[#3F69D9]"
            >
              Descargar PDF
            </button>
            <button 
              onClick={handleSaveStory}
              className="w-full sm:w-auto px-4 py-2 bg-[#28405F] text-white rounded hover:bg-[#3F69D9]"
            >
              Guardar en Biblioteca
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default GenerateTaleForm;
