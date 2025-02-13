const searchRecipes = async (searchTerm: string, page: number) => {
    const baseURL = new URL("http://localhost:5000/api/recipe/search");
    baseURL.searchParams.append("searchTerm", searchTerm);
    baseURL.searchParams.append("page", page.toString());

    const response = await fetch(baseURL.toString());

    if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
    }

    return response.json();
}

const getRecipeSummary = async (recipeId: string) => {
    const baseURL = new URL(`http://localhost:5000/api/recipes/${recipeId}/summary`);
    const response = await fetch(baseURL);

    if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
    }

    return response.json();
};

const getFavouriteRecipes = async () => {
    const url = new URL("http://localhost:5000/api/recipes/favourite");
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`http error - status: ${response.status}`);
    }

    return response.json();
}

export { searchRecipes, getRecipeSummary, getFavouriteRecipes };