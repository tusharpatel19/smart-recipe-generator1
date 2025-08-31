const API_URL = "http://localhost:4000/api";

document.getElementById("loadBtn").addEventListener("click", loadRecipes);

async function loadRecipes() {
  const ingredients = document.getElementById("ingredients").value;
  const diet = document.getElementById("diet").value;
  const difficulty = document.getElementById("difficulty").value;
  const maxTime = document.getElementById("maxTime").value;

  let url = `${API_URL}/recipes?ingredients=${ingredients}&diet=${diet}&difficulty=${difficulty}&maxTime=${maxTime}`;
  
  const res = await fetch(url);
  const data = await res.json();

  const container = document.getElementById("recipes");
  container.innerHTML = "";

  data.forEach(r => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <div class="recipe-title">${r.title}</div>
      <p><b>Cuisine:</b> ${r.cuisine}</p>
      <p><b>Difficulty:</b> ${r.difficulty}, <b>Time:</b> ${r.timeMinutes} mins</p>
      <p><b>Diet:</b> ${r.dietTags.join(", ")}</p>
      <p><b>Match Score:</b> ${r.matchScore}</p>
      <p><b>Average Rating:</b> ⭐ ${r.avgRating}</p>

      <div class="stars" data-id="${r.id}">
        ★★★★★
      </div>

      <button onclick="showSubstitutions('${r.ingredients[0].item}')">
        Suggest Substitutions for "${r.ingredients[0].item}"
      </button>
    `;
    container.appendChild(card);

    // Add rating stars
    card.querySelector(".stars").addEventListener("click", (e) => {
      let rating = prompt("Rate this recipe (1-5):");
      if (rating >= 1 && rating <= 5) {
        rateRecipe(r.id, rating);
      }
    });
  });
}

async function rateRecipe(id, rating) {
  await fetch(`${API_URL}/recipes/${id}/rate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating })
  });
  alert("Thanks for rating!");
  loadRecipes();
}

async function showSubstitutions(ingredient) {
  const res = await fetch(`${API_URL}/substitutions?ingredient=${ingredient}`);
  const data = await res.json();
  alert(`Substitutes for ${ingredient}: ${data.substitutions.join(", ")}`);
}
