export const TRIED_FOODS = [
  'banana',
  'peanut butter',
  'bread',
  'mango',
  'strawberry',
  'applesauce',
  'eggs',
  'avocado',
  'pineapple',
  'sweet potato',
]

export const NEW_FOOD_OPTIONS = [
  'oatmeal',
  'yogurt',
  'peach',
  'pear',
  'blueberry',
  'butternut squash',
  'carrot',
  'green beans',
  'peas',
  'chicken',
  'turkey',
  'tofu',
  'lentils',
  'zucchini',
  'cucumber',
  'watermelon',
  'rice cereal',
  'cottage cheese',
  'broccoli',
  'cauliflower',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

let dailyNewFood = null
let dailyDate = null

function getDailyNewFood() {
  const today = new Date().toDateString()
  if (dailyDate !== today) {
    dailyDate = today
    dailyNewFood = shuffle(NEW_FOOD_OPTIONS)[0]
  }
  return dailyNewFood
}

export function suggestSolids(mealNumber) {
  const safe = shuffle(TRIED_FOODS)
  const picks = safe.slice(0, 2)
  const newFood = getDailyNewFood()

  if (mealNumber === 1) {
    picks.push(newFood)
    return { foods: picks, newFood }
  }

  return { foods: [...picks, safe[2] || safe[0]], newFood: null }
}
