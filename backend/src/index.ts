require('dotenv').config();
import express, { Request, Response } from "express";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";
import { PrismaClient } from "@prisma/client";

const app = express();
const prismaClient = new PrismaClient();

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

app.post("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;

  try {
    const favouriteRecipe = await prismaClient.favouriteRecipes.create({
      data: {
        recipeId: recipeId
      }
    });
    res.status(201).json(favouriteRecipe)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "hmm..smth went wrong!" });
  }
})

app.get("/api/recipes/favourite", async (req, res) => {
  try {
    const recipes = await prismaClient.favouriteRecipes.findMany();
    const recipesIds = recipes.map((recipe) => recipe.recipeId.toString());
    const result = await RecipeAPI.getRecipes(recipesIds);

    res.status(200).json(result);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "hmm..smth went wrong!" });
  }
})

app.delete("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;

  if (!recipeId) {
    res.status(400).json({ error: "recipeId is required!" });
  }

  try {
    const recipe = await prismaClient.favouriteRecipes.findUnique({
      where: { recipeId }
    });

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found!" });
    }

    await prismaClient.favouriteRecipes.delete({
      where: {
        recipeId: recipeId
      }
    })
    res.status(204).send();

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "hmm..smth went wrong!" });
  }
})

app.listen(5000, () => {
  console.log("Server running on localhost:5000");
});