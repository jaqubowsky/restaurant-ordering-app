import { menuArray as menu } from "./data.js";

const foodSection = document.querySelector(".food-section");
const orderSection = document.querySelector(".order-section");

let sumAll = 0;
let isRendered = false;

document.addEventListener("click", (e) => {
  if (e.target.className === "add-food-btn") {
    renderOrderSection(e.target.parentElement.dataset.foodid);
  }

  if (e.target.className === "remove-btn") {
    const currentFood = getCurrentFood(
      e.target.parentElement.parentElement.dataset.foodid
    );
    const orderItems = document.querySelector(".order-items");

    removeOrderItem(e.target.parentElement.parentElement);
    updatePrice();

    if (orderItems.children.length === 0) {
      removeOrderSection();
      currentFood.quantity = 0;
    }
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

function removeOrderItem(currentFoodObj) {
  const currentFood = getCurrentFood(currentFoodObj.dataset.foodid);

  currentFoodObj.remove();
  sumAll -= currentFood.price * currentFood.quantity;
  currentFood.quantity = 0;
  currentFood.isRendered = false;
}

function removeOrderSection() {
  orderSection.innerHTML = "";
  isRendered = false;
  sumAll = 0;

  menu.forEach((food) => {
    food.quantity = 0;
    food.isRendered = false;
  });
}

function renderFood() {
  let foodHtml = "";

  menu.forEach((food) => {
    foodHtml += `
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
        </div>`;
  });

  foodSection.innerHTML = foodHtml;
}

function updatePrice() {
  document.querySelector(".items-total-price").innerHTML = `$${sumAll}`;
}

function renderOrderSection(foodId) {
  const currentFood = getCurrentFood(foodId);
  sumAll += currentFood.price;
  currentFood.quantity += 1;

  if (!isRendered) {
    orderSection.innerHTML = `
    <p class="order-title">Your order:</p>
          <div class="order-items">
            <div class="order-item" data-foodId="${currentFood.id}">
              <p class="order-item-name">
                ${currentFood.name} <button class="remove-btn">remove</button>
                <span class="order-food-cost">$${currentFood.price}</span>
                                <span class = "item-quantity" data-quantity= "${currentFood.id}">${currentFood.quantity}x
              </p>
            </div>
          </div>
            <div class="total-price-section">
            <p class="total-price">
              Total price:
              <span data-total-price class="items-total-price">$${sumAll}</span>
            </p>
          </div>
          <button class="complete-order-btn">Complete order</button>
          
          `;
    isRendered = true;
  } else if (isRendered) {
    if (currentFood.isRendered) {
      document.querySelector(
        `[data-quantity="${currentFood.id}"]`
      ).textContent = `${currentFood.quantity}x`;
    } else {
      document.querySelector(".order-items").innerHTML += `
      <div class="order-item" data-foodId="${currentFood.id}">
        <p class="order-item-name">
          ${currentFood.name} <button class="remove-btn">remove</button>
                <span class="order-food-cost">$${currentFood.price}</span>
                                <span class = "item-quantity" data-quantity= "${currentFood.id}">${currentFood.quantity}x
                
        </p>
      </div>
      `;
    }

    updatePrice();
  }
  currentFood.isRendered = true;
  console.log(currentFood.isRendered);
}

renderFood();
