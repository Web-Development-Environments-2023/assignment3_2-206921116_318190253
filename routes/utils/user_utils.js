const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function MarkLastRecipeViewed(user_id, new_recipe_id){
    await DButils.execQuery(`
    UPDATE users
    SET recipeHistory = JSON_ARRAY_INSERT(
      JSON_REMOVE(recipeHistory, '$[2]'),
      '$[0]',
      JSON_EXTRACT(recipeHistory, '$[1]')
    )
    WHERE JSON_LENGTH(recipeHistory) >= 3 AND user_id = '${user_id}';
  `);
  
  await DButils.execQuery(`
    UPDATE users
    SET recipeHistory = JSON_ARRAY_INSERT(recipeHistory, '$[1]', JSON_EXTRACT(recipeHistory, '$[0]'))
    WHERE JSON_LENGTH(recipeHistory) >= 3 AND user_id = '${user_id}';
  `);

  await DButils.execQuery(`
  UPDATE users
  SET recipeHistory = JSON_ARRAY_INSERT(recipeHistory, '$[0]', '${new_recipe_id}')
  WHERE user_id = '${user_id}';
`);

const result = await DButils.execQuery(`
  SELECT JSON_EXTRACT(recipeHistory, '$[0]') AS recipe1,
         JSON_EXTRACT(recipeHistory, '$[1]') AS recipe2,
         JSON_EXTRACT(recipeHistory, '$[2]') AS recipe3
  FROM users
  WHERE user_id = '${user_id}'
`);

// Access the values
const recipe1 = result[0].recipe1;
const recipe2 = result[0].recipe2;
const recipe3 = result[0].recipe3;

console.log(recipe1)
  
// await DButils.execQuery(`
//   UPDATE users
//   SET recipeHistory = '${new_recipe_id}'
//   WHERE user_id = '${user_id}';
// `);

// const result = await DButils.execQuery(`
//   SELECT recipeHistory
//   FROM users
//   WHERE user_id = '${user_id}'
// `);

// // Access the value
// const recipe = result.recipeHistory;

// console.log(new_recipe_id);
  
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.MarkLastRecipeViewed = MarkLastRecipeViewed;
