const DButils = require("./DButils");
const recipes_utils = require('./recipes_utils');

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    const recipeDetailsPromises = recipes_id.map(recipe => {
      const recipeId = recipe.recipe_id;
      return recipes_utils.getRecipeDetails(recipeId);
  });
  const recipeDetails = await Promise.all(recipeDetailsPromises);
  return recipeDetails;
}

async function getMyRecipes(user_id){
  const recipes_id = await DButils.execQuery(`select recipe_id from user_recipes where user_id='${user_id}'`);
  console.log(recipes_id)
  const recipeDetailsPromises = recipes_id.map(recipe => {
    const recipeId = recipe.recipe_id;
    return recipes_utils.getMyRecipe(recipeId);
  });
  const recipeDetails = await Promise.all(recipeDetailsPromises);
  return recipeDetails;
}

async function MarkLastRecipeViewed(user_id, recipe_id){
    const countViewed = await DButils.execQuery(`SELECT COUNT(*) as count FROM viewed_recipes WHERE user_id = '${user_id}'`)
    const count = countViewed[0].count;
    if (count < 3) {
        // User has less than three saved recipes, so insert a new row
        const insertQuery = `INSERT INTO viewed_recipes (user_id, recipe_id, viewed_at) VALUES (${user_id}, ${recipe_id}, NOW())`;
        await DButils.execQuery(insertQuery);
      } else {
        // User already has three saved recipes, so update the oldest one
        const selectQuery = `SELECT id FROM viewed_recipes WHERE user_id = ${user_id} ORDER BY viewed_at ASC LIMIT 1`;
        const rows = await DButils.execQuery(selectQuery);
        const oldest_id = rows[0].id;
  
        const updateQuery = `UPDATE viewed_recipes SET recipe_id = ${recipe_id}, viewed_at = NOW() WHERE id = ${oldest_id}`;
        await DButils.execQuery(updateQuery);
      }
}


async function addUserRecipe(user_id, data) {
  console.log("adding")
  const rows = await DButils.execQuery(
    `INSERT INTO user_recipes (user_id, name, image, duration, likes, vegan, vegetarian, glutenFree, instructions, servings) VALUES 
    ('${user_id}', '${data.name}', '${data.image}', '${data.duration}', '${data.likes}', '${data.vegan}',
     '${data.vegetarian}', '${data.glutenFree}', '${data.instructions}', '${data.servings}')`
  );

  const ingredientsJSON = JSON.stringify(data.ingredients);
  const id = rows.insertId;

  const updateQuery = `UPDATE user_recipes SET ingredients = '${ingredientsJSON}' WHERE recipe_id = ${id}`;
  await DButils.execQuery(updateQuery);
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.MarkLastRecipeViewed = MarkLastRecipeViewed;
exports.addUserRecipe = addUserRecipe;
exports.getMyRecipes = getMyRecipes;
