import { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import * as api from './API';
import { Recipe } from './types';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';

type Tabs = "search" | "favourites";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const pageNumber = useRef(1);
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipes();
        setFavouriteRecipes(favouriteRecipes.results);
      }
      catch (error) {
        console.log(error);
      }
    }

    fetchFavouriteRecipes();
  }, [])

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results);
      pageNumber.current = 1;

    } catch (error) {
      console.log(error);
    }
  }

  const handleViewMoreClick = async () => {
    const nextpage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextpage)
      setRecipes([...recipes, ...nextRecipes.results])
      pageNumber.current = nextpage
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className='tabs'>
        <h1 onClick={() => setSelectedTab("search")}> Recipe Search </h1>
        <h1 onClick={() => setSelectedTab("favourites")}> Favourites </h1>
      </div>
      {selectedTab === "search" && (
        <>
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
              <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
            ))
          }

          <button
            className='wiew-more'
            onClick={handleViewMoreClick}>View more
          </button>
        </>
      )}
      {selectedTab === "favourites" && (
        <div>
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {selectedRecipe ?
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
        : null}
    </div>
  );
};

export default App
