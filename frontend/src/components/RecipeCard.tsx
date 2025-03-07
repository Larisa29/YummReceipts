import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Recipe } from "../types"

interface Props {
    recipe: Recipe;
    isFavourite: boolean;
    onClick: () => void;
    onFavouriteButtonClick: (recipe: Recipe) => void;

}
const RecipeCard = ({ recipe, onClick, onFavouriteButtonClick, isFavourite}: Props) => {
    return (
        <div className="recipe-card" onClick={onClick}>
            <img src={recipe.image}></img>
            <div className="recipe-card-title">
                <span onClick={(event) => {
                    event.stopPropagation()
                    onFavouriteButtonClick(recipe);
                }}>
                    {isFavourite ? <AiFillHeart size={25} color="red"/> : <AiOutlineHeart size={25} />}
                </span>
                <h2>{recipe.title}</h2>
            </div>

        </div>
    )
}

export default RecipeCard;