var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

/**
 *  * This path returns a certin recipe by filters 

 */
router.get("/complexSearch", async (req, res, next) => {
  try {
    const { query, cuisine, intolerance, diet, number } = req.query;

    // Pass the optional parameters to the getRecipeByFilter() function
    const recipe = await recipes_utils.getRecipeByFilter(query, cuisine, intolerance, diet, number);

    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns random recipe
 */
router.get("/random", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRandomRecipe();
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a preview details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/full/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeFullest(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
