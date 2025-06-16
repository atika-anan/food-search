const foodContainer = document.getElementById("food-container");
const modal = document.getElementById("modal");
const mealTitle = document.getElementById("meal-title");
const mealImage = document.getElementById("meal-image");
const mealInstructions = document.getElementById("meal-instructions");
const topBtn = document.getElementById("topBtn");

// Load default food on page load
window.onload = () => {
  loadDefaultFood("chicken");
};

// Scroll button show/hide
window.onscroll = () => {
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    topBtn.classList.remove("hidden");
  } else {
    topBtn.classList.add("hidden");
  }
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function loadDefaultFood(defaultFood) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${defaultFood}`;
  const res = await fetch(url);
  const data = await res.json();
  displayFoods(data.meals || []);
}

async function searchFood() {
  const input = document.getElementById("search-input");
  const foodName = input.value.trim();
  if (!foodName) return alert("Please enter a food name");

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.meals) {
    displayFoods(data.meals);
  } else {
    foodContainer.innerHTML = `
          <p class="col-span-full text-center text-red-600 font-semibold text-xl">No recipes found for "${foodName}"</p>
        `;
  }
}

function displayFoods(meals) {
  foodContainer.innerHTML = "";
  meals.forEach((meal) => {
    const div = document.createElement("div");
    div.className =
      "bg-white rounded shadow overflow-hidden hover:shadow-md transition duration-200";
    div.innerHTML = `
  <img src="${meal.strMealThumb}" alt="${
      meal.strMeal
    }" class="w-full h-48 object-cover">
  <div class="p-4 flex flex-col justify-between h-40">
    <div>
      <h3 class="text-lg font-bold mb-1">${meal.strMeal}</h3>
      <p class="text-sm text-gray-600 line-clamp-2">${meal.strInstructions.slice(
        0,
        80
      )}...</p>
    </div>
    <div class="mt-2 flex justify-end">
      <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        onclick="loadMealDetails('${meal.idMeal}')">View More</button>
    </div>
  </div>
`;

    foodContainer.appendChild(div);
  });
}

async function loadMealDetails(id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  const meal = data.meals[0];

  mealTitle.innerText = meal.strMeal;
  mealImage.src = meal.strMealThumb;
  mealInstructions.innerText = meal.strInstructions;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  modal.classList.add("hidden");
}
