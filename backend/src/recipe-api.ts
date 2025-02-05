const API_KEY = process.env.API_KEY

export const searchRecipes = async (searchTerm: string, page: number) => {
    if (!API_KEY) {
        throw new Error("API key not found");
    }

    const baseUrl = "https://api.spoonacular.com/recipes/complexSearch";
    const url = new URL(baseUrl)

    const queryParams = {
        apiKey: API_KEY,
        query: searchTerm,
        number: "5",
        offset: ((page - 1) * 5).toString(),
    };

    url.search = new URLSearchParams(queryParams).toString()

    try {
        const searchResponse = await fetch(url.toString())
        const result = await searchResponse.json()

        return result
    } catch (error) {
        console.error(error)
    }
}

export const getRecipeSummary = async (recipeId: string) => {
    if (!API_KEY) {
        throw new Error("API key not found");
    }

    const url = new URL(`https://api.spoonacular.com/recipes/${recipeId}/summary`);
    const params = {
        apiKey: API_KEY
    }

    url.search = new URLSearchParams(params).toString();

    try {
        const recipeSummary = await fetch(url);
        const jsonSummary = await recipeSummary.json();
        return jsonSummary;
    } catch (error) {
        console.error(error);
    }
};