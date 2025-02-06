-- Drop database if it exists

DROP DATABASE foodie;

-- Create the database (run this manually if needed)
CREATE DATABASE foodie;

-- Connect to the database
\c foodie;

-- Create the table
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT,
    ingredients TEXT,
    description TEXT
);

-- Insert some sample data
INSERT INTO recipes (name, image, ingredients, description) VALUES
('Lentil Fritters', 'https://img.spoonacular.com/recipes/649921-312x231.jpg', 
'yellow split chana dal, green chillies, shallots, ginger, asafoetida, salt, curry leaves, oil',
'You can never have too many main course recipes, so give Lentil Fritters (Parippu Vada) a try. One portion of this dish contains around 25g of protein, 4g of fat, and a total of 405 calories. For 94 cents per serving, this recipe covers 34% of your daily requirements of vitamins and minerals. This recipe serves 2. 1 person has tried and liked this recipe. It is brought to you by Foodista. It is a good option if you''re following a gluten free, dairy free, lacto ovo vegetarian, and vegan diet. From preparation to the plate, this recipe takes about 45 minutes. If you have chana dal, ginger, shallots, and a few other ingredients on hand, you can make it. Overall, this recipe earns a pretty good spoonacular score of 74%. Similar recipes include Lentil Fritters (Parippu Vada), medu vada , how to make medu vada | urad dal vada | ulundu vada, and Cabbage Vada/Cabbage fritters'),

('Curried Cream Of Mushroom Soup', 'https://img.spoonacular.com/recipes/641075-312x231.jpg', 
 'butter, garlic, onion, carrots, flour, broth, white wine, basil, thyme, heavy cream, pepper, curry, salt, if you use the reconstituted broth, dried ground, dried ground',
 'Curried Cream Of Mushroom Soup might be a good recipe to expand your hor d''oeuvre recipe box. This recipe serves 12 and costs 76 cents per serving. One serving contains 128 calories, 1g of protein, and 10g of fat. 1 person has made this recipe and would make it again. A mixture of salt, white wine, carrots, and a handful of other ingredients are all it takes to make this recipe so tasty. It is perfect for Autumn. It is a good option if you''re following a lacto ovo vegetarian diet. From preparation to the plate, this recipe takes about 45 minutes. It is brought to you by Foodista. Overall, this recipe earns a rather bad spoonacular score of 12%. Users who liked this recipe also liked Curried Mushroom Soup, Cream Of Curried Parsnip Soup, and Cream of Curried Peanut Soup.');
