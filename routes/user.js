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
    res.status(200).send(recipes_id);
  } catch(error){
    next(error); 
  }
});

router.get('/getmyrecipes', async (req, res, next)=>{
try{
  const user_id = req.session.user_id;
  const results = await user_utils.getMyRecipes(user_id);
  // console.log("final:")
  // console.log(results)
  res.status(200).send(results);
}
catch(error){
  next(error); 
}

})

router.get('/viewed', async (req, res, next)=>{
try{
  // const user_id = req.session.user_id;
  // const results = await recipe_utils.getViewed(user_id);
  // res.status(200).send(results);

  res.send([
    {
        "id": 640166,
        "title": "Cornmeal-Crusted Catfish with Cajun Seasoning and Spicy Tartar Sauce",
        "readyInMinutes": 45,
        "image": "https://spoonacular.com/recipeImages/640166-556x370.jpg",
        "popularity": 8,
        "vegan": false,
        "vegetarian": false,
        "glutenFree": true
    },
    {
        "id": 975070,
        "title": "Instant Pot Chicken Taco Soup",
        "readyInMinutes": 25,
        "image": "https://spoonacular.com/recipeImages/975070-556x370.jpg",
        "popularity": 6,
        "vegan": false,
        "vegetarian": false,
        "glutenFree": true
    },
    {
        "id": 1098357,
        "title": "Three Ingredient Frozen Pina Colada",
        "readyInMinutes": 5,
        "image": "https://spoonacular.com/recipeImages/1098357-556x370.jpg",
        "popularity": 6,
        "vegan": true,
        "vegetarian": true,
        "glutenFree": true
    }
])
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
      console.log("trying")
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
