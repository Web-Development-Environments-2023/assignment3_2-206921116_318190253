const axios = require("axios");
const { response } = require("express");
const api_domain = "https://api.spoonacular.com/recipes";
require('dotenv').config();
const DButils = require("./DButils");



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

async function getMyRecipeDetails(recipe_id){
  let { id, title, image, duration, likes, vegan, vegetarian, glutenFree, instruction, servings, ingredients } = `select user_id, name, image, duration, likes, vegan, vegetarian, glutenFree, instruction, servings, ingredients from user_recipes where recipe_id='${recipe_id}'`;
  return{
    id:id,
    title:title,
    image:image,
    duration:duration,
    likes:likes,
    vegan:vegan,
    vegetarian:vegetarian,
    glutenFree:glutenFree,
    instruction:instruction,
    servings:servings,
    ingredients:ingredients
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

async function getMyRecipe(recipe_id){
  const info = await DButils.execQuery(`select name, image, duration, likes, vegan, vegetarian, glutenFree, instructions, servings, ingredients from user_recipes where recipe_id='${recipe_id}'`);
  return({
    "id": recipe_id,
    "title": info[0].name,
    "readyInMinutes": info[0].duration,
    "image": info[0].image,
    "popularity": info[0].likes,
    "vegan": info[0].vegan,
    "vegetarian": info[0].vegetarian,
    "glutenFree": info[0].glutenFree
  })
}



async function getfamilyRecipe(recipe_id){
  const info = await DButils.execQuery(`select name, image, duration, likes, vegan, vegetarian, glutenFree, instructions, servings, ingredients from family_recipes where recipe_id='${recipe_id}'`);
  return({
    "id": recipe_id,
    "title": info[0].name,
    "readyInMinutes": info[0].duration,
    "image": info[0].image,
    "popularity": info[0].likes,
    "vegan": info[0].vegan,
    "vegetarian": info[0].vegetarian,
    "glutenFree": info[0].glutenFree
  })
}

async function getFamilyRecipes(user_id){
  const info = await DButils.execQuery(`select name, image, duration, instructions, servings, ingredients, creator, season from family_recipes where user_id='${user_id}'`);
  return info
}

async function getViewed(user_id){
  const recipes_id = await DButils.execQuery(`select recipe_id from viewed_recipes where user_id='${user_id}'`);
  
  // Map each recipe ID to its corresponding recipe details
  const recipeDetailsPromises = recipes_id.map(recipe => {
      const recipeId = recipe.recipe_id;
      return getRecipeDetails(recipeId);
  });
  const recipeDetails = await Promise.all(recipeDetailsPromises);
  console.log(recipeDetails)
  return recipeDetails;

  }

async function getRecipeByFilter( _query, _cuisine, _intolerance, _diet, _number=5) {
    const params = {
        apiKey: process.env.spooncular_apiKey,
        query: _query
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

      const recipes = response.data.results;

    // Map each recipe ID to its corresponding recipe details
      const recipeDetailsPromises = recipes.map(recipe => {
        const recipeId = recipe.id;
        return getRecipeDetails(recipeId);
      });
      const recipeDetails = await Promise.all(recipeDetailsPromises);

      return recipeDetails;

}

async function getRecipeFullest(recipe_id) {
  const response = await axios.get(`${api_domain}/${recipe_id}/information`, {
      params: {
          includeNutrition: false,
          apiKey: process.env.spooncular_apiKey
      }
  });

  console.log(response.data);

  let {analyzedInstructions,
    instructions,
    extendedIngredients,
    aggregateLikes,
    readyInMinutes,
    image,
    title,
    servings}= response.data;
  
  // const ingridients= extendedIngredients.map(ingridient => {
  //     return [ingridient.name, ingridient.amount, ingridient.unit];
  // });

  // const ingridientsMinimize = await Promise.all(ingridients);
  // details= await getRecipeDetails(recipe_id);

    // return{
    //   details: details,
    //   servings: servings,
    //   instructions: instructions,
    //   ingridients: ingridientsMinimize

    // }

    return {
      analyzedInstructions:analyzedInstructions,
      instructions:instructions,
      extendedIngredients:extendedIngredients,
      aggregateLikes:aggregateLikes,
      readyInMinutes:readyInMinutes,
      image:image,
      title:title,
      servings:servings
    }
  }

  async function getMyRecipeFullest(recipe_id) {
    const info = await DButils.execQuery(`select name, image, duration, likes, vegan, vegetarian, glutenFree, instructions, servings, ingredients from user_recipes where recipe_id='${recipe_id}'`);
    analyzedInstructions = info[0].name
      instructions= info[0].instructions,
      extendedIngredients = info[0].ingredients,
      aggregateLikes = info[0].likes,
      readyInMinutes = info[0].duration,
      image = info[0].image,
      title = info[0].name,
      servings = info[0].servings
    
    // const ingridients= extendedIngredients.map(ingridient => {
    //     return [ingridient.name, ingridient.amount, ingridient.unit];
    // });
  
    // const ingridientsMinimize = await Promise.all(ingridients);
    // details= await getRecipeDetails(recipe_id);
  
      // return{
      //   details: details,
      //   servings: servings,
      //   instructions: instructions,
      //   ingridients: ingridientsMinimize
  
      // }
  
      return {
        analyzedInstructions:analyzedInstructions,
        instructions:instructions,
        extendedIngredients:extendedIngredients,
        aggregateLikes:aggregateLikes,
        readyInMinutes:readyInMinutes,
        image:image,
        title:title,
        servings:servings
      }
    }

    async function getFamilyRecipeFullest(recipe_id) {
      const info = await DButils.execQuery(`select name, image, duration, likes, vegan, vegetarian, glutenFree, instructions, servings, ingredients from family_recipes where recipe_id='${recipe_id}'`);
      analyzedInstructions = info[0].name
        instructions= info[0].instructions,
        extendedIngredients = info[0].ingredients,
        aggregateLikes = info[0].likes,
        readyInMinutes = info[0].duration,
        image = info[0].image,
        title = info[0].name,
        servings = info[0].servings
      
      // const ingridients= extendedIngredients.map(ingridient => {
      //     return [ingridient.name, ingridient.amount, ingridient.unit];
      // });
    
      // const ingridientsMinimize = await Promise.all(ingridients);
      // details= await getRecipeDetails(recipe_id);
    
        // return{
        //   details: details,
        //   servings: servings,
        //   instructions: instructions,
        //   ingridients: ingridientsMinimize
    
        // }
    
        return {
          analyzedInstructions:analyzedInstructions,
          instructions:instructions,
          extendedIngredients:extendedIngredients,
          aggregateLikes:aggregateLikes,
          readyInMinutes:readyInMinutes,
          image:image,
          title:title,
          servings:servings
        }
      }



exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipe = getRandomRecipe;
exports.getRecipeByFilter = getRecipeByFilter;
exports.getRecipeFullest = getRecipeFullest;
exports.getMyRecipe = getMyRecipe;
exports.getViewed = getViewed;
exports.getFamilyRecipes = getFamilyRecipes;
exports.getMyRecipeDetails = getMyRecipeDetails;
exports.getMyRecipeFullest = getMyRecipeFullest;
exports.getfamilyRecipe = getfamilyRecipe;
exports.getFamilyRecipeFullest = getFamilyRecipeFullest;