var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get('/getmyrecipe', async (req, res, next)=>{
try{
  const recipe_id = req.body.recipe_id;
  const results = await recipe_utils.getMyRecipe(recipe_id);
  res.status(200).send(results);

}
catch(error){
  next(error); 
}

})

router.get('/viewed', async (req, res, next)=>{
try{
  const user_id = req.session.user_id;
  const results = await recipe_utils.getViewed(user_id);
  res.status(200).send(results);
}
catch(error){
  next(error); 
}

})

router.get('/MyfamilyRecipes', async (req, res, next)=>{
  try{
    const user_id = req.session.user_id;
    const results = await recipe_utils.getFamilyRecipes(user_id);
    res.status(200).send(results);
  }
  catch(error){
    next(error); 
  }

})

/**
 * This path adds viewed recipes to the database
 */
router.post('/viewed', async(req, res, next) =>{
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    await user_utils.MarkLastRecipeViewed(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as viewed lately");
  
  }
  catch(error){
    next(error);
  }
  })

  /**
 * This path updates the last serach query from the user in the data base
 */

  router.post('/lastSearch', async(req, res, next)=>{
    try{
      const user_id = req.session.user_id;
      const query = req.body.search;
      const updateQuery = `UPDATE users SET lastSearch = '${query}' WHERE user_id = ${user_id}`;
      await DButils.execQuery(updateQuery);
      res.status(200).send("The query successfully saved as last search");

    }
    catch(error){
      next(error);
    }

  });


   /**
 * This path updates the last serach query from the user in the data base
 */

   router.post('/addUserRecipe', async(req, res, next)=>{
    try{
      const user_id = req.session.user_id;
      const data = req.body;
      await user_utils.addUserRecipe(user_id, data);
      res.status(200).send("The recipe successfully added");
    }
    catch(error){
      next(error);
    }

  });



module.exports = router;
