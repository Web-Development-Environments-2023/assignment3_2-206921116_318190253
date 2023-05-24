const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
require('dotenv').config();



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function getRandomRecipe() {
    const response= await axios.get(`${api_domain}/random`, {
        params: {
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    const recipes = response.data.recipes;

    // Map each recipe ID to its corresponding recipe details
    const recipeDetailsPromises = recipes.map(recipe => {
        const recipeId = recipe.id;
        return getRecipeDetails(recipeId);
    });
    const recipeDetails = await Promise.all(recipeDetailsPromises);

    return recipeDetails;
}


async function getRecipeByFilter( _query, _cuisine, _intolerance, _diet, _number) {
    const params = {
        apiKey: process.env.spooncular_apiKey,
        query: _query,
      };
    
      if (_cuisine !== "none") {
        params.cuisine = _cuisine;
      }
    
      if (_intolerance !== "none") {
        params.intolerance = _intolerance;
      }
    
      if (_diet !== "none") {
        params.diet = _diet;
      }
    
      if (_number !== "none") {
        params.number = _number;
      }
    
      const response = await axios.get(`${api_domain}/complexSearch`, { params });
      return response.data;

}


exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipe = getRandomRecipe;
exports.getRecipeByFilter = getRecipeByFilter;



