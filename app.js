const DAYS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
const MEALS = ['ontbijt', 'snack1', 'lunch', 'snack2', 'diner', 'snack3'];
const CATEGORIES = ['ontbijt', 'lunch', 'diner', 'snack', 'dessert'];
const MEAL_LABELS = { ontbijt: 'Ontbijt', snack1: 'Snack', lunch: 'Lunch', snack2: 'Snack', diner: 'Diner', snack3: 'Snack' };

const SUPABASE_URL = 'https://oedetwodrmyuctpgeozu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FvjrjHaXMW9DKtwFbxRVxw_N1UhF5DN';
const API_URL = `${SUPABASE_URL}/rest/v1/menu_data`;
const API_HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
};

const sampleRecipes = [
    { id: '1', name: 'Havermout met fruit', category: 'ontbijt', time: 10, servings: 2, ingredients: '80g havermout\n300ml melk\n1 banaan\nHandje blauwe bessen\n1 el honing', instructions: 'Kook de havermout met melk. Snijd de banaan en leg bovenop met bessen en honing.', cal: 320, protein: 12, carbs: 52, fat: 8 },
    { id: '2', name: 'Broodje avocado-ei', category: 'lunch', time: 15, servings: 2, ingredients: '4 sneetjes volkorenbrood\n2 avocado\'s\n2 eieren\nSnufje peper en zout\nChilivlokken', instructions: 'Toast het brood. Prak de avocado en smeer op het brood. Bak de eieren en leg erop. Breng op smaak.', cal: 420, protein: 16, carbs: 38, fat: 24 },
    { id: '3', name: 'Pasta pesto met kip', category: 'diner', time: 25, servings: 4, ingredients: '400g pasta\n300g kipfilet\n4 el groene pesto\n200g cherrytomaatjes\n50g pijnboompitten\nHandje rucola', instructions: 'Kook de pasta. Bak de kip gaar en snijd in reepjes. Halveer de tomaatjes. Meng alles met pesto en garneer met rucola en pijnboompitten.', cal: 580, protein: 35, carbs: 62, fat: 20 },
    { id: '4', name: 'Griekse salade', category: 'lunch', time: 15, servings: 2, ingredients: '1 komkommer\n4 tomaten\n1 rode ui\n150g feta\n16 zwarte olijven\n3 el olijfolie\n1 el rode wijnazijn\nOregano', instructions: 'Snijd alle groenten in stukjes. Verkruimel de feta. Meng alles samen met olijfolie, azijn en oregano.', cal: 310, protein: 14, carbs: 12, fat: 24 },
    { id: '5', name: 'Teriyaki zalm met rijst', category: 'diner', time: 30, servings: 2, ingredients: '2 zalmfilets\n200g rijst\n3 el sojasaus\n2 el honing\n1 teentje knoflook\n1 el sesamolie\nSesamzaadjes\nBroccoli', instructions: 'Kook de rijst. Meng sojasaus, honing, knoflook en sesamolie. Bak de zalm en glaze met de saus. Stoom de broccoli. Serveer met sesamzaadjes.', cal: 520, protein: 38, carbs: 55, fat: 16 },
    { id: '6', name: 'Smoothie bowl', category: 'ontbijt', time: 10, servings: 1, ingredients: '1 bevroren banaan\n100g bevroren mango\n100ml kokosmelk\nGranola\nKokosvlokken\nChiazaad', instructions: 'Blend banaan, mango en kokosmelk tot een dikke smoothie. Schep in een kom en top met granola, kokosvlokken en chiazaad.', cal: 380, protein: 8, carbs: 64, fat: 12 },
    { id: '7', name: 'Wraps met hummus', category: 'lunch', time: 10, servings: 2, ingredients: '4 volkoren wraps\n200g hummus\n1 komkommer\n2 tomaten\nHandje spinazie\n1 wortel', instructions: 'Smeer hummus op de wraps. Snijd groenten in reepjes en verdeel over de wraps. Rol op en serveer.', cal: 360, protein: 14, carbs: 48, fat: 14 },
    { id: '8', name: 'Ovenschotel met zoete aardappel', category: 'diner', time: 45, servings: 4, ingredients: '600g zoete aardappel\n400g gehakt\n1 ui\n1 blik tomatenblokjes\n200g kaas\nPaprikapoeder\nKomijn', instructions: 'Schil en snijd de zoete aardappel in plakjes. Bak het gehakt met ui en kruiden. Maak laagjes in een ovenschaal en bedek met kaas. 25 min in de oven op 200°C.', cal: 480, protein: 28, carbs: 42, fat: 22 },
    { id: '9', name: 'Energieballen', category: 'snack', time: 15, servings: 12, ingredients: '200g dadels\n100g havermout\n3 el pindakaas\n2 el cacao\n1 el honing', instructions: 'Blend alle ingrediënten in een keukenmachine. Rol tot balletjes en zet minimaal 30 minuten in de koelkast.', cal: 95, protein: 3, carbs: 14, fat: 4 },
    { id: '10', name: 'Yoghurt met granola', category: 'ontbijt', time: 5, servings: 1, ingredients: '200g Griekse yoghurt\n40g granola\n1 el honing\nVers fruit naar keuze', instructions: 'Schep yoghurt in een kom, voeg granola en fruit toe en besprenkel met honing.', cal: 280, protein: 18, carbs: 34, fat: 8 }
];

// State
let state = {
    recipes: [],
    weekmenu: {},
    shoppingList: [],
    weekOffset: 0,
    editingRecipeId: null,
    pickingMeal: null
};

let syncTimer = null;
let isSyncing = false;

function getSaveData() {
    return {
        recipes: state.recipes,
        weekmenu: state.weekmenu,
        shoppingList: state.shoppingList
    };
}

function showSyncStatus(msg, type = 'info') {
    const el = document.getElementById('syncStatus');
    el.textContent = msg;
    el.className = 'sync-status sync-' + type;
    el.style.display = 'block';
    if (type !== 'error') {
        setTimeout(() => { el.style.display = 'none'; }, 2500);
    }
}

// SUPABASE SYNC
async function loadFromCloud() {
    try {
        const res = await fetch(`${API_URL}?id=eq.main&select=content`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        if (!res.ok) throw new Error('Laden mislukt');
        const rows = await res.json();
        if (rows.length && rows[0].content && rows[0].content.recipes) {
            const data = rows[0].content;
            state.recipes = data.recipes;
            state.weekmenu = data.weekmenu || {};
            state.shoppingList = data.shoppingList || [];
            showSyncStatus('Gesynchroniseerd', 'success');
            return true;
        }
        return false;
    } catch (e) {
        showSyncStatus('Offline modus — data wordt lokaal opgeslagen', 'error');
        return false;
    }
}

async function saveToCloud() {
    if (isSyncing) return;
    isSyncing = true;
    try {
        await fetch(`${API_URL}?id=eq.main`, {
            method: 'PATCH',
            headers: API_HEADERS,
            body: JSON.stringify({
                content: getSaveData(),
                updated_at: new Date().toISOString()
            })
        });
    } catch (e) {
        // silent fail, local backup
    }
    isSyncing = false;
}

function loadLocal() {
    const saved = localStorage.getItem('bakje-geluk');
    if (saved) {
        const parsed = JSON.parse(saved);
        state.recipes = parsed.recipes || sampleRecipes;
        state.weekmenu = parsed.weekmenu || {};
        state.shoppingList = parsed.shoppingList || [];
    } else {
        state.recipes = [...sampleRecipes];
    }
}

function save() {
    localStorage.setItem('bakje-geluk', JSON.stringify(getSaveData()));
    clearTimeout(syncTimer);
    syncTimer = setTimeout(saveToCloud, 1000);
}

function getWeekKey() {
    return `week_${state.weekOffset}`;
}

function getWeekMenu() {
    const key = getWeekKey();
    if (!state.weekmenu[key]) {
        state.weekmenu[key] = {};
    }
    return state.weekmenu[key];
}

function renderSyncBar() {
    const bar = document.getElementById('shareBar');
    bar.innerHTML = `
        <div class="share-bar-content">
            <span>☁️ Automatische sync actief — werkt op al je apparaten</span>
        </div>
    `;
}

function renderAll() {
    renderWeekMenu();
    renderRecipes();
}

// Auto-refresh elke 30 seconden
setInterval(async () => {
    if (document.visibilityState === 'visible' && !isSyncing) {
        const loaded = await loadFromCloud();
        if (loaded) renderAll();
    }
}, 30000);

// Refresh bij terugkomen naar tabblad
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
        const loaded = await loadFromCloud();
        if (loaded) renderAll();
    }
});

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const page = link.dataset.page;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${page}`).classList.add('active');
        document.getElementById('sidebar').classList.remove('open');
        if (page === 'boodschappen') renderShoppingList();
        if (page === 'voeding') renderNutrition();
    });
});

document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// WEEKMENU
function renderWeekMenu() {
    const grid = document.getElementById('weekmenuGrid');
    const menu = getWeekMenu();
    const label = state.weekOffset === 0 ? 'Deze week' : state.weekOffset > 0 ? `+${state.weekOffset} weken` : `${state.weekOffset} weken`;
    document.getElementById('weekLabel').textContent = label;

    grid.innerHTML = DAYS.map(day => {
        const dayMenu = menu[day] || {};
        return `<div class="day-card">
            <div class="day-card-header">
                <h3>${day}</h3>
                <div class="day-card-actions">
                    <button class="btn-day" onclick="copyDay('${day}')" title="Kopieer deze dag">📋</button>
                    <button class="btn-day" onclick="pasteDay('${day}')" title="Plak hier" id="paste-${day}" style="display:none">📌</button>
                </div>
            </div>
            ${MEALS.map(meal => {
                const recipe = dayMenu[meal];
                const entry = dayMenu[meal];
                const name = entry ? entry.name : '';
                const hasRecipe = entry && entry.id && state.recipes.find(r => r.id === entry.id);
                return `<div class="meal-slot">
                    <span class="meal-slot-label">${MEAL_LABELS[meal] || meal}</span>
                    ${hasRecipe
                        ? `<a class="meal-slot-name meal-link" href="#" onclick="event.preventDefault(); viewRecipe('${entry.id}')">${name}</a>`
                        : `<input class="meal-slot-input" type="text" value="${name}" placeholder="Typ of kies..." onfocus="this.select()" onchange="setCustomMeal('${day}', '${meal}', this.value)" />`
                    }
                    <div class="meal-slot-actions">
                        <button onclick="openMealPicker('${day}', '${meal}')" title="Kies recept">📝</button>
                        ${name ? `<button onclick="removeMeal('${day}', '${meal}')" title="Verwijder">✕</button>` : ''}
                    </div>
                </div>`;
            }).join('')}
        </div>`;
    }).join('');
}

document.getElementById('prevWeek').addEventListener('click', () => { state.weekOffset--; renderWeekMenu(); });
document.getElementById('nextWeek').addEventListener('click', () => { state.weekOffset++; renderWeekMenu(); });

function openMealPicker(day, meal) {
    state.pickingMeal = { day, meal };
    const modal = document.getElementById('mealPickerModal');
    const search = document.getElementById('mealPickerSearch');
    search.value = '';
    modal.classList.add('open');
    renderMealPickerList('');
    search.focus();
}

function renderMealPickerList(query) {
    const list = document.getElementById('mealPickerList');
    const q = query.toLowerCase();
    const filtered = state.recipes.filter(r => r.name.toLowerCase().includes(q));
    let html = filtered.map(r =>
        `<div class="meal-picker-item" onclick="selectMeal('${r.id}')">${r.name}<span class="picker-cat">${r.category}</span></div>`
    ).join('');
    if (q.length > 0) {
        html += `<div class="meal-picker-item meal-picker-custom" onclick="selectCustomMeal()">✏️ "${document.getElementById('mealPickerSearch').value}" toevoegen als vrije tekst</div>`;
    }
    if (!html) {
        html = '<p style="padding:20px;color:var(--text-light);text-align:center">Typ een naam om als vrije tekst toe te voegen</p>';
    }
    list.innerHTML = html;
}

document.getElementById('mealPickerSearch').addEventListener('input', e => renderMealPickerList(e.target.value));

window.selectMeal = function(recipeId) {
    const { day, meal } = state.pickingMeal;
    const recipe = state.recipes.find(r => r.id === recipeId);
    const menu = getWeekMenu();
    if (!menu[day]) menu[day] = {};
    menu[day][meal] = { id: recipe.id, name: recipe.name };
    save();
    document.getElementById('mealPickerModal').classList.remove('open');
    renderWeekMenu();
};

let copiedDay = null;

window.copyDay = function(day) {
    const menu = getWeekMenu();
    copiedDay = JSON.parse(JSON.stringify(menu[day] || {}));
    DAYS.forEach(d => {
        const btn = document.getElementById(`paste-${d}`);
        if (btn) btn.style.display = d !== day ? 'inline-flex' : 'none';
    });
    showSyncStatus(`${day} gekopieerd — kies een dag om te plakken`, 'success');
};

window.pasteDay = function(day) {
    if (!copiedDay) return;
    const menu = getWeekMenu();
    menu[day] = JSON.parse(JSON.stringify(copiedDay));
    save();
    copiedDay = null;
    renderWeekMenu();
    showSyncStatus(`Menu geplakt naar ${day}`, 'success');
};

window.setCustomMeal = function(day, meal, value) {
    const name = value.trim();
    const menu = getWeekMenu();
    if (!menu[day]) menu[day] = {};
    if (name) {
        menu[day][meal] = { name };
    } else {
        delete menu[day][meal];
    }
    save();
};

window.selectCustomMeal = function() {
    const { day, meal } = state.pickingMeal;
    const name = document.getElementById('mealPickerSearch').value.trim();
    if (!name) return;
    const menu = getWeekMenu();
    if (!menu[day]) menu[day] = {};
    menu[day][meal] = { name };
    save();
    document.getElementById('mealPickerModal').classList.remove('open');
    renderWeekMenu();
};

window.viewRecipe = function(id) {
    const recipe = state.recipes.find(r => r.id === id);
    if (!recipe) return;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="recepten"]').classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-recepten').classList.add('active');
    openRecipeModal(recipe);
};

window.removeMeal = function(day, meal) {
    const menu = getWeekMenu();
    if (menu[day]) delete menu[day][meal];
    save();
    renderWeekMenu();
};

document.getElementById('closeMealPicker').addEventListener('click', () => {
    document.getElementById('mealPickerModal').classList.remove('open');
});

// RECEPTEN
function renderRecipes(query = '', catFilter = '') {
    const grid = document.getElementById('recipeGrid');
    const q = query.toLowerCase();
    const filtered = state.recipes.filter(r =>
        r.name.toLowerCase().includes(q) &&
        (!catFilter || r.category === catFilter)
    );

    grid.innerHTML = filtered.length ? filtered.map(r => `
        <div class="recipe-card" onclick="editRecipe('${r.id}')">
            <div class="recipe-card-actions">
                <button onclick="event.stopPropagation(); deleteRecipe('${r.id}')" title="Verwijder">🗑</button>
            </div>
            <span class="recipe-card-cat cat-${r.category}">${r.category}</span>
            <h3>${r.name}</h3>
            <div class="recipe-card-meta">
                <span>⏱ ${r.time} min</span>
                <span>👥 ${r.servings} porties</span>
                <span>🔥 ${r.cal} kcal</span>
            </div>
        </div>
    `).join('') : '<p style="padding:40px;color:var(--text-light);text-align:center;grid-column:1/-1">Geen recepten gevonden</p>';

    renderFilterTags(catFilter);
}

function renderFilterTags(active) {
    const container = document.getElementById('filterTags');
    container.innerHTML = CATEGORIES.map(c =>
        `<span class="filter-tag ${active === c ? 'active' : ''}" onclick="filterByCategory('${c}')">${c}</span>`
    ).join('') + `<span class="filter-tag ${!active ? 'active' : ''}" onclick="filterByCategory('')">Alles</span>`;
}

let activeFilter = '';
window.filterByCategory = function(cat) {
    activeFilter = cat === activeFilter ? '' : cat;
    renderRecipes(document.getElementById('recipeSearch').value, activeFilter);
};

document.getElementById('recipeSearch').addEventListener('input', e => {
    renderRecipes(e.target.value, activeFilter);
});

// Recipe modal
function openRecipeModal(recipe = null) {
    const modal = document.getElementById('recipeModal');
    document.getElementById('modalTitle').textContent = recipe ? 'Recept bewerken' : 'Nieuw recept';
    state.editingRecipeId = recipe ? recipe.id : null;

    document.getElementById('recipeName').value = recipe ? recipe.name : '';
    document.getElementById('recipeCategory').value = recipe ? recipe.category : 'diner';
    document.getElementById('recipeTime').value = recipe ? recipe.time : 30;
    document.getElementById('recipeServings').value = recipe ? recipe.servings : 4;
    document.getElementById('recipeIngredients').value = recipe ? recipe.ingredients : '';
    document.getElementById('recipeInstructions').value = recipe ? recipe.instructions : '';
    document.getElementById('recipeCal').value = recipe ? recipe.cal : 0;
    document.getElementById('recipeProtein').value = recipe ? recipe.protein : 0;
    document.getElementById('recipeCarbs').value = recipe ? recipe.carbs : 0;
    document.getElementById('recipeFat').value = recipe ? recipe.fat : 0;

    modal.classList.add('open');
    document.getElementById('recipeName').focus();
}

document.getElementById('addRecipeBtn').addEventListener('click', () => openRecipeModal());
document.getElementById('closeModal').addEventListener('click', () => document.getElementById('recipeModal').classList.remove('open'));
document.getElementById('cancelRecipe').addEventListener('click', () => document.getElementById('recipeModal').classList.remove('open'));

window.editRecipe = function(id) {
    const recipe = state.recipes.find(r => r.id === id);
    if (recipe) openRecipeModal(recipe);
};

window.deleteRecipe = function(id) {
    if (!confirm('Weet je zeker dat je dit recept wilt verwijderen?')) return;
    state.recipes = state.recipes.filter(r => r.id !== id);
    save();
    renderRecipes(document.getElementById('recipeSearch').value, activeFilter);
};

document.getElementById('recipeForm').addEventListener('submit', e => {
    e.preventDefault();
    const recipe = {
        id: state.editingRecipeId || Date.now().toString(),
        name: document.getElementById('recipeName').value.trim(),
        category: document.getElementById('recipeCategory').value,
        time: parseInt(document.getElementById('recipeTime').value) || 30,
        servings: parseInt(document.getElementById('recipeServings').value) || 4,
        ingredients: document.getElementById('recipeIngredients').value.trim(),
        instructions: document.getElementById('recipeInstructions').value.trim(),
        cal: parseInt(document.getElementById('recipeCal').value) || 0,
        protein: parseInt(document.getElementById('recipeProtein').value) || 0,
        carbs: parseInt(document.getElementById('recipeCarbs').value) || 0,
        fat: parseInt(document.getElementById('recipeFat').value) || 0
    };

    if (state.editingRecipeId) {
        const idx = state.recipes.findIndex(r => r.id === state.editingRecipeId);
        if (idx >= 0) state.recipes[idx] = recipe;
    } else {
        state.recipes.push(recipe);
    }

    save();
    document.getElementById('recipeModal').classList.remove('open');
    renderRecipes(document.getElementById('recipeSearch').value, activeFilter);
});

// BOODSCHAPPENLIJST
document.getElementById('generateListBtn').addEventListener('click', generateShoppingList);

function generateShoppingList() {
    const menu = getWeekMenu();
    const ingredients = {};

    DAYS.forEach(day => {
        MEALS.forEach(meal => {
            const entry = menu[day]?.[meal];
            if (entry) {
                const recipe = state.recipes.find(r => r.id === entry.id);
                if (recipe && recipe.ingredients) {
                    recipe.ingredients.split('\n').forEach(line => {
                        const trimmed = line.trim();
                        if (trimmed) {
                            const key = trimmed.toLowerCase();
                            if (!ingredients[key]) {
                                ingredients[key] = { text: trimmed, checked: false };
                            }
                        }
                    });
                }
            }
        });
    });

    state.shoppingList = Object.values(ingredients);
    save();
    renderShoppingList();
}

function renderShoppingList() {
    const container = document.getElementById('shoppingList');
    if (!state.shoppingList.length) {
        container.innerHTML = '<div class="shopping-empty">Geen items. Genereer een lijst uit je weekmenu of voeg handmatig items toe.</div>';
        return;
    }

    container.innerHTML = state.shoppingList.map((item, i) => `
        <div class="shopping-item ${item.checked ? 'checked' : ''}">
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleItem(${i})">
            <span>${item.text}</span>
            <button onclick="removeItem(${i})">✕</button>
        </div>
    `).join('');
}

window.toggleItem = function(i) {
    state.shoppingList[i].checked = !state.shoppingList[i].checked;
    save();
    renderShoppingList();
};

window.removeItem = function(i) {
    state.shoppingList.splice(i, 1);
    save();
    renderShoppingList();
};

document.getElementById('addItemBtn').addEventListener('click', addItem);
document.getElementById('addItemInput').addEventListener('keydown', e => { if (e.key === 'Enter') addItem(); });

function addItem() {
    const input = document.getElementById('addItemInput');
    const text = input.value.trim();
    if (!text) return;
    state.shoppingList.push({ text, checked: false });
    input.value = '';
    save();
    renderShoppingList();
}

// VOEDINGSWAARDEN
function renderNutrition() {
    const menu = getWeekMenu();
    const overview = document.getElementById('nutritionOverview');
    const targets = { cal: 2000, protein: 60, carbs: 250, fat: 70 };

    let weekTotals = { cal: 0, protein: 0, carbs: 0, fat: 0, count: 0 };

    const dayCards = DAYS.map(day => {
        const dayMenu = menu[day] || {};
        let totals = { cal: 0, protein: 0, carbs: 0, fat: 0 };

        MEALS.forEach(meal => {
            const entry = dayMenu[meal];
            if (entry) {
                const recipe = state.recipes.find(r => r.id === entry.id);
                if (recipe) {
                    totals.cal += recipe.cal;
                    totals.protein += recipe.protein;
                    totals.carbs += recipe.carbs;
                    totals.fat += recipe.fat;
                }
            }
        });

        if (totals.cal > 0) {
            weekTotals.cal += totals.cal;
            weekTotals.protein += totals.protein;
            weekTotals.carbs += totals.carbs;
            weekTotals.fat += totals.fat;
            weekTotals.count++;
        }

        return `<div class="nutrition-day-card">
            <h3>${day}</h3>
            <div class="nutrition-bars">
                ${renderBar('Calorieën', totals.cal, targets.cal, 'kcal', 'cal')}
                ${renderBar('Eiwitten', totals.protein, targets.protein, 'g', 'protein')}
                ${renderBar('Koolhydraten', totals.carbs, targets.carbs, 'g', 'carbs')}
                ${renderBar('Vetten', totals.fat, targets.fat, 'g', 'fat')}
            </div>
        </div>`;
    }).join('');

    const avgCal = weekTotals.count ? Math.round(weekTotals.cal / weekTotals.count) : 0;
    const avgProtein = weekTotals.count ? Math.round(weekTotals.protein / weekTotals.count) : 0;
    const avgCarbs = weekTotals.count ? Math.round(weekTotals.carbs / weekTotals.count) : 0;
    const avgFat = weekTotals.count ? Math.round(weekTotals.fat / weekTotals.count) : 0;

    overview.innerHTML = `
        <div style="grid-column: 1 / -1">
            <h3 style="margin-bottom: 12px; font-size: 0.95rem; color: var(--text-light)">Gemiddeld per dag (${weekTotals.count} dagen ingevuld)</h3>
            <div class="nutrition-totals">
                <div class="nutrition-total-card nt-cal"><div class="value">${avgCal}</div><div class="label">kcal</div></div>
                <div class="nutrition-total-card nt-protein"><div class="value">${avgProtein}g</div><div class="label">Eiwitten</div></div>
                <div class="nutrition-total-card nt-carbs"><div class="value">${avgCarbs}g</div><div class="label">Koolhydraten</div></div>
                <div class="nutrition-total-card nt-fat"><div class="value">${avgFat}g</div><div class="label">Vetten</div></div>
            </div>
        </div>
        ${dayCards}
    `;
}

function renderBar(label, value, target, unit, type) {
    const pct = Math.min(100, Math.round((value / target) * 100));
    return `<div class="nutrition-bar-group">
        <label><span>${label}</span><span>${value} / ${target} ${unit}</span></label>
        <div class="nutrition-bar"><div class="nutrition-bar-fill bar-${type}" style="width:${pct}%"></div></div>
    </div>`;
}

// INIT
async function init() {
    loadLocal();
    renderSyncBar();
    renderAll();

    const cloudLoaded = await loadFromCloud();
    if (cloudLoaded) {
        localStorage.setItem('bakje-geluk', JSON.stringify(getSaveData()));
        renderAll();
    } else if (state.recipes.length > 0) {
        saveToCloud();
    }
}

init();
