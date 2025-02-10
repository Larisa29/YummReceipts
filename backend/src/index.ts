require('dotenv').config();
import express, { Request, Response } from "express";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/recipe/search", async (req: Request, res: Response) => {
  const searchTerm = req.query.searchTerm as string;
  const page = parseInt(req.query.page as string);

  const result = await RecipeAPI.searchRecipes(searchTerm, page);

  res.status(200).json(result);
});

app.get("/api/recipes/:recipeId/summary", async (req, res) => {
  const recipeId = req.params.recipeId;
  const results = await RecipeAPI.getRecipeSummary(recipeId);

  res.json(results);
})

app.listen(5000, () => {
  console.log("Server running on localhost:5000");
});