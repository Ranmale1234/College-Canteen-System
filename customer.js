// State
let currentUser = null;
let guestMode = false;
let cart = []; // Array of objects { id, qty }
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let pastOrders = JSON.parse(localStorage.getItem('pastOrders')) || [];

// Constants
let trackingInterval = null;
let orderCountdownTimer = null;

// DOM Elements
const welcomeModal = document.getElementById('welcomeModal');
const authModal = document.getElementById('authModal');
const checkoutModal = document.getElementById('checkoutModal');
const trackingModal = document.getElementById('trackingModal');
const closedOverlay = document.getElementById('closedOverlay'); // kept in DOM just in case

const loginFormContainer = document.getElementById('loginFormContainer');
const registerFormContainer = document.getElementById('registerFormContainer');
const toastMessage = document.getElementById('toastMessage');

const navLoginBtn = document.getElementById('navLoginBtn');
const navProfile = document.getElementById('navProfile');
const userNameDisplay = document.getElementById('userNameDisplay');
const userAvatar = document.getElementById('userAvatar');
const cartBadge = document.getElementById('cartBadge');
const mindHeading = document.getElementById('mindHeading');
const homeLogo = document.getElementById('homeLogo');

const mainContentView = document.getElementById('mainContentView');
const orderHistoryView = document.getElementById('orderHistoryView');
const searchInput = document.getElementById('searchInput');
const categoriesRow = document.getElementById('categoriesRow');
const customerMenuGrid = document.getElementById('customerMenuGrid');

const cartSidebar = document.getElementById('cartSidebar');
const cartSidebarOverlay = document.getElementById('cartSidebarOverlay');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');

// Authentic Indian College Menu with User Provided Images
const menuItems = [
  // Breakfast
  { id: 1, name: 'Samosa (2 pcs)', price: 30, desc: 'Crispy pastry filled with spiced potatoes.', img: 'https://images.openai.com/static-rsc-4/r4O6zSDp8VAMOMDi7eykckVc_gM5IqWwf5_mgAQLU1nsjLwCmF6DRyMfi3u6pUFlFHDxIBy9wg1OPW-osL_upO_dgSyjBF5DSh80Bq0pImDtsZYeVKAHiWENx67XyYQucpu5xR98JJ0IwfQUehGAZoKQmAWLl9Wy3KwdwzCJqr6vy7ACWJ7-_97_-Uvhdskl?purpose=fullsize', cat: 'Breakfast', stock: 50 },
  { id: 2, name: 'Idli Sambar', price: 40, desc: 'Steamed rice cakes with lentil soup.', img: 'https://images.openai.com/static-rsc-4/zprFSqZNZGbqeAVfTZr6tGTR-ZTYcfezYtn0QL6A8mXa6aYTgq_89tGZ5wkk4SGj-OK_Iso9UOnYh0GQsOA55Ii_MtjNQs01Uamsi_1fYuqwNSpNvcG8Lt12apDVEK-wT_JluHRA_Z7I0AIkB0pKvU-KLSS-NS3dOBwH3IgatIstqn45hXuNClQINKf6KvQT?purpose=fullsize', cat: 'Breakfast', stock: 30 },
  { id: 3, name: 'Vada Pav', price: 20, desc: 'Mumbai style spicy potato slider.', img: 'https://images.openai.com/static-rsc-4/OUB46Dfkx9dHRVWwmZDr9SRJnibWOw0qnCNbQFDAqvy4YK9b_3kO0sVWm78qlsGHOwpxCwGUuKmqSyqvOEUHJx_yqHaPhrqoT0O_rF25Pio0uk7U8BOdjtypCpqBECBv2KNKa4CBUcDEeX9oX8TZKiUR8zkWMcthtLJjpPbuTf6mzk8DU_eq7I-0G3sG0pLf?purpose=fullsize', cat: 'Breakfast', stock: 100 },
  { id: 4, name: 'Poha', price: 35, desc: 'Flattened rice cooked with onions and peanuts.', img: 'https://images.openai.com/static-rsc-4/-wJqTmnlI5kNpQbxnnElW5xFNNVUXTdytRIE-gen6uAsJ8Tlw9uvQiioeq8fqs7nA4z0rzGplqXLGFwmuAiIwUIlFi3-OZsmNV5h0pfJkYbXKsAjvG7Ruwf7FhECsGUv3ASuCa7ORrxMoRPHos1uk_hLq7W9b4H37txGDolPx6JnN77-dkf4QVn4G6d2zQ_o?purpose=fullsize', cat: 'Breakfast', stock: 0 },
  { id: 5, name: 'Upma', price: 35, desc: 'Savory semolina porridge.', img: 'https://images.openai.com/static-rsc-4/7bzCpiCZXzIjnt1UO5tILeGOac85xq5Tv9-gbhgmE8blVpCs27COjoBW2WZ_1kq91JCorI73liCfDledeW_wYD0LCbgRpp8f7NLjxuk7Q3aAaDKyo3nDIJQ7hHVv6CJQpqFmh65I2gA1iY7lh1OZsbZVZW29PeHa-iqBDDeXaUj54QlgrMFx7K12sTf8JSbh?purpose=fullsize', cat: 'Breakfast', stock: 20 },
  // Lunch
  { id: 6, name: 'Veg Thali', price: 80, desc: 'Complete meal with roti, rice, dal, and 2 sabzis.', img: 'https://images.openai.com/static-rsc-4/tR1Se9hz9PG2MkpqmCCgdAqbzsuSa-mWdmWOpgGnhX_jRebQTA9B0yon9ZJXy395PgpKpTPY0k71xT26ByGYtXh5TNupwgSvp9NmUA8wxfL7Hmfr4zk71tNdM95oD_exzGxHTD4eHPWKWC-tIi737pXo9sSp0hrlMoSav1ACUeaKQHzfJWOSaqE3l_NQRrH4?purpose=fullsize', cat: 'Lunch', stock: 40 },
  { id: 7, name: 'Fried Rice', price: 60, desc: 'Wok tossed veggie fried rice.', img: 'https://images.openai.com/static-rsc-4/MRr_en8Vi-dmtsGnfD3WMPBXjVrM5cUItfTa-YPHcEO7opCNfMrlykZm_Th-4o2qsUMjhGvHYpZE_j1pR9gA5p9hbrLGYFT9gzVvXTQdkAd0Gi8ZsvGmQ7FQpElj-plcsCfkgt4ef2eI5sStyLaiRl5C7LsT3qhcenih6sj1tnxa7j80spoz3tChLwtkZ0li?purpose=fullsize', cat: 'Lunch', stock: 50 },
  { id: 8, name: 'Dal Rice', price: 50, desc: 'Comforting yellow dal with steamed rice.', img: 'https://images.openai.com/static-rsc-4/Zksy9DukPm_AEB9rgAwJqiP1AlBRHsc6iZjGdrrbYpifszf10N80fQS7bYlLJ-eRSVlSsiN_ag_sfNS8nNBqNm7Q7xWUVER-CdkQta_kf4UyoQhBMSP6feO3dzZ1hCg_gmDlmEtNCmIC1Kb6so5au_NIqXf76WbmIcK1k1PHtjWXh_3UfmPxOduiDF4SBfKg?purpose=fullsize', cat: 'Lunch', stock: 100 },
  { id: 9, name: 'Paneer Sabzi + Roti', price: 90, desc: 'Rich paneer gravy with 3 rotis.', img: 'https://images.openai.com/static-rsc-4/Aw4LIaDAAY2DQB49W4GFueBgDfQrG13GD600z9jJTEqwf5XPTJVUkPm9q_rbvMyBflJwkyzoYjIATg2X_et6myrhQKXz5e70EISB825mQYAU_IbREXjrI4VMHWfuWke5_lNcwNFxH9OO6zFQgXsuntjYlZyVoxN5w21Pf6EooPOC1oWqBtVE5y09r1fS-O9Z?purpose=fullsize', cat: 'Lunch', stock: 30 },
  // Snacks
  { id: 10, name: 'Grilled Sandwich', price: 45, desc: 'Veggie loaded grilled sandwich.', img: 'https://images.openai.com/static-rsc-4/-n7S_r0YBKHuvvsv6w9cpl_M2LBkmu2SykFJMlu5aNGTUn_aSqOAruzCkzG2hGAyPFaW-qBYODlMoS0lJoOr1VczS73UIz7qrU8qnxQQLlUhxXEQJhNbWEKOqfEqAcz-e_reyTdwHaPysLJjYHPepS3as4DG5NX37h367qoKu7NrzaovaAyDA9csTHkOAOYz?purpose=fullsize', cat: 'Snacks', stock: 40 },
  { id: 11, name: 'Maggi', price: 30, desc: 'Classic 2-minute noodles.', img: 'https://images.openai.com/static-rsc-4/aeegr5Ktz48XV20F9hTW-I5Fgg8jRwGGuy9jIs6U1ncBYFUAWBJ4jfV0MMdw9TeadlyzRZRTE0B0a8p-TETgEaBstkLkQ8M5kHPtoqDVtBXbbgHHWWTZg3CTyU1zNl2WBdX-I6kdwNMGzRXxUzeord-npVTNud0f9-GCkT6xkVyuB7tBqnN-JUgswsAgnair?purpose=fullsize', cat: 'Snacks', stock: 150 },
  { id: 12, name: 'French Fries', price: 50, desc: 'Crispy salted fries.', img: 'https://images.openai.com/static-rsc-4/RhHXMWJRuZX8OnZjTvP28hY4zdO8LNGimtwOXFlG0FDA_YWByIwLuNywiu-qxOaZ30rj6PYK6Dns9sy09_f4lojb2fNPrkyetTm7B0h0_tgGGAvquFW6TjOxAlDsoR4K041Gkzt4Ua7gaKoLjgkmdMUmpMRXciYMGz9CnUn4XwOMe2ZIuRiO2iBEHJq4sPtC?purpose=fullsize', cat: 'Snacks', stock: 80 },
  // Drinks
  { id: 13, name: 'Sweet Lassi', price: 30, desc: 'Thick sweet yogurt drink.', img: 'https://images.openai.com/static-rsc-4/1qfw4hHJX4FVi6iIgvwww2qHfXgCIL7W2fujqr9uCTD_tVrt-bjPnbUQGS6RSk2NJH4gyYHCP3b2VdMoeVSvdh4SPE9LBHsMkUXH6xT6btVxwU1Kf_sFOVFGQ6EnyS_5MgksXQQlGSEwbl8q_SekQDefH-SPz5yT_C7gChGu2IrxpPuu3vNvaAVLy0tlzyco?purpose=fullsize', cat: 'Drinks', stock: 40 },
  { id: 14, name: 'Masala Chaas', price: 20, desc: 'Spiced buttermilk.', img: 'https://images.openai.com/static-rsc-4/5ihsmPY7of1wl8YX91imnDHfbLguiFjHK1IEoKZ_9lcGlud-pps1_DIYf1F7Ipmf9yx_l4ARZV1pRCkfETwS2RqMmCtRNFaAQWbTBpt21NOUsN-q-SPXaBcnZ8ahHL5gtjw1fYkUmm8nI78BmEYXTB-vP4RuoQrecIGQRDca1TsaUKKLEK2tL4qqM9iupih0?purpose=fullsize', cat: 'Drinks', stock: 50 },
  { id: 15, name: 'Cold Coffee', price: 45, desc: 'Chilled creamy coffee.', img: 'https://images.openai.com/static-rsc-4/V4uIThkNbv63Won0b6QZ-sNBaNtj8TCfFTdM3Ok7yvbhszpc3e6A-R5Sfzd37OiWTt6YLHWkeGMOz64VCwMouH1alsDpe2UnwpfwZbaV0HbKWLJ3p2_pe1GUg91ilVoJK7skmKp2vfIFIwZQCUSnafkCs36wPJJvuq1EDqwJoSxaipqozY4uH6IT_Ka7fKjD?purpose=fullsize', cat: 'Drinks', stock: 60 },
  { id: 16, name: 'Coca Cola', price: 20, desc: '250ml cold drink.', img: 'https://images.openai.com/static-rsc-4/A4WBbFKyxByE9VZ-Q6wJ_6rKfSRLzzqfloQ8uADLFsuDvr6caYoa0Xbq1rG4BqLtr6OBVaDIXvHjjndcBcz2sFF64Eza-L9LmAizsB4_5icfLLUfYXHZx-MaZd4AtecDXXh9V55OR-GymYudv4NfsjQp5itO7m4iyN1G2cOyKzlpbM7Hm-LAYNfk_J0otwEl?purpose=fullsize', cat: 'Drinks', stock: 100 },
  { id: 17, name: 'Water Bottle', price: 10, desc: '500ml mineral water.', img: 'https://images.openai.com/static-rsc-4/JEe5lVWBwDwy6GFOfD1Y50NhmXobgcS6OwJg2izkFM-tlso7z3eIFU0FVtcwtPkV0Vo4aKAwd-kcXPP1gH36gLzFZ_jbC24n4Jt67d7_t67mg1h7lNIgTW-JJSjFQCErZLOZwp15KNJ91RviCpWNL-nqIMxGpVagzaMb2fTq0vesDby_8lnQnsQUh78Kzns0?purpose=fullsize', cat: 'Drinks', stock: 200 }
];

// Init
function init() {
  const storedUser = localStorage.getItem('currentUser');
  const storedGuest = sessionStorage.getItem('guestMode');
  const storedCart = localStorage.getItem('cart');

  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    if(storedCart) cart = JSON.parse(storedCart);
    updateNavUI();
  } else if (storedGuest) {
    guestMode = true;
    updateNavUI();
  } else {
    showModal(welcomeModal);
  }

  renderMenu();
}

// Render Menu
function renderMenu(filterCat = 'All', searchQuery = '') {
  customerMenuGrid.innerHTML = '';

  let filtered = menuItems.filter(item => {
    const matchCat = filterCat === 'All' || item.cat === filterCat;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'food-card';
    const isFav = favorites.includes(item.id);
    const stockText = item.stock === 0 ? 'Out of stock' : 'Add';
    
    card.innerHTML = `
      <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(${item.id}, event)">♥</button>
      <img src="${item.img}" class="food-img" alt="${item.name}">
      <div class="food-info">
        <div class="food-header">
          <h3 class="food-title">${item.name}</h3>
          <span class="food-price">₹${item.price}</span>
        </div>
        <p class="food-desc">${item.desc}</p>
        <button class="add-btn" onclick="handleAddToCart(${item.id}, event)" ${item.stock === 0 ? 'disabled' : ''}>${stockText}</button>
      </div>
    `;
    customerMenuGrid.appendChild(card);
  });
}

// Logic
function updateNavUI() {
  if (currentUser) {
    navLoginBtn.style.display = 'none';
    navProfile.style.display = 'flex';
    
    const firstName = currentUser.name.split(' ')[0];
    userNameDisplay.textContent = firstName;
    
    // Dynamic Avatar matching Sonu Kumar -> SK
    userAvatar.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name) + '&background=0f172a&color=fff';
    
    // Set the cringe heading
    const headings = [
      `What's cookin' good lookin', ${firstName}? 😎`,
      `What are you craving today, ${firstName}? 🤤`,
      `Ready to eat, ${firstName}? 🍕`
    ];
    mindHeading.textContent = headings[Math.floor(Math.random() * headings.length)];

  } else {
    navLoginBtn.style.display = 'block';
    navProfile.style.display = 'none';
    mindHeading.textContent = "What's on your mind?";
  }
  updateCartBadge();
}

function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalItems;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

window.toggleFav = function(id, event) {
  event.stopPropagation();
  const idx = favorites.indexOf(id);
  if (idx > -1) {
    favorites.splice(idx, 1);
    event.target.classList.remove('active');
  } else {
    favorites.push(id);
    event.target.classList.add('active');
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

window.handleAddToCart = function(id, event) {
  if (!currentUser) {
    showToast("Login to continue ordering");
    showModal(authModal);
    return;
  }
  
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  
  saveCart();

  // Visual feedback
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = 'Added';
  btn.style.backgroundColor = '#ecfdf5';
  setTimeout(() => { btn.textContent = originalText; btn.style.backgroundColor = ''; }, 1000);
}

// Cart Sidebar Logic
function openCart() {
  if (!currentUser) {
    showToast("Login to view cart");
    showModal(authModal);
    return;
  }
  renderCart();
  cartSidebarOverlay.classList.add('active');
  cartSidebar.classList.add('active');
}

function closeCart() {
  cartSidebarOverlay.classList.remove('active');
  cartSidebar.classList.remove('active');
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-secondary text-center mt-4">Your cart is empty.</p>';
    cartTotalPrice.textContent = '₹0';
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;

  cart.forEach(cartItem => {
    const item = menuItems.find(m => m.id === cartItem.id);
    if(!item) return;
    
    total += item.price * cartItem.qty;
    
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">₹${item.price}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
          <span>${cartItem.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotalPrice.textContent = `₹${total}`;
  document.getElementById('checkoutAmount').textContent = `₹${total}`;
}

window.updateQty = function(id, delta) {
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += delta;
    if (existing.qty <= 0) {
      cart = cart.filter(c => c.id !== id);
    }
    saveCart();
  }
}

window.removeItem = function(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
}

// Checkout & Payment
document.getElementById('checkoutBtn').addEventListener('click', () => {
  closeCart();
  document.getElementById('checkoutStep1').style.display = 'block';
  document.getElementById('checkoutStep2').style.display = 'none';
  showModal(checkoutModal);
});

document.getElementById('proceedToPayBtn').addEventListener('click', () => {
  document.getElementById('checkoutStep1').style.display = 'none';
  document.getElementById('checkoutStep2').style.display = 'block';
});

document.getElementById('iHavePaidBtn').addEventListener('click', () => {
  // Place order
  const orderId = 'ORD' + Math.floor(Math.random() * 90000 + 10000);
  const newOrder = {
    id: orderId,
    items: [...cart],
    total: document.getElementById('checkoutAmount').textContent,
    date: new Date().toLocaleString()
  };
  pastOrders.unshift(newOrder);
  localStorage.setItem('pastOrders', JSON.stringify(pastOrders));
  
  // Clear cart
  cart = [];
  saveCart();
  
  hideModal(checkoutModal);
  startTracking(orderId);
});

// Order Tracking & Cutoff Timer
function startTracking(orderId) {
  document.getElementById('trackOrderId').textContent = '#' + orderId;
  
  // Reset timeline
  [1,2,3,4].forEach(i => document.getElementById(`step${i}`).classList.remove('active'));
  [1,2,3].forEach(i => document.getElementById(`line${i}`).classList.remove('active'));
  document.getElementById('step1').classList.add('active');
  document.getElementById('trackStatusText').textContent = "Your order has been placed!";
  
  showModal(trackingModal);
  showToast("Order placed successfully");

  let currentStep = 1;
  if(trackingInterval) clearInterval(trackingInterval);
  if(orderCountdownTimer) clearInterval(orderCountdownTimer);
  
  // Start 15 minute countdown timer for preparation
  let timeLeft = 900; 
  document.getElementById('orderCountdownTimer').textContent = "15:00";
  orderCountdownTimer = setInterval(() => {
      timeLeft--;
      if(timeLeft <= 0) {
          clearInterval(orderCountdownTimer);
          document.getElementById('orderCountdownTimer').textContent = "00:00";
      } else {
          const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
          const s = (timeLeft % 60).toString().padStart(2, '0');
          document.getElementById('orderCountdownTimer').textContent = `${m}:${s}`;
      }
  }, 1000);

  // Simulate order progression (every 5 seconds for demo)
  trackingInterval = setInterval(() => {
    currentStep++;
    if(currentStep === 2) {
      document.getElementById('line1').classList.add('active');
      document.getElementById('step2').classList.add('active');
      document.getElementById('trackStatusText').textContent = "Food is being prepared...";
      showToast("Preparing order");
    } else if(currentStep === 3) {
      document.getElementById('line2').classList.add('active');
      document.getElementById('step3').classList.add('active');
      document.getElementById('trackStatusText').textContent = "Your order is ready for pickup!";
      showToast("Ready for pickup");
    } else if(currentStep === 4) {
      document.getElementById('line3').classList.add('active');
      document.getElementById('step4').classList.add('active');
      document.getElementById('trackStatusText').textContent = "Order completed. Enjoy your meal!";
      showToast("Order completed");
      clearInterval(trackingInterval);
      clearInterval(orderCountdownTimer);
      document.getElementById('orderCountdownTimer').textContent = "00:00";
    }
  }, 5000);
}

// Order History
document.getElementById('viewOrdersBtn').addEventListener('click', (e) => {
  e.preventDefault();
  mainContentView.style.display = 'none';
  orderHistoryView.style.display = 'block';
  // close profile dropdown
  navProfile.classList.remove('open');
  renderOrderHistory();
});

document.getElementById('backToMenuBtn').addEventListener('click', () => {
  mainContentView.style.display = 'block';
  orderHistoryView.style.display = 'none';
});

// Home Logo Navigation
homeLogo.addEventListener('click', () => {
  mainContentView.style.display = 'block';
  orderHistoryView.style.display = 'none';
});

function renderOrderHistory() {
  const list = document.getElementById('orderHistoryList');
  list.innerHTML = '';
  if(pastOrders.length === 0) {
    list.innerHTML = '<p class="text-secondary">No past orders found.</p>';
    return;
  }
  
  pastOrders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'history-card';
    const itemNames = order.items.map(cartItem => {
      const menuItm = menuItems.find(m => m.id === cartItem.id);
      return menuItm ? `${cartItem.qty}x ${menuItm.name}` : '';
    }).join(', ');
    
    card.innerHTML = `
      <div class="history-info">
        <h3>Order #${order.id}</h3>
        <p>${order.date}</p>
        <p class="mt-2" style="color: var(--text-primary); font-weight: 500;">${itemNames}</p>
        <p class="mt-2 text-primary font-weight-bold">Total: ${order.total}</p>
      </div>
      <button class="btn btn-outline" onclick='reorder(${JSON.stringify(order.items)})'>Reorder</button>
    `;
    list.appendChild(card);
  });
}

window.reorder = function(items) {
  cart = [...items];
  saveCart();
  showToast("Items added to cart");
  openCart();
}

// Utilities
function showToast(msg) {
  toastMessage.textContent = msg;
  toastMessage.classList.add('show');
  setTimeout(() => toastMessage.classList.remove('show'), 3000);
}

function showModal(el) {
  el.style.display = 'flex';
  setTimeout(() => el.classList.add('active'), 10);
}

function hideModal(el) {
  el.classList.remove('active');
  setTimeout(() => el.style.display = 'none', 300);
}

// Event Listeners (UI / Filtering / Modals)
categoriesRow.addEventListener('click', (e) => {
  if(e.target.classList.contains('category-item')) {
    document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
    e.target.classList.add('active');
    renderMenu(e.target.getAttribute('data-cat'), searchInput.value);
  }
});

searchInput.addEventListener('input', (e) => {
  const activeCat = document.querySelector('.category-item.active').getAttribute('data-cat');
  renderMenu(activeCat, e.target.value);
});

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCartBtn').addEventListener('click', closeCart);
cartSidebarOverlay.addEventListener('click', closeCart);

// Profile Dropdown Click handling
navProfile.addEventListener('click', function(e) {
  // Prevent event from bubbling so document click doesn't close it immediately
  e.stopPropagation();
  this.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if(!e.target.closest('#navProfile')) {
    navProfile.classList.remove('open');
  }
});

// Auth Modals
document.getElementById('welcomeLoginBtn').addEventListener('click', () => {
  hideModal(welcomeModal);
  showModal(authModal);
});
document.getElementById('continueGuestBtn').addEventListener('click', () => {
  guestMode = true;
  sessionStorage.setItem('guestMode', 'true');
  hideModal(welcomeModal);
  updateNavUI();
});
document.getElementById('closeAuthModal').addEventListener('click', () => hideModal(authModal));
document.getElementById('closeCheckoutModal').addEventListener('click', () => hideModal(checkoutModal));
document.getElementById('closeTrackingModal').addEventListener('click', () => hideModal(trackingModal));

navLoginBtn.addEventListener('click', () => showModal(authModal));

document.getElementById('showRegisterLink').addEventListener('click', (e) => {
  e.preventDefault();
  loginFormContainer.style.display = 'none';
  registerFormContainer.style.display = 'block';
});
document.getElementById('showLoginLink').addEventListener('click', (e) => {
  e.preventDefault();
  registerFormContainer.style.display = 'none';
  loginFormContainer.style.display = 'block';
});

// Auth Submit
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const rawName = document.getElementById('loginName').value || 'User';
  const emailOrRoll = document.getElementById('loginEmail').value;
  currentUser = { name: rawName, email: emailOrRoll };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  hideModal(authModal);
  updateNavUI();
  showToast("Logged in successfully");
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const emailOrRoll = document.getElementById('regEmail').value;
  currentUser = { name: name, email: emailOrRoll };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  hideModal(authModal);
  updateNavUI();
  showToast("Account created successfully");
});

document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  currentUser = null;
  localStorage.removeItem('currentUser');
  guestMode = true;
  sessionStorage.setItem('guestMode', 'true');
  cart = [];
  saveCart();
  updateNavUI();
  mainContentView.style.display = 'block';
  orderHistoryView.style.display = 'none';
  navProfile.classList.remove('open');
  showToast("Logged out");
});

// Start
init();
