import { Recipe } from "../types"

interface Props{
    recipe:Recipe
}
const RecipeCard = ({ recipe } : Props) => {
    return (
        <div className="recipe-card">
            <img src={recipe.image}></img>
            <div className="recipe-card-title">
                <h2>{recipe.title}</h2>
            </div>

        </div>
    )
}

export default RecipeCard;