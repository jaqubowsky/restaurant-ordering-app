import { menuArray as menu } from "./data.js";

const mainSection = document.querySelector(".main");
const modalSection = document.querySelector(".modal");
const formSection = document.querySelector(".modal-form");
const allInputs = document.querySelectorAll("input");
let totalPrice = 0;

document.addEventListener("click", (e) => {
  if (e.target.className === "add-food-btn") {
    renderOrderItems(e.target.parentElement.dataset.foodid);
  }

  if (e.target.className === "remove-btn") {
    removeOrderItems(e.target.parentElement.parentElement);
  }

  if (e.target.className === "complete-order-btn") {
    modalSection.classList.remove("hidden");
  }

  if (e.target.className === "modal-close-btn") {
    modalSection.classList.add("hidden");
    allInputs.forEach((input) => {
      input.value = "";
    });
  }

  if (e.target.className === "reduce-food-btn") {
    const currentFood = getCurrentFood(
      e.target.parentElement.parentElement.dataset.foodid
    );

    if (currentFood.isRendered && currentFood.quantity > 0) {
      decreaseQuantity(currentFood);
      decreasePrice(currentFood);
    }
    if (currentFood.quantity === 0) {
      removeOrderItems(e.target.parentElement.parentElement);
    }
  }
});

formSection.addEventListener("submit", (e) => {
  e.preventDefault();
  finishOrder();
});

function getCurrentFood(food_id) {
  const currentFood = menu.filter((food) => {
    if (food.id === parseInt(food_id)) {
      return true;
    }
  });
  return currentFood[0];
}

function decreaseQuantity(currentFood) {
  if (currentFood.quantity > 0) {
    currentFood.quantity -= 1;

    document.querySelector(
      `[data-quantity="${currentFood.id}"]`
    ).innerHTML = `${currentFood.quantity}x`;
  }
}

function decreasePrice(currentFood) {
  const totalItemsPrice = document.querySelector(".items-total-price");
  if (currentFood.isRendered) {
    totalPrice -= currentFood.price;
    totalItemsPrice.textContent = `$${totalPrice}`;
  }
}

function finishOrder() {
  const inputName = document.querySelector('input[name="userName"]');

  modalSection.classList.add("hidden");

  menu.forEach((food) => {
    food.isRendered = false;
    updatePrice(food);
    updateQuantity(food);
  });

  renderPage();
  renderThanks(inputName.value.toLowerCase());

  allInputs.forEach((input) => {
    input.value = "";
  });
}

function renderThanks(name) {
  let capitalName = name[0].toUpperCase() + name.slice(1);

  const thanksSection = document.createElement("div");
  thanksSection.classList.add("thanks-section");
  mainSection.appendChild(thanksSection);

  thanksSection.innerHTML = `<p>Thanks, <span class="thanksName">${capitalName}!</span> Your order is on the way!</p>`;
}

function removeOrderItems(foodObj) {
  const orderSectionItems = document.querySelector(".order-items");

  menu.forEach((food) => {
    if (food.id == foodObj.dataset.foodid) {
      foodObj.remove();
      food.isRendered = false;
      updatePrice(food);
      updateQuantity(food);
    }
  });

  if (orderSectionItems.children.length === 0) {
    document.querySelector(".order-section").classList.add("hidden");
  }
}

function updateQuantity(currentFood) {
  if (!currentFood.isRendered) {
    currentFood.quantity = 0;
  } else {
    currentFood.quantity += 1;
    document.querySelector(
      `[data-quantity="${currentFood.id}"]`
    ).innerHTML = `${currentFood.quantity}x`;
  }
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
  const orderSection = document.querySelector(".order-section");
  const orderItems = document.querySelector(".order-items");
  const thanksSection = document.querySelector(".thanks-section");

  if (thanksSection) {
    thanksSection.remove();
  }

  if (orderSection.className.includes("hidden")) {
    orderSection.classList.remove("hidden");
  }

  if (!currentFood.isRendered) {
    orderItems.innerHTML += `
            <div class="order-item" data-foodId="${currentFood.id}">
              <p class="order-item-name">
                ${currentFood.name} <button class="remove-btn">remove</button>       
                 <button class="reduce-food-btn">-</button>
                  <span class = "item-quantity" data-quantity= "${currentFood.id}">${currentFood.quantity}x </span>
                  <span class="order-food-cost">$${currentFood.price}</span>
              </p>
            </div>
          `;
    currentFood.isRendered = true;
  }

  updateQuantity(currentFood);
  updatePrice(currentFood);
}

renderPage();
