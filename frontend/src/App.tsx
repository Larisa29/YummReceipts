import { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import * as api from './API';
import { Recipe } from './types';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import { AiOutlineSearch } from 'react-icons/ai';

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

  const addFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.addFavouriteRecipe(recipe);
      setFavouriteRecipes([...favouriteRecipes, recipe]);

    } catch (error) {
      console.log(error);
    }
  }

  const deleteFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.deleteFavouriteRecipe(recipe);
      const updatedRecipes = favouriteRecipes.filter(currentFavourite => currentFavourite.id !== recipe.id);

      setFavouriteRecipes(updatedRecipes);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='app-container'>
      <div className='header'>
        <div className='title'>What's in your fridge?</div>
      </div>
      <div className='tabs'>
        <h1
          className={selectedTab === "search" ? "tab-active" : ""}
          onClick={() => setSelectedTab("search")}> Recipe Search </h1>
        <h1
          className={selectedTab === "favourites" ? "tab-active" : ""}
          onClick={() => setSelectedTab("favourites")}> Favourites </h1>
      </div>
      {selectedTab === "search" && (
        <>
          <form onSubmit={(event) => handleSearchSubmit(event)}>
            <input type="text"
              required
              placeholder='enter a search term...'
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}></input>
            <button type="submit"><AiOutlineSearch size={40} /></button>
          </form>

          <div className='recipe-grid'>
            {
              recipes.map((recipe) => {
                const isFavourite = favouriteRecipes.some(
                  (favRecipe) => recipe.id === favRecipe.id
                );

                return (<RecipeCard
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFavouriteButtonClick={isFavourite ? deleteFavouriteRecipe : addFavouriteRecipe}
                  isFavourite={isFavourite}
                />);
              })
            }
          </div>

          <button
            className='view-more'
            onClick={handleViewMoreClick}>View more
          </button>
        </>
      )}
      {selectedTab === "favourites" && (
        <div className='recipe-grid'>
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={deleteFavouriteRecipe}
              isFavourite={true}
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
