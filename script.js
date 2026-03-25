/* ═══════════════════════════════════════════════════
   SMART RECIPE FINDER — ENHANCED PAN-INDIA VERSION
   - Authentic Recipes from All Indian States
   - Real-time API Integration (TheMealDB)
   - Interactive Cooking & Calorie Tracker
═══════════════════════════════════════════════════ */

// ── STATE ──
let favorites   = JSON.parse(localStorage.getItem('srFavorites') || '[]');
let calorieGoal = parseInt(localStorage.getItem('srGoal') || '2000');
let dailyIntake = JSON.parse(localStorage.getItem('srIntake') || '[]');
let currentRecipeSteps = [];
let currentStepIndex = 0;

// ── LOCAL INDIAN RECIPE DATABASE (Pan-India Diversity) ──
const LOCAL_INDIAN_RECIPES = [
  // SOUTH
  { id: 'tn_1', title: 'Tamil Nadu Sambar', youtube: '2qO4Q-v3-e0', source: 'local', area: 'Indian', state: 'Tamil Nadu', cal: 180, image: 'https://images.unsplash.com/photo-1601050690597-df056fb60795?w=500', cat: 'Breakfast/Side', instructions: '1. Cook toor dal. 2. Sauté spices, tamarind, and veggies. 3. Simmer together.', ingredients: ['Toor Dal', 'Drumsticks', 'Sambar Powder', 'Tamarind'] },
  { id: 'ka_1', title: 'Mysore Masala Dosa', youtube: 'iG_57V_uO80', source: 'local', area: 'Indian', state: 'Karnataka', cal: 320, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500', cat: 'Breakfast', instructions: '1. Spread batter. 2. Apply spicy red chutney. 3. Add potato masala. 4. Fold.', ingredients: ['Rice Batter', 'Red Chutney', 'Potato Masala', 'Ghee'] },
  { id: 'ka_2', title: 'Rava Idly', youtube: 'B_6vHh6G1L8', source: 'local', area: 'Indian', state: 'Karnataka', cal: 110, image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Idli_Sambar.JPG', cat: 'Breakfast', instructions: '1. Roast rava. 2. Mix with curds & ginger. 3. Steam for 10 mins.', ingredients: ['Rava', 'Curd', 'Baking Soda', 'Ginger'] },
  { id: 'tg_1', title: 'Hyderabadi Dum Biryani', youtube: 'v7STPey30U', source: 'local', area: 'Indian', state: 'Telangana', cal: 550, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500', cat: 'Main Course', instructions: '1. Marinate chicken. 2. Half-cook rice. 3. Layer and cook on low heat (Dum).', ingredients: ['Chicken', 'Basmati Rice', 'Saffron', 'Biryani Spices'] },
  { id: 'kl_1', title: 'Kerala Fish Curry', youtube: '9eIOn6Z5pY8', source: 'local', area: 'Indian', state: 'Kerala', cal: 280, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=500', cat: 'Main Course', instructions: '1. Soak Kudampuli. 2. Cook fish in coconut milk and spices. 3. Add curry leaves.', ingredients: ['Fish', 'Coconut Milk', 'Kudampuli', 'Chilli Powder'] },
  // NORTH
  { id: 'pb_1', title: 'Paneer Butter Masala', youtube: '9K6xXv-W_R8', source: 'local', area: 'Indian', state: 'Punjab', cal: 420, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500', cat: 'Main Course', instructions: '1. Sauté onions and tomatoes. 2. Blend to paste. 3. Cook paneer in butter and cream.', ingredients: ['Paneer', 'Butter', 'Cream', 'Cashew Paste'] },
  { id: 'dl_1', title: 'Punjab Chole Bhature', youtube: 'yQWntidL-Uo', source: 'local', area: 'Indian', state: 'Delhi', cal: 580, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chole_Bhature_at_New_Delhi.jpg/500px-Chole_Bhature_at_New_Delhi.jpg', cat: 'Main Course', instructions: '1. Cook chickpeas with tea bag. 2. Make spicy masala. 3. Fry bhature until puffed.', ingredients: ['Chickpeas', 'Flour', 'Yogurt', 'Chole Masala'] },
  { id: 'jk_1', title: 'Kashmiri Dum Aloo', youtube: 'n2uH-IuWp6Y', source: 'local', area: 'Indian', state: 'Kashmir', cal: 310, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Dum_Aloo.jpg/500px-Dum_Aloo.jpg', cat: 'Main Course', instructions: '1. Deep fry potatoes. 2. Cook in yogurt-based fennel-and-ginger gravy.', ingredients: ['Potatoes', 'Yogurt', 'Fennel Powder', 'Ginger Powder'] },
  // WEST
  { id: 'mh_1', title: 'Mumbai Pav Bhaji', youtube: '6OqjFwT168Y', source: 'local', area: 'Indian', state: 'Maharashtra', cal: 450, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Pav_Bhaji.jpg/500px-Pav_Bhaji.jpg', cat: 'Snack', instructions: '1. Mash boiled veggies. 2. Add butter & pav bhaji masala. 3. Sauté on tawa.', ingredients: ['Potatoes', 'Peas', 'Butter', 'Pav Bhaji Masala'] },
  { id: 'gj_1', title: 'Gujarati Khaman Dhokla', youtube: 'G2w-fVl8Z7c', source: 'local', area: 'Indian', state: 'Gujarat', cal: 160, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Khaman_Dhokla.jpg/500px-Khaman_Dhokla.jpg', cat: 'Snack/Breakfast', instructions: '1. Make gram flour batter. 2. Steam for 15 mins. 3. Add curry leaves temper.', ingredients: ['Gram Flour', 'Citric Acid', 'Curry Leaves', 'Mustard Seeds'] },
  // EAST
  { id: 'wb_1', title: 'Bengali Macher Jhol', youtube: 'S-vly96R-C4', source: 'local', area: 'Indian', state: 'West Bengal', cal: 240, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Shorshe_Ilish_or_Ilish_macher_jhol.jpg/500px-Shorshe_Ilish_or_Ilish_macher_jhol.jpg', cat: 'Main Course', instructions: '1. Marinate fish with turmeric. 2. Fry fish. 3. Cook in mustard oil with panch phoron.', ingredients: ['Fish', 'Mustard Oil', 'Panch Phoron', 'Potato'] },
  { id: 'br_1', title: 'Bihari Litti Chokha', youtube: 'q7XzC-l5-r8', source: 'local', area: 'Indian', state: 'Bihar', cal: 380, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Litti_Chokha_of_Bihar.jpg/500px-Litti_Chokha_of_Bihar.jpg', cat: 'Main Course', instructions: '1. Stuff wheat balls with roasted sattu. 2. Roast. 3. Serve with mashed potato/brinjal.', ingredients: ['Wheat Flour', 'Sattu', 'Mustard Oil', 'Ajwain'] }
];

const FALLBACK = [ ...LOCAL_INDIAN_RECIPES.slice(0, 4) ];

// ── SPLASH ──
(function initSplash() {
  const splash = document.getElementById('splash'), w1 = document.getElementById('splashWord1'), w2 = document.getElementById('splashWord2');
  const quote = document.getElementById('splashQuote'), line = document.getElementById('splashLine'), btn = document.getElementById('splashEnter'), dots = document.getElementById('splashDots');
  if (!splash) return;
  for (let i = 0; i < 20; i++) {
    const d = document.createElement('div'); d.className = 'sdot';
    d.style.cssText = `left:${Math.random()*100}%;width:${Math.random()*4}px;height:${Math.random()*4}px;animation-duration:${Math.random()*6+4}s;animation-delay:${Math.random()*3}s;background:rgba(124,106,255,.4);`;
    dots.appendChild(d);
  }
  const build = (el, txt, grad, delay) => {
    txt.split('').forEach((c, i) => {
      const s = document.createElement('span'); s.className = 'sp-letter' + (grad ? ' grad' : ''); s.textContent = c;
      setTimeout(() => s.style.animation = 'letterIn .45s forwards', delay + i*80);
      el.appendChild(s);
    });
  };
  build(w1, 'Smart', false, 500); build(w2, 'Recipe', true, 1100);
  setTimeout(() => quote.classList.add('show'), 1800); setTimeout(() => line.classList.add('show'), 2100); setTimeout(() => btn.classList.add('show'), 2400);
  btn.onclick = () => { splash.classList.add('hide'); setTimeout(() => { splash.style.display='none'; }, 1050); };
})();

// ── THEME ──
const applyTheme = () => {
  const t = localStorage.getItem('srTheme') || 'dark'; document.documentElement.setAttribute('data-theme', t);
  const b = document.getElementById('themeBtn'); if (b) b.textContent = t === 'dark' ? '☀️ Theme' : '🌙 Theme';
};
applyTheme();
document.getElementById('themeBtn').onclick = () => {
  const c = document.documentElement.getAttribute('data-theme'); localStorage.setItem('srTheme', c==='dark'?'light':'dark'); applyTheme();
};

// ── UTILS ──
const estimateCal = (m) => {
  const c = (m.strCategory || '').toLowerCase();
  if (c.includes('beef') || c.includes('lamb')) return 520;
  if (c.includes('chicken') || c.includes('poultry')) return 380;
  if (c.includes('dessert')) return 450;
  return 300;
};
const parseMeals = (ms) => (ms || []).map(m => ({ id: m.idMeal, title: m.strMeal, image: m.strMealThumb, cat: m.strCategory || 'Recipe', area: m.strArea || '', cal: estimateCal(m), state: '' }));

// ── SEARCH LOGIC ──
const MEALDB = 'https://www.themealdb.com/api/json/v1/1';
async function searchMeals(query, mealType = '') {
  const lower = query.toLowerCase();
  let local = LOCAL_INDIAN_RECIPES.filter(r => 
    r.title.toLowerCase().includes(lower) || 
    r.ingredients.some(i => i.toLowerCase().includes(lower)) ||
    (r.state && r.state.toLowerCase().includes(lower))
  );

  try {
    const res = await fetch(`${MEALDB}/search.php?s=${encodeURIComponent(query)}`);
    const data = await res.json();
    let meals = data.meals || [];

    if (meals.length === 0) {
      const iRes = await fetch(`${MEALDB}/filter.php?i=${encodeURIComponent(query)}`);
      const iData = await iRes.json();
      if (iData.meals) {
        const det = await Promise.all(iData.meals.slice(0, 8).map(m => fetch(`${MEALDB}/lookup.php?i=${m.idMeal}`).then(r => r.json())));
        meals = det.flatMap(d => d.meals || []);
      }
    }

    let combined = [...local, ...parseMeals(meals)];
    if (mealType) {
        const mt = mealType.toLowerCase();
        combined = combined.filter(r => {
            const c = r.cat.toLowerCase();
            if (mt === 'breakfast') return c.includes('breakfast');
            if (mt === 'lunch' || mt === 'dinner') return !c.includes('breakfast') && !c.includes('dessert');
            if (mt === 'dessert') return c.includes('dessert');
            return true;
        });
    }
    combined.sort((a,b) => (b.area === 'Indian' || b.state ? 1 : 0) - (a.area === 'Indian' || a.state ? 1 : 0));
    return combined;
  } catch(e) { return local.length ? local : FALLBACK; }
}

async function filterByCategory(cat) {
  try {
    const res = await fetch(`${MEALDB}/filter.php?c=${encodeURIComponent(cat)}`);
    const data = await res.json();
    if (!data.meals) return [];
    const details = await Promise.all(data.meals.slice(0, 8).map(m => fetch(`${MEALDB}/lookup.php?i=${m.idMeal}`).then(r=>r.json())));
    return parseMeals(details.flatMap(d => d.meals || []));
  } catch(e) { return []; }
}

async function filterByArea(area) {
  try {
    const res = await fetch(`${MEALDB}/filter.php?a=${encodeURIComponent(area)}`);
    const data = await res.json();
    if (!data.meals) return [];
    const details = await Promise.all(data.meals.slice(0, 10).map(m => fetch(`${MEALDB}/lookup.php?i=${m.idMeal}`).then(r=>r.json())));
    return parseMeals(details.flatMap(d => d.meals || []));
  } catch(e) { return []; }
}

const renderGrid = (data, tid) => {
  const g = document.getElementById(tid); if (!g) return;
  if (!data?.length) { g.innerHTML = '<p class="grid-msg">No recipes found.</p>'; return; }
  g.innerHTML = data.map((m, i) => {
    const isFav = favorites.some(f => f.id === m.id);
    return `
      <article class="r-card" style="animation-delay:${i * 0.05}s">
        <div class="r-img-wrap">
          <img class="r-img" src="${m.image}" alt="${m.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400?text=Recipe'">
          <button class="r-fav-btn ${isFav?'fav':''}" onclick="toggleFav(event,'${m.id}')">${isFav?'❤️':'🤍'}</button>
          <span class="r-cal">${m.cal} kcal</span>
        </div>
        <div class="r-body">
          ${m.state ? `<span class="r-state">${m.state}</span>` : ''}
          <h4 class="r-title">${m.title}</h4>
          <div class="r-btns">
            <button class="r-view-btn" onclick="openModal('${m.id}')">📋 View</button>
            <button class="r-log-btn" onclick="logCalories(${m.cal}, '${m.title.replace(/'/g,"\\'")}')">+ Log</button>
          </div>
        </div>
      </article>`;
  }).join('');
  data.forEach(m => { window._recipeCache = window._recipeCache || {}; window._recipeCache[m.id] = m; });
};

async function doSearch(query, mealType = '', noScroll = false) {
  const g = document.getElementById('recipeGrid'); if (!g) return;
  g.innerHTML = `<div class="loader-box"><div class="spin"></div><p>Finding Indian Staples...</p></div>`;
  if (!noScroll) document.getElementById('results-sec')?.scrollIntoView({ behavior: 'smooth' });
  const data = await searchMeals(query || 'Indian', mealType);
  renderGrid(data, 'recipeGrid');
}

// ── EVENT LISTENERS ──
document.getElementById('searchBtn').onclick = () => {
    const q = document.getElementById('searchInput').value;
    const m = document.getElementById('mealSel').value;
    doSearch(q, m);
};
document.getElementById('searchInput').onkeydown = e => { if (e.key==='Enter') document.getElementById('searchBtn').click(); };

const CUISINE_MAP = { indian: 'Indian', italian: 'Pasta', mexican: 'Mexican', japanese: 'Japanese', chinese: 'Chinese', thai: 'Thai', mediterranean: 'Seafood', american: 'Beef' };
document.querySelectorAll('.cuis-card').forEach(c => c.onclick = async () => {
    const cat = CUISINE_MAP[c.dataset.c] || c.dataset.c;
    document.getElementById('results-sec')?.scrollIntoView({ behavior: 'smooth' });
    renderGrid(await filterByCategory(cat), 'recipeGrid');
});

document.querySelectorAll('.d-tab').forEach(t => t.onclick = async () => {
    document.querySelectorAll('.d-tab').forEach(b => b.classList.remove('active'));
    t.classList.add('active');
    const data = await searchMeals(t.dataset.query);
    renderGrid(data.slice(0, 4), 'dietGrid');
});

// ── MODAL ──
const openModal = async (id) => {
  const bg = document.getElementById('modalBg'), sc = document.getElementById('modalScroll');
  bg.classList.add('open'); document.body.style.overflow = 'hidden';
  sc.innerHTML = '<div class="m-load"><div class="spin"></div></div>';
  try {
    let title, thumb, ings = [], steps = [], cal = 300, ytId = null, local = LOCAL_INDIAN_RECIPES.find(r => r.id === id);
    if (local) {
      title = local.title; thumb = local.image; ings = local.ingredients; cal = local.cal;
      steps = local.instructions.split('. ').map(s => s.trim()).filter(s => s);
      ytId = local.youtube || null;
    } else {
      const res = await fetch(`${MEALDB}/lookup.php?i=${id}`), data = await res.json(), m = data.meals[0];
      title = m.strMeal; thumb = m.strMealThumb; cal = estimateCal(m);
      for (let i = 1; i <= 20; i++) if (m[`strIngredient${i}`]?.trim()) ings.push(`${m[`strMeasure${i}`]||''} ${m[`strIngredient${i}`]}`);
      steps = (m.strInstructions || '').split(/\r\n|\n/).filter(s => s.length > 5);
      ytId = m.strYoutube ? m.strYoutube.split('v=')[1] : null;
    }
    sc.innerHTML = `
      <img class="modal-hero" src="${thumb}">
      <div class="modal-content">
        <h2 class="modal-title">${title}</h2>
        <div class="modal-2col">
          <div><h3 class="m-sec-title">🧂 Ingredients</h3><ul class="ing-list">${ings.map(i=>`<li>${i}</li>`).join('')}</ul></div>
          <div><h3 class="m-sec-title">👨🍳 Instructions</h3><div class="steps-list">${steps.map((s,i)=>`<div class="step-row"><div class="snum">${i+1}</div><p class="stxt">${s}</p></div>`).join('')}</div></div>
        </div>
        <div class="modal-acts">
          <button class="m-cook-btn" onclick="startCooking('${title.replace(/'/g,"\\'")}', ${JSON.stringify(steps).replace(/"/g, '&quot;')})">👨🍳 Cooking Mode</button>
          ${ytId ? `<a href="https://www.youtube.com/watch?v=${ytId}" target="_blank" class="m-yt-btn">▶️ YouTube</a>` : ''}
          <button class="m-log-btn" onclick="logCalories(${cal},'${title.replace(/'/g,"\\'")}')">🔥 Log ${cal} kcal</button>
        </div>
      </div>`;
  } catch(e) { sc.innerHTML = '<p>Recipe Error.</p>'; }
};

const closeModal = () => { document.getElementById('modalBg').classList.remove('open'); document.body.style.overflow = ''; };
document.getElementById('modalClose').onclick = closeModal;

// ── COOKING MODE ──
const startCooking = (n, s) => { currentRecipeSteps = s; currentStepIndex = 0; renderStep(n); };
const renderStep = (n) => {
  const sc = document.getElementById('modalScroll'), step = currentRecipeSteps[currentStepIndex], prog = ((currentStepIndex+1)/currentRecipeSteps.length)*100;
  sc.innerHTML = `<div class="cooking-mode">
    <div class="cook-header"><span onclick="openModal(null)">← Back</span><span>${n}</span><span>${currentStepIndex+1}/${currentRecipeSteps.length}</span></div>
    <div class="cook-progress"><div class="cook-progress-fill" style="width:${prog}%"></div></div>
    <div class="step-card"><div class="step-number">${currentStepIndex+1}</div><div class="step-desc">${step}</div></div>
    <div class="cook-nav">
      <button class="c-nav-btn" onclick="moveStep(-1,'${n.replace(/'/g,"\\'")}')" ${currentStepIndex===0?'disabled':''}>Prev</button>
      ${currentStepIndex===currentRecipeSteps.length-1?`<button class="c-nav-btn c-done" onclick="completeCook()">Finish!</button>`:`<button class="c-nav-btn" onclick="moveStep(1,'${n.replace(/'/g,"\\'")}')">Next</button>`}
    </div>
  </div>`;
};
const moveStep = (d, n) => { currentStepIndex += d; renderStep(n); };
const completeCook = () => { 
    closeModal(); 
    showToast("Masterpiece Created! 🥘✨", "ok");
    
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#7C6AFF', '#00D4FF'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#7C6AFF', '#00D4FF'] });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
};

// ── TRACKER ──
const updateTrackerUI = () => {
    const total = dailyIntake.reduce((s,i)=>s+i.calories, 0);
    const pct = Math.min((total/calorieGoal)*100, 100);
    const rv = document.getElementById('ringVal'); if (rv) rv.textContent = total;
    const pv = document.getElementById('progVals'); if (pv) pv.textContent = `${total} / ${calorieGoal} kcal`;
    const rf = document.getElementById('ringFill'); if (rf) rf.style.strokeDashoffset = 427 - (427 * pct / 100);
    const pf = document.getElementById('progFill'); if (pf) pf.style.width = pct + '%';
    const pp = document.getElementById('progPct'); if (pp) pp.textContent = Math.round(pct) + '%';
    const list = document.getElementById('logList');
    if (list) list.innerHTML = dailyIntake.length ? dailyIntake.map((it, i) => `<div class="log-item"><div>${it.name}</div><span>${it.calories} kcal</span><button onclick="delLog(${i})">✕</button></div>`).join('') : '<p>No entries today.</p>';
    
    // Macros approximation
    const p = Math.round(total * 0.035), c = Math.round(total * 0.12), f = Math.round(total * 0.045);
    const ep = Math.round(calorieGoal * 0.035), ec = Math.round(calorieGoal * 0.12), ef = Math.round(calorieGoal * 0.045);
    document.getElementById('macP').textContent = p+'g'; document.getElementById('macPB').style.width = Math.min((p/ep)*100, 100)+'%';
    document.getElementById('macC').textContent = c+'g'; document.getElementById('macCB').style.width = Math.min((c/ec)*100, 100)+'%';
    document.getElementById('macF').textContent = f+'g'; document.getElementById('macFB').style.width = Math.min((f/ef)*100, 100)+'%';
};
const logCalories = (c, n) => { dailyIntake.push({ name: n, calories: c }); localStorage.setItem('srIntake', JSON.stringify(dailyIntake)); updateTrackerUI(); showToast("Logged!", "ok"); };
const delLog = (i) => { dailyIntake.splice(i, 1); localStorage.setItem('srIntake', JSON.stringify(dailyIntake)); updateTrackerUI(); };

document.getElementById('favBtn').onclick = () => document.getElementById('fav-sec')?.scrollIntoView({ behavior: 'smooth' });
document.getElementById('trackerBtn').onclick = () => document.getElementById('tracker').classList.add('open');
document.getElementById('trackerClose').onclick = () => document.getElementById('tracker').classList.remove('open');
document.getElementById('setGoalBtn').onclick = () => { calorieGoal = parseInt(document.getElementById('goalInp').value) || 2000; localStorage.setItem('srGoal', calorieGoal); updateTrackerUI(); showToast("Goal Updated", "ok"); };
document.getElementById('resetBtn').onclick = () => { dailyIntake = []; localStorage.setItem('srIntake', '[]'); updateTrackerUI(); showToast("Reset!", "info"); };

document.getElementById('manualAddBtn').onclick = () => {
    const val = parseInt(document.getElementById('manualInp').value);
    if (!isNaN(val) && val > 0) {
        logCalories(val, 'Manual Entry');
        document.getElementById('manualInp').value = '';
    }
};

const fab = document.getElementById('fab'); if (fab) fab.onclick = () => { document.getElementById('tracker').classList.add('open'); document.getElementById('manualInp').focus(); };

document.getElementById('suggestBtn').onclick = async () => {
    const total = dailyIntake.reduce((s,i)=>s+i.calories, 0);
    const rem = calorieGoal - total;
    let query = rem < 400 ? 'salad' : rem < 800 ? 'chicken' : 'Indian';
    document.getElementById('tracker').classList.remove('open');
    document.getElementById('results-sec')?.scrollIntoView({ behavior: 'smooth' });
    const g = document.getElementById('recipeGrid'); if (g) g.innerHTML = `<div class="loader-box"><div class="spin"></div><p>Finding meals under ${rem} kcal...</p></div>`;
    const data = await searchMeals(query);
    renderGrid(data.filter(r => r.cal <= (rem > 0 ? rem + 100 : 9999)), 'recipeGrid');
};

// ── OTHER ──
const toggleFav = (e, id) => {
  e.stopPropagation(); const idx = favorites.findIndex(f => f.id === id);
  if (idx > -1) favorites.splice(idx, 1); else { const c = (window._recipeCache || {})[id]; if (c) favorites.push(c); }
  localStorage.setItem('srFavorites', JSON.stringify(favorites)); refreshFavs();
};
const refreshFavs = () => {
    const c = document.getElementById('favCount'); if (c) c.textContent = favorites.length;
    if (favorites.length) renderGrid(favorites, 'favGrid'); else document.getElementById('favGrid').innerHTML = '<p>No favorites.</p>';
};
const showToast = (m, t) => {
  const w = document.getElementById('toastWrap'), e = document.createElement('div');
  e.className = `toast toast-${t}`; e.textContent = m; w.appendChild(e);
  setTimeout(() => { e.style.opacity = '0'; setTimeout(() => e.remove(), 400); }, 2500);
};

// ── INIT ──
(async function init() {
  applyTheme(); refreshFavs(); updateTrackerUI();
  
  const tr = await filterByArea('Indian'); renderGrid(tr.slice(0, 8), 'trendGrid');
  const dData = await searchMeals('salad'); renderGrid(dData.slice(0, 4), 'dietGrid');
  
  doSearch('Indian', '', true);
})();

// Globals
window.openModal = openModal; window.logCalories = logCalories; window.toggleFav = toggleFav; window.delLog = delLog;
window.startCooking = startCooking; window.moveStep = moveStep; window.completeCook = completeCook;

// Typewriter
const twEl = document.getElementById('twText'), phrases = ['All Indian States.', 'Step-by-Step Cooking.', 'Track your Calories.'];
let pi = 0, ci = 0, del = false;
function tw() {
  const w = phrases[pi];
  if (!del) { twEl.textContent = w.slice(0, ++ci); if (ci === w.length) { del = true; setTimeout(tw, 2000); return; } }
  else { twEl.textContent = w.slice(0, --ci); if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; } }
  setTimeout(tw, del ? 40 : 80);
}
if (twEl) tw();
