const mainImg = document.getElementById('mainImg');
const thumbs = document.querySelectorAll('.thumb');
const colors = document.querySelectorAll('.color');
const colorName = document.getElementById('colorName');
const qtyInput = document.getElementById('qty');
const increase = document.getElementById('increase');
const decrease = document.getElementById('decrease');
const addToCart = document.getElementById('addToCart');
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');

let cart = [];
const PRICE = 129;

// Image gallery
thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    mainImg.src = thumb.dataset.img;
  });
});

// Color variants
colors.forEach(color => {
  color.addEventListener('click', () => {
    colors.forEach(c => c.classList.remove('active'));
    color.classList.add('active');
    colorName.textContent = color.dataset.color;
  });
});

// Quantity selector
increase.addEventListener('click', () => {
  let val = parseInt(qtyInput.value);
  if (val < 10) qtyInput.value = val + 1;
});

decrease.addEventListener('click', () => {
  let val = parseInt(qtyInput.value);
  if (val > 1) qtyInput.value = val - 1;
});

// Cart sidebar toggle
function openCart() {
  cartSidebar.classList.add('active');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
  cartSidebar.classList.remove('active');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openCart();
});

closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

// Update cart UI
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  cartCount.textContent = totalItems;
  
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <span>Add some products to get started</span>
      </div>
    `;
    cartFooter.style.display = 'none';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.color} × ${item.qty}</p>
          <div class="cart-item-bottom">
            <span class="cart-item-price">$${item.price * item.qty}</span>
            <button class="remove-item" data-index="${index}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
    
    cartFooter.style.display = 'block';
    cartTotal.textContent = `$${totalPrice}`;
    
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        cart.splice(index, 1);
        updateCart();
      });
    });
  }
}

// Add to cart
addToCart.addEventListener('click', () => {
  const qty = parseInt(qtyInput.value);
  const color = document.querySelector('.color.active').dataset.color;
  const currentImg = document.querySelector('.thumb.active').dataset.img;
  
  const existingItem = cart.find(item => item.color === color);
  
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({
      name: 'Aura Buds Pro',
      color: color,
      qty: qty,
      price: PRICE,
      image: currentImg
    });
  }
  
  updateCart();
  openCart();
  
  addToCart.textContent = 'Added ✓';
  addToCart.style.background = '#1e8e3e';
  
  setTimeout(() => {
    addToCart.textContent = 'Add to Cart';
    addToCart.style.background = '';
  }, 1500);
});
const buyNow = document.getElementById('buyNow');

// Buy Now = Add to cart + skip to checkout
buyNow.addEventListener('click', () => {
  const qty = parseInt(qtyInput.value);
  const color = document.querySelector('.color.active').dataset.color;
  const currentImg = document.querySelector('.thumb.active').dataset.img;
  
  // Clear cart first so Buy Now = 1 item checkout
  cart = [];
  
  cart.push({
    name: 'Aura Buds Pro',
    color: color,
    qty: qty,
    price: PRICE,
    image: currentImg
  });
  
  updateCart();
  openCart();
  
  // Fake checkout redirect after 1 sec
  setTimeout(() => {
    alert('Redirecting to Stripe checkout... \nTotal: $' + (PRICE * qty));
    // In real client work you'd do: window.location.href = '/checkout'
  }, 800);
});

updateCart();