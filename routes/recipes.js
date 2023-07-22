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
    // const recipe = await recipes_utils.getRandomRecipe();
    // res.send(recipe);

    // change this afterrrrrrrrrrrrrrrrrrrr

    const recipes = [
      {
          "id": 633068,
          "title": "Authentic Bolognese Sauce",
          "readyInMinutes": 45,
          "image": "https://spoonacular.com/recipeImages/633068-556x370.jpg",
          "popularity": 6,
          "vegan": false,
          "vegetarian": false,
          "glutenFree": true
      },
      {
          "id": 643669,
          "title": "Fried Bee Hoon/ Vermicelli",
          "readyInMinutes": 45,
          "image": "https://spoonacular.com/recipeImages/643669-556x370.jpg",
          "popularity": 2,
          "vegan": false,
          "vegetarian": false,
          "glutenFree": false
      },
      {
          "id": 664101,
          "title": "Turkish squares",
          "readyInMinutes": 45,
          "image": "https://spoonacular.com/recipeImages/664101-556x370.jpg",
          "popularity": 3,
          "vegan": false,
          "vegetarian": true,
          "glutenFree": false
      },
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
  },  
  {
    "id": 654430,
    "title": "Pan Seared Fresh Maine Diver Scallops Creamy Avocado Champagne Grape Salad Teriyaki Cabernet Butter Sauce",
    "readyInMinutes": 5,
    "image": "https://spoonacular.com/recipeImages/654430-556x370.jpg",
    "popularity": 6,
    "vegan": true,
    "vegetarian": true,
    "glutenFree": true
  },
  {
    "id": 654432,
    "title":  "Peanut Butter Chocolate Chip Pie",
    "readyInMinutes": 5,
    "image": "https://spoonacular.com/recipeImages/655270-556x370.jpg",
    "popularity": 6,
    "vegan": true,
    "vegetarian": true,
    "glutenFree": true
  },
    
      
  ];

  const shuffled = recipes.sort(() => 0.5 - Math.random());
  const randomRecipes = shuffled.slice(0, 3);

  res.send(randomRecipes);

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
 * This path returns full details of a recipe by its id
 */
router.get("/full/:recipeId", async (req, res, next) => {
  try {
    console.log(req)
    const recipe = await recipes_utils.getRecipeFullest(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/myfull/:recipeId", async (req, res, next) => {
  try {
    console.log(req)
    const recipe = await recipes_utils.getMyRecipeFullest(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/familyfull/:recipeId", async (req, res, next) => {
  try {
    console.log(req)
    const recipe = await recipes_utils.getFamilyRecipeFullest(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
