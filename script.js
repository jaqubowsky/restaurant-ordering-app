import { menuArray as menu } from "./data.js";

const mainSection = document.querySelector(".main");

let totalPrice = 0;

document.addEventListener("click", (e) => {
  if (e.target.className === "add-food-btn") {
    renderOrderItems(e.target.parentElement.dataset.foodid);
  }

  if (e.target.className === "remove-btn") {
    removeOrderItems(e.target.parentElement.parentElement);
  }
});

function getCurrentFood(food_id) {
  const currentFood = menu.filter((food) => {
    if (food.id === parseInt(food_id)) {
      return true;
    }
  });
  return currentFood[0];
}

function removeOrderItems(foodObj) {
  const orderSectionItems = document.querySelector(".order-items");

  menu.forEach((food) => {
    if (food.id == foodObj.dataset.foodid) {
      foodObj.remove();
      food.isRendered = false;
      updatePrice(food);
      food.quantity = 0;
    }
  });

  if (orderSectionItems.children.length === 0) {
    document.querySelector(".order-section").classList.add("hidden");
  }
}

function updateQuantity(currentFood) {
  currentFood.quantity += 1;

  document.querySelector(
    `[data-quantity="${currentFood.id}"]`
  ).innerHTML = `${currentFood.quantity}x`;
}

function updatePrice(currentFood) {
  const totalItemsPrice = document.querySelector(".items-total-price");

  if (currentFood.isRendered) {
    totalPrice += currentFood.price;
  } else {
    totalPrice -= currentFood.price * currentFood.quantity;
  }
  totalItemsPrice.textContent = `$${totalPrice}`;
}

function renderPage() {
  let foodHtml = "";

  menu.forEach((food) => {
    foodHtml += `
    <div class="food-section">
        <div class="food-card" data-foodId="${food.id}">
          <p class="order-emoji">${food.emoji}</p>
          <div class="food-info">
            <p class="food-name">${food.name}</p>
            <span data-food-ingredients class="food-ingredients"
              >${food.ingredients}</span
            >
            <span data-food-cost class="food-cost">$${food.price}</span>
          </div>
          <button class="add-food-btn">+</button>
        </div>
      </div>
          `;
  });

  foodHtml += `  <div class="order-section hidden">
      <p class="order-title">Your order:</p>
        <div class="order-items"></div>
        <div class="total-price-section">
          <p class="total-price">Total price: <span class="items-total-price">0$</span></p>
          <button class="complete-order-btn">Complete order</button>
        </div>
   </div>`;

  mainSection.innerHTML = foodHtml;
}

function renderOrderItems(foodId) {
  const currentFood = getCurrentFood(foodId);
  const orderItems = document.querySelector(".order-items");
  const orderSection = document.querySelector(".order-section");

  if (orderSection.className.includes("hidden")) {
    orderSection.classList.remove("hidden");
  }

  if (!currentFood.isRendered) {
    orderItems.innerHTML += `
            <div class="order-item" data-foodId="${currentFood.id}">
              <p class="order-item-name">
                ${currentFood.name} <button class="remove-btn">remove</button>
                <span class="order-food-cost">$${currentFood.price}</span>
                                <span class = "item-quantity" data-quantity= "${currentFood.id}">${currentFood.quantity}x
              </p>
            </div>
          `;
    currentFood.isRendered = true;
  }

  updateQuantity(currentFood);
  updatePrice(currentFood);
}

renderPage();
