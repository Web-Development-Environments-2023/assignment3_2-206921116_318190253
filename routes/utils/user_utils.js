const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function MarkLastRecipeViewed(user_id, recipe_id){
    const countViewed = await DButils.execQuery(`SELECT COUNT(*) as count FROM viewed_recipes WHERE user_id = '${user_id}'`)
    const count = countViewed[0].count;
    console.log(count)
    if (count < 3) {
        console.log("got here!")
        // User has less than three saved recipes, so insert a new row
        const insertQuery = `INSERT INTO viewed_recipes (user_id, recipe_id, viewed_at) VALUES (${user_id}, ${recipe_id}, NOW())`;
        await DButils.execQuery(insertQuery);
        console.log('New row inserted successfully!');
      } else {
        // User already has three saved recipes, so update the oldest one
        const selectQuery = `SELECT id FROM viewed_recipes WHERE user_id = ${user_id} ORDER BY viewed_at ASC LIMIT 1`;
        const rows = await DButils.execQuery(selectQuery);
        const oldest_id = rows[0].id;
  
        const updateQuery = `UPDATE viewed_recipes SET recipe_id = ${recipe_id}, viewed_at = NOW() WHERE id = ${oldest_id}`;
        await DButils.execQuery(updateQuery);
        console.log('Row updated successfully!');
      }
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.MarkLastRecipeViewed = MarkLastRecipeViewed;
