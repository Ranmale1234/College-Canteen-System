// Navigation Logic
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Update active nav
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    // Update active view
    const targetId = item.getAttribute('data-target');
    views.forEach(view => {
      view.classList.remove('active');
      if (view.id === targetId) {
        view.classList.add('active');
      }
    });
  });
});

// Dummy Data for Orders Table
const orders = [
  { id: '#ORD-1023', items: '2x Chicken Bowl, 1x Cola', time: '12:45 PM', status: 'Ready' },
  { id: '#ORD-1024', items: '1x Veggie Wrap, 1x Water', time: '12:48 PM', status: 'Preparing' },
  { id: '#ORD-1025', items: '3x Beef Burger, 3x Fries', time: '12:52 PM', status: 'Pending' },
  { id: '#ORD-1026', items: '1x Caesar Salad', time: '12:55 PM', status: 'Pending' },
  { id: '#ORD-1027', items: '2x Pasta Alfredo', time: '01:05 PM', status: 'Preparing' },
  { id: '#ORD-1028', items: '1x Margherita Pizza', time: '01:12 PM', status: 'Pending' },
];

const ordersTableBody = document.getElementById('ordersTableBody');
orders.forEach(order => {
  const tr = document.createElement('tr');
  
  const statusClass = order.status.toLowerCase();
  
  tr.innerHTML = `
    <td><strong>${order.id}</strong></td>
    <td>${order.items}</td>
    <td>${order.time}</td>
    <td><span class="status-badge ${statusClass}">${order.status}</span></td>
    <td><button class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">View</button></td>
  `;
  ordersTableBody.appendChild(tr);
});

// Dummy Data for Menu Grid
const menuItems = [
  { name: 'Classic Beef Burger', price: '$8.50', available: true, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { name: 'Chicken Teriyaki Bowl', price: '$10.00', available: true, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Vegan Salad Wrap', price: '$7.00', available: false, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
  { name: 'Margherita Pizza', price: '$12.00', available: true, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80' },
  { name: 'Iced Caramel Latte', price: '$4.50', available: true, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fudge Brownie', price: '$3.50', available: true, img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
];

const menuGrid = document.getElementById('menuGrid');
menuItems.forEach((item, index) => {
  const div = document.createElement('div');
  div.className = 'menu-card';
  
  div.innerHTML = `
    <img src="${item.img}" alt="${item.name}" class="menu-img">
    <div class="menu-info">
      <h3 class="menu-title">${item.name}</h3>
      <p class="menu-price">${item.price}</p>
      <div class="menu-footer">
        <div class="toggle-wrapper">
          <label class="toggle">
            <input type="checkbox" ${item.available ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
          <span class="status-text ${item.available ? 'text-success' : 'text-danger'}">${item.available ? 'Available' : 'Out of stock'}</span>
        </div>
      </div>
    </div>
  `;
  
  // Add listener for toggle to change text
  const checkbox = div.querySelector('input');
  const textSpan = div.querySelector('.status-text');
  checkbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      textSpan.textContent = 'Available';
      textSpan.style.color = 'var(--success-color)';
    } else {
      textSpan.textContent = 'Out of stock';
      textSpan.style.color = 'var(--text-secondary)';
    }
  });
  
  menuGrid.appendChild(div);
});

// Chart.js Implementations
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { 
        font: { family: "'Inter', sans-serif", size: 12 },
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleFont: { family: "'Inter', sans-serif", size: 13 },
      bodyFont: { family: "'Inter', sans-serif", size: 13 },
      padding: 12,
      cornerRadius: 8,
      displayColors: true
    }
  }
};

// 1. Daily Orders Chart (Dashboard)
const dailyOrdersCtx = document.getElementById('dailyOrdersChart').getContext('2d');
new Chart(dailyOrdersCtx, {
  type: 'line',
  data: {
    labels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'],
    datasets: [{
      label: 'Orders',
      data: [15, 25, 45, 120, 95, 30, 20, 10],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#3b82f6',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    ...commonOptions,
    plugins: { legend: { display: false }, tooltip: commonOptions.plugins.tooltip },
    scales: { 
      y: { 
        beginAtZero: true,
        grid: { borderDash: [4, 4], color: '#e2e8f0' },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        border: { display: false }
      }
    }
  }
});

// 2. Category Sales Chart (Dashboard)
const categorySalesCtx = document.getElementById('categorySalesChart').getContext('2d');
new Chart(categorySalesCtx, {
  type: 'doughnut',
  data: {
    labels: ['Main Course', 'Snacks', 'Beverages', 'Desserts'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  },
  options: {
    ...commonOptions,
    cutout: '75%',
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});

// 3. Revenue Trend Chart (Analytics)
const revenueTrendCtx = document.getElementById('revenueTrendChart').getContext('2d');
new Chart(revenueTrendCtx, {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue ($)',
      data: [2100, 2400, 2200, 2800, 3100, 1500, 1200],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#10b981',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    ...commonOptions,
    scales: { 
      y: { 
        beginAtZero: true,
        grid: { borderDash: [4, 4], color: '#e2e8f0' },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        border: { display: false }
      }
    }
  }
});

// 4. Peak Hours Chart (Analytics)
const peakHoursCtx = document.getElementById('peakHoursChart').getContext('2d');
new Chart(peakHoursCtx, {
  type: 'bar',
  data: {
    labels: ['9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4'],
    datasets: [{
      label: 'Average Orders',
      data: [20, 35, 60, 150, 110, 40, 25],
      backgroundColor: '#3b82f6',
      borderRadius: 6,
      barThickness: 24
    }]
  },
  options: {
    ...commonOptions,
    plugins: { legend: { display: false }, tooltip: commonOptions.plugins.tooltip },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { borderDash: [4, 4], color: '#e2e8f0' },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        border: { display: false }
      }
    }
  }
});

// 5. Top Items Chart (Analytics)
const topItemsCtx = document.getElementById('topItemsChart').getContext('2d');
new Chart(topItemsCtx, {
  type: 'bar',
  data: {
    labels: ['Chicken Bowl', 'Burger', 'Pizza', 'Latte', 'Wrap'],
    datasets: [{
      label: 'Units Sold',
      data: [320, 250, 180, 150, 120],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'],
      borderRadius: 6,
      barThickness: 20
    }]
  },
  options: {
    ...commonOptions,
    indexAxis: 'y',
    plugins: { legend: { display: false }, tooltip: commonOptions.plugins.tooltip },
    scales: {
      x: { 
        beginAtZero: true,
        grid: { borderDash: [4, 4], color: '#e2e8f0' },
        border: { display: false }
      },
      y: {
        grid: { display: false },
        border: { display: false }
      }
    }
  }
});
