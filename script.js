let quranData = { surahs: [] };

// تحميل بيانات القرآن
async function fetchQuranData() {
  const response = await fetch('quran_database.json');
  quranData = await response.json();
  displaySurahs(quranData.surahs);
  loadLastRead();
  loadSavedMode();
}

// عرض قائمة السور
function displaySurahs(surahs) {
  const surasList = document.getElementById('suras-list');
  surasList.innerHTML = '';
  surahs.forEach(surah => {
    const surahElement = document.createElement('a');
    surahElement.href = '#';
    surahElement.className = 'sura-item';
    surahElement.textContent = surah.surah_name;
    surahElement.onclick = () => displaySurahVerses(surah);
    surasList.appendChild(surahElement);
  });
}

// البحث في القرآن
function searchQuran() {
  const searchInput = document.querySelector('.search-input').value.trim();
  const filteredSurahs = quranData.surahs.filter(surah =>
    surah.surah_name.includes(searchInput)
  );

  displaySurahs(filteredSurahs);
}

// عرض آيات السورة
function displaySurahVerses(surah) {
  const surasList = document.getElementById('suras-list');
  surasList.innerHTML = '';

  const surahCard = document.createElement('div');
  surahCard.className = 'surah-card';
  surahCard.innerHTML = `<h3>${surah.surah_name}</h3>`;

  const versesText = surah.verses.map(verse => `(${verse.verse_number}) ${verse.text}`).join(' ');
  const versesElement = document.createElement('p');
  versesElement.className = 'surah-verses';
  versesElement.textContent = versesText;

  surahCard.appendChild(versesElement);
  surasList.appendChild(surahCard);

  // تحديث آخر ما تم قراءته
  updateLastRead(surah.surah_name, surah.verses[3].text);

  // حفظ الحالة في التاريخ للرجوع
  history.pushState({ type: 'surah', surah: surah.surah_name }, '', window.location.href);
}

// تحديث آخر سورة تم قراءتها وحفظها في localStorage
function updateLastRead(surahName, verseText) {
  const lastReadSurahElement = document.getElementById('last-read-surah-name');
  const lastReadVerseTextElement = document.getElementById('last-read-verse-text');
  lastReadSurahElement.textContent = `سورة: ${surahName}`;
  lastReadVerseTextElement.textContent = verseText;

  // حفظ في localStorage
  localStorage.setItem('lastReadSurah', surahName);
  localStorage.setItem('lastReadVerse', verseText);
}

// تحميل آخر ما تم قراءته من localStorage
function loadLastRead() {
  const lastReadSurah = localStorage.getItem('lastReadSurah');
  const lastReadVerse = localStorage.getItem('lastReadVerse');

  if (lastReadSurah && lastReadVerse) {
    const lastReadSurahElement = document.getElementById('last-read-surah-name');
    const lastReadVerseTextElement = document.getElementById('last-read-verse-text');
    lastReadSurahElement.textContent = `سورة: ${lastReadSurah}`;
    lastReadVerseTextElement.textContent = lastReadVerse;
  }
}

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

fetchQuranData();
