// فتح رابط خارجي
function openLink(url) {
  window.location.href = url;
}

// تفعيل القائمة الجانبية
function toggleMenu() {
  const sideMenu = document.getElementById('sideMenu');
  sideMenu.classList.toggle('open');
}

// التبديل إلى الوضع الداكن
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  document.body.classList.remove('eye-comfort-mode');
  saveMode('dark-mode');
}

// تفعيل وضع راحة العين
function eyeComfortMode() {
  document.body.classList.toggle('eye-comfort-mode');
  document.body.classList.remove('dark-mode');
  saveMode('eye-comfort-mode');
}

// العودة إلى الوضع الطبيعي (إزالة كل الأوضاع)
function resetToNormal() {
  document.body.classList.remove('dark-mode', 'eye-comfort-mode');
  saveMode('normal');
}

// حفظ الوضع المختار في localStorage
function saveMode(mode) {
  localStorage.setItem('selectedMode', mode);
}

// تحميل الوضع المحفوظ من localStorage
function loadSavedMode() {
  const savedMode = localStorage.getItem('selectedMode');
  if (savedMode) {
    switch (savedMode) {
      case 'dark-mode':
        document.body.classList.add('dark-mode');
        break;
      case 'eye-comfort-mode':
        document.body.classList.add('eye-comfort-mode');
        break;
        // 'normal' doesn't need any action as it's the default
    }
  }
}

// إغلاق القائمة الجانبية عند النقر في أي مكان آخر
document.addEventListener('click', function(event) {
  const sideMenu = document.getElementById('sideMenu');
  const menuButton = document.querySelector('.menu-button');

  if (!sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
    sideMenu.classList.remove('open');
  }
});

function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = event.currentTarget.querySelector('.dropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', function() {
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(function(dropdown) {
    dropdown.style.display = 'none';
  });
});

// Load and display the names
async function loadNames() {
  try {
    const response = await fetch('namesdb.json');
    const data = await response.json();
    return data.names;

  } catch (error) {
    console.error('Error loading names:', error);
    return [];
  }
}

function createCard(name) {
  return `
                <div class="card" data-id="${name.id}">
                    <div class="id">${name.id}</div>
                    <div class="arabic">${name.arabic}</div>
                    <div class="transliteration">${name.transliteration}</div>
                    <div class="meaning">${name.meaning}</div>
                    <div class="explanation">${name.explanation}</div>
                </div>
            `;
}

function displayNames(names, searchTerm = '') {
  const grid = document.getElementById('namesGrid');
  const filteredNames = names.filter(name => {
    const searchString = `${name.transliteration} ${name.meaning} ${name.explanation}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  if (filteredNames.length === 0) {
    grid.innerHTML = '<div class="no-results">No names found matching your search.</div>';
    return;
  }

  grid.innerHTML = filteredNames.map(createCard).join('');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
  const names = await loadNames();
  const searchInput = document.querySelector('.search-input');

  // Initial display
  displayNames(names);

  // Search functionality
  let debounceTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      displayNames(names, e.target.value);
    }, 300);
  });

  // Add card click animation
  document.getElementById('namesGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) {
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 100);
    }
  });
});

// Add smooth scrolling
document.addEventListener('scroll', () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }
  });
});
