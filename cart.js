// Initialize cart items from local storage
let cartItems = [];

// Check if cart items exist in local storage
const storedCartItems = localStorage.getItem('cartItems');
if (storedCartItems) {
  cartItems = JSON.parse(storedCartItems);
}

// Function to display the cart items on the cart page
function displayCartItems() {
  const cartTable = document.getElementById('cartItems');
  cartTable.innerHTML = '';

  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      const tableRow = document.createElement('tr');

      const imageCell = document.createElement('td');
      const image = document.createElement('img');
      image.src = item.image;
      imageCell.appendChild(image);

      const nameCell = document.createElement('td');
      nameCell.textContent = item.name;

      const priceCell = document.createElement('td');
      if (item.price) {
        priceCell.textContent = item.price.toFixed(2) + 'DA';
      } else {
        priceCell.textContent = 'N/A';
      }

      const quantityCell = document.createElement('td');
      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.value = item.quantity;
      quantityInput.addEventListener('input', () => {
        updateQuantity(item, quantityInput.value);
      });
      quantityCell.appendChild(quantityInput);

      const removeCell = document.createElement('td');
      const removeButton = document.createElement('button');

// Create the icon element
var icon = document.createElement('i');
icon.classList.add('fa-solid', 'fa-xmark'); // Assuming you have the FontAwesome classes defined

// Clear the existing content of the removeButton element
removeButton.innerHTML = '';

// Append the icon element to the removeButton
removeButton.appendChild(icon);

      removeButton.addEventListener('click', () => {
        removeProduct(item);
      });
      removeCell.appendChild(removeButton);

      tableRow.appendChild(imageCell);
      tableRow.appendChild(nameCell);
      tableRow.appendChild(priceCell);
      tableRow.appendChild(quantityCell);
      tableRow.appendChild(removeCell);

      cartTable.appendChild(tableRow);
    });
  } else {
    const emptyMessage = document.createElement('tr');
    const emptyCell = document.createElement('td');
    emptyCell.colSpan = 7;
    emptyCell.textContent = 'Your cart is empty.';
    emptyMessage.appendChild(emptyCell);
    cartTable.appendChild(emptyMessage);
  }
  updatePrices();
}

function addToCart() {
  const productId = document.querySelector('.product-id').getAttribute('data-id');
  const productImage = document.querySelector('.img-product').getAttribute('src');
  const productName = document.querySelector('.product-title').textContent;
  const price = parseFloat(document.querySelector('.price').textContent);
  const quantity = parseInt(document.getElementById('quantity').value);

  // Validate quantity
  if (quantity <= 0) {
    alert('Please enter a valid quantity.');
    return;
  }

  // Create a new product object
  const product = {
    id:productId,
    image: productImage,
    name: productName,
    price : price,
    quantity: quantity,
  };

  // Check if the product already exists in the cart
  const existingItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const foundItem = existingItems.find((item) => {
    return (
      item.name === product.name
    );
  });

  if (foundItem) {
    alert('This product is already in your cart.');
    return;
  }

  // Add the new product to the existing cart items
  existingItems.push(product);

  // Save the updated cart items to local storage
  localStorage.setItem('cartItems', JSON.stringify(existingItems));

  // Display success message
  alert('Product added to cart!');
  updatePrices();
}

// Function to remove a product from the cart
function removeProduct(item) {
  // Remove the item from the cart items array
  cartItems = cartItems.filter((cartItem) => cartItem.name !== item.name);

  // Save the updated cart items to local storage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  // Display success message
  alert('Product removed from cart!');
  updatePrices();
  displayCartItems();
}

// Function to update the quantity and recalculate prices
function updateQuantity(item, quantity) {
    // Validate quantity
    if (quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }
  
  // Update the quantity of the item in the cart items array
  cartItems.forEach((cartItem) => {
    if (
      cartItem.name === item.name 
    ) {
      cartItem.quantity = parseInt(quantity);
    }
  });

  // Save the updated cart items to local storage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  // Recalculate prices
  updatePrices();
}

function updatePrices() {
  const cartTable = document.getElementById('cartItems');
  const cartItems = cartTable.querySelectorAll('tr');

  let subtotal = 0;

  if (cartItems.length === 0) {
    document.getElementById('totalAmount').textContent = '0.00DA';
  } else {
    cartItems.forEach((item) => {
      const priceElement = item.querySelector('td:nth-child(3)');
      if (priceElement) {
        const priceString = priceElement.textContent;
        const price = parseFloat(priceString);
        const quantity = parseInt(item.querySelector('input[type="number"]').value);
        const itemTotal = price * quantity;
        subtotal += itemTotal;
      }
    });

    const total = subtotal; // Calculate the total based on the subtotal

    document.getElementById('totalAmount').textContent = total.toFixed(2) + 'DA';
  }
}

// Function to apply the coupon
function applyCoupon() {
  const couponCode = document.querySelector('.coupon-code').value;

  // Here you can implement your coupon logic
  // For simplicity, let's assume the coupon code "SAVE10" gives a 10% discount

  if (couponCode === 'SAVE10') {
    // Get the current total amount
    const totalElement = document.getElementById('totalAmount');
    const totalString = totalElement.textContent;
    const total = parseFloat(totalString);

    // Calculate the discount amount
    const discountAmount = total * 0.1; // 10% discount

    // Subtract the discount amount from the total
    const discountedTotal = total - discountAmount;

    // Update the total amount on the page
    totalElement.textContent = discountedTotal.toFixed(2) + 'DA';

    // Display a success message
    alert('Coupon applied successfully!');
  } else {
    // Display an error message for invalid coupon code
    alert('Invalid coupon code. Please try again.');
  }
}


// Display the cart items on page load
document.addEventListener('DOMContentLoaded', function () {
  displayCartItems();
});
