const API_KEY = process.env.API_KEY

export const searchRecipes = async (searchTerm:string, page:number) => {
    if (!API_KEY){
        throw new Error("API key not found");
    }

    const baseUrl = "https://api.spoonacular.com/recipes/complexSearch";
    const url = new URL(baseUrl)

    const queryParams = {
        apiKey: API_KEY,
        query: searchTerm,
        number: "5",
        offset: ((page-1) * 5).toString(),
    };

    url.search = new URLSearchParams(queryParams).toString()

    try{
        const searchResponse = await fetch(url.toString())
        const result = await searchResponse.json()

        return result
    }catch(error)
    {
        console.error(error)
    }
}