import { FormEvent, useState } from 'react';
import './App.css';
import * as api from './API';
import { Recipe } from './types';

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const recipes = await api.searchReceipes(searchTerm, 1);
      setRecipes(recipes.results);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <form onSubmit={(event) => handleSearchSubmit(event)}>
        <input type="text"
          required
          placeholder='enter a search term...'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}></input>
        <button type="submit">Submit</button>
      </form>
      {
        recipes.map((recipe) => (
          <div key={recipe.id}>
            Recipe img location: {recipe.image}
            <br />
            Recipe title: {recipe.title}
          </div>
        ))}
    </div>
  );
};

export default App
