/* =========================================================
   App logic. Vanilla JS, no dependencies.
   Screens: home → item → cart → (drinks) → checkout → done
   ========================================================= */
(function () {
  'use strict';

  /* ---------- state ---------- */
  const STORAGE_KEY = 'mifgash-last-order';
  const state = {
    lang: pickLang(),
    screen: 'home',
    cat: 'meat',
    itemId: null,
    bread: 'laffa',
    boxSize: 'quarter',
    salads: [],
    fries: null,
    extras: [],
    qty: 1,
    cart: [],
    pay: 'cash',
    orderNo: CONFIG.firstOrderNo,
    lastOrder: loadLastOrder(),
  };

  function pickLang() {
    const locale = (navigator.language || '').toLowerCase();
    return locale.startsWith('he') ? 'he' : 'ar';
  }

  /* ---------- helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const t = (v) => (v && typeof v === 'object' ? v[state.lang] || v.en : v);
  const money = (n) => CONFIG.currency + n;
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  /* an <img> when a photo is set, a striped placeholder otherwise */
  const photo = (src, alt) =>
    src ? `<img src="${src}" alt="${alt || ''}" loading="lazy">` : '<div class="photo"></div>';

  const ICON = {
    plus: '<svg viewBox="0 0 20 20"><path d="M10 4.5v11M4.5 10h11"/></svg>',
    minus: '<svg viewBox="0 0 20 20"><path d="M4.5 10h11"/></svg>',
    check: '<svg viewBox="0 0 20 20"><path d="M4.5 10.5l3.5 3.5 7.5-8"/></svg>',
  };

  function loadLastOrder() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const lines = JSON.parse(saved);
      if (!Array.isArray(lines) || !lines.length || lines.some((line) =>
        !line || !line.name || typeof line.name !== 'object' || !Number.isFinite(line.unit) ||
        !Number.isInteger(line.qty) || line.qty < 1 || !Array.isArray(line.parts))) {
        throw new Error('Saved reorder data has an invalid shape.');
      }
      return lines;
    } catch (error) {
      console.error('Could not load the saved reorder:', error);
      return [];
    }
  }

  function saveLastOrder() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
      state.lastOrder = state.cart.map((line) => ({ ...line, parts: line.parts.slice() }));
      renderPopular();
    } catch (error) {
      console.error('Could not save the last order for reordering:', error);
    }
  }

  /* ---------- language ---------- */
  function applyLang() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'en' ? 'ltr' : 'rtl';
    document.querySelectorAll('[data-t]').forEach((n) => {
      n.textContent = t(T[n.dataset.t]);
    });
    document.querySelectorAll('.lang button').forEach((b) => {
      b.setAttribute('aria-current', String(b.dataset.lang === state.lang));
    });
    document.querySelectorAll('[data-t="hours"]').forEach((node) => {
      node.textContent = t(T.hours).replace('{opens}', CONFIG.opensAt).replace('{closes}', CONFIG.closesAt);
    });
    document.querySelectorAll('[data-contact="call"]').forEach((node) => {
      node.href = `tel:${CONFIG.phone}`;
    });
    document.querySelectorAll('[data-contact="whatsapp"]').forEach((node) => {
      node.href = `https://wa.me/${CONFIG.phone.replace(/\D/g, '')}`;
    });
    $('#note').placeholder = t(T.notePlaceholder);
    $('#customer-name').placeholder = t(T.customerNamePlaceholder);
    $('#customer-phone').placeholder = t(T.customerPhonePlaceholder);
    updateOpenStatus();
  }

  function updateOpenStatus() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: CONFIG.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(now);
    const clock = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const minutes = Number(clock.hour) * 60 + Number(clock.minute);
    const [openHour, openMinute] = CONFIG.opensAt.split(':').map(Number);
    const [closeHour, closeMinute] = CONFIG.closesAt.split(':').map(Number);
    const opens = openHour * 60 + openMinute;
    const closes = closeHour * 60 + closeMinute;
    const isOpen = minutes >= opens && minutes < closes;
    const message = isOpen ? T.openUntil : minutes < opens ? T.closedToday : T.closedUntil;
    const status = $('#open-status');
    status.classList.toggle('is-open', isOpen);
    status.classList.toggle('is-closed', !isOpen);
    $('[data-t]', status).textContent = t(message).replace('{time}', isOpen ? CONFIG.closesAt : CONFIG.opensAt);
  }

  /* ---------- screens ---------- */
  function show(name) {
    state.screen = name;
    document.querySelectorAll('.screen').forEach((s) => {
      s.hidden = s.id !== 'screen-' + name;
    });
    window.scrollTo(0, 0);
    renderCartBar();
  }

  /* ---------- home ---------- */
  function renderCats() {
    const wrap = $('#cats');
    wrap.innerHTML = '';
    CATS.forEach((c) => {
      const b = el('button', null, t(c.name));
      b.type = 'button';
      b.setAttribute('aria-current', String(c.id === state.cat));
      b.onclick = () => {
        state.cat = c.id;
        renderCats();
        renderMenu();
      };
      wrap.appendChild(b);
    });
  }

  function renderMenu() {
    $('#cat-title').textContent = t((CATS.find((c) => c.id === state.cat) || CATS[0]).name);
    const list = $('#menu');
    list.innerHTML = '';

    if (state.cat === 'drinks') {
      DRINKS.forEach((drink) => {
        const li = el('li');
        const inCart = state.cart.find((line) => line.key === 'drink-' + drink.id);
        const card = el('article', 'drink',
          `<div class="drink__thumb">${photo(drink.photo, t(drink.name))}</div>` +
          `<strong>${t(drink.name)}</strong>` +
          `<div class="drink__row"><span class="price">${money(drink.price)}</span>` +
          `<button type="button" class="drink__add${inCart ? ' is-added' : ''}" aria-pressed="${!!inCart}">` +
          `${inCart ? inCart.qty : ICON.plus}</button></div>`);
        $('.drink__add', card).setAttribute('aria-label', `${t(T.add)} ${t(drink.name)}`);
        $('.drink__add', card).onclick = () => addDrink(drink);
        li.appendChild(card);
        list.appendChild(li);
      });
      return;
    }

    ALL_ITEMS.filter((i) => i.cat === state.cat).forEach((i) => {
      const li = el('li');
      const b = el('button', 'dish');
      b.type = 'button';
      const inCart = i.direct && state.cart.find((l) => l.key === 'direct-' + i.id);
      const priceText = i.direct
        ? money(i.price)
        : ((i.saladBox || breadKeys(i).length > 1) ? t(T.from) : '') + money(Math.min(...Object.values(i.prices)));
      b.innerHTML =
        `<span class="dish__thumb">${photo(i.photo, t(i.name))}</span>` +
        `<span class="dish__body">` +
        `<span class="dish__title"><strong>${t(i.name)}</strong>` +
        (i.tag ? `<span class="tag">${t(i.tag)}</span>` : '') +
        `</span>` +
        `<span class="dish__desc">${t(i.desc)}</span>` +
        `<span class="price">${priceText}</span>` +
        `</span>` +
        `<span class="dish__add">${inCart ? inCart.qty : ICON.plus}</span>`;
      b.onclick = i.direct ? () => addDirect(i) : () => openItem(i.id);
      li.appendChild(b);
      list.appendChild(li);
    });
  }

  function renderPopular() {
    const wrap = $('#popular');
    if (!wrap) return;
    wrap.innerHTML = '';
    BEST_SELLERS.forEach((id) => {
      const item = ALL_ITEMS.find((candidate) => candidate.id === id);
      if (!item) return;
      const format = item.direct ? null : (breadKeys(item).includes('laffa') ? 'laffa' : breadKeys(item)[0]);
      const unit = item.direct ? item.price : item.prices[format];
      const title = format
        ? `${t(item.name)} · ${t(BREADS.find((bread) => bread.id === format).name)}`
        : t(item.name);
      const card = el('article', 'popular-card',
        `<div class="popular-card__photo">${photo(item.photo, title)}</div>` +
        `<strong>${title}</strong><span class="price">${money(unit)}</span>` +
        `<button type="button" class="btn btn--dark popular-card__add">${t(T.add)}</button>`);
      $('.popular-card__add', card).onclick = () => addPopular(item, format);
      wrap.appendChild(card);
    });
    $('#reorder').hidden = !state.lastOrder.length;
  }

  function addPopular(item, format) {
    if (item.direct) return addDirect(item);
    const key = `popular-${item.id}-${format}`;
    const line = state.cart.find((candidate) => candidate.key === key);
    if (line) line.qty += 1;
    else {
      const bread = BREADS.find((candidate) => candidate.id === format);
      state.cart.push({
        key,
        name: L(item.name.he + ' · ' + bread.name.he, item.name.ar + ' · ' + bread.name.ar, item.name.en + ' · ' + bread.name.en),
        photo: item.photo,
        unit: item.prices[format],
        qty: 1,
        parts: [],
        kind: 'meal',
      });
    }
    renderPopular();
    renderMenu();
    renderCart();
  }

  function reorderLastOrder() {
    state.lastOrder.forEach((savedLine) => {
      state.cart.push({ ...savedLine, key: `${savedLine.key}-repeat-${Date.now()}-${Math.random()}` });
    });
    renderPopular();
    renderMenu();
    renderCart();
    show('cart');
  }

  /* items with no options (take-away salads, fries): one tap adds one to the cart */
  function addDirect(item) {
    const key = 'direct-' + item.id;
    const line = state.cart.find((l) => l.key === key);
    if (line) line.qty += 1;
    else state.cart.push({ key, name: item.name, photo: item.photo, unit: item.price, qty: 1, parts: [], kind: 'side' });
    renderMenu();
    renderCart();
  }

  function renderStatic() {
    renderPopular();
  }

  /* ---------- item builder ---------- */
  function currentItem() {
    return ALL_ITEMS.find((i) => i.id === state.itemId) || null;
  }

  /* serving formats an item is sold in (keys of its prices), in menu-board order */
  function breadKeys(item) {
    return BREADS.map((b) => b.id).filter((id) => item.prices && item.prices[id] != null);
  }

  function openItem(id) {
    const item = ALL_ITEMS.find((i) => i.id === id);
    if (!item) return;
    const keys = breadKeys(item);
    Object.assign(state, {
      itemId: id, bread: keys.includes('laffa') ? 'laffa' : keys[0], boxSize: 'quarter', salads: [], fries: null,
      extras: [], qty: 1,
    });
    $('#note').value = '';
    renderItem();
    show('item');
  }

  function unitPrice() {
    const it = currentItem();
    if (!it) return 0;
    if (it.saladBox) return it.prices[state.boxSize];
    const extras = EXTRAS.filter((e) => state.extras.includes(e.id)).reduce((a, e) => a + e.price, 0);
    const fries = FRIES.find((f) => f.id === state.fries);
    return it.prices[state.bread] + extras + (fries ? fries.price : 0);
  }

  function toggle(list, id, limit) {
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1);
    else if (!limit || list.length < limit) list.push(id);
  }

  function renderItem() {
    const it = currentItem();
    if (!it) return;
    const detailPhoto = it.detailPhoto || it.photo;
    $('#item-photo').outerHTML = detailPhoto
      ? `<img id="item-photo" src="${detailPhoto}" alt="${t(it.name)}">`
      : '<div class="photo photo--flat" id="item-photo"></div>';
    $('#item-name').textContent = t(it.name);
    $('#item-price').textContent = money(it.saladBox ? it.prices[state.boxSize] : it.prices[state.bread]);
    $('#item-desc').textContent = t(it.desc);
    $('#bread-question').hidden = !!it.dish || !!it.saladBox;
    $('#breads').hidden = !!it.dish || !!it.saladBox;
    $('#box-size-question').hidden = !it.saladBox;
    $('#box-sizes').hidden = !it.saladBox;
    $('#fries-question').hidden = !!it.saladBox;
    $('#fries').hidden = !!it.saladBox;
    $('#extras-question').hidden = !!it.saladBox;
    $('#extras').hidden = !!it.saladBox;

    const breads = $('#breads');
    breads.innerHTML = '';
    BREADS.filter((b) => it.prices[b.id] != null).forEach((b) => {
      const n = el('button', 'bread',
        `<span class="bread__sw">${b.photo ? `<img src="${b.photo}" alt="">` : ''}</span><span><strong>${t(b.name)}</strong>` +
        `<span>${money(it.prices[b.id])}</span></span>`);
      n.type = 'button';
      n.setAttribute('aria-pressed', String(state.bread === b.id));
      n.onclick = () => { state.bread = b.id; renderItem(); };
      breads.appendChild(n);
    });

    const boxSizes = $('#box-sizes');
    boxSizes.innerHTML = '';
    if (it.saladBox) {
      [
        { id: 'quarter', name: T.boxQuarter },
        { id: 'half', name: T.boxHalf },
      ].forEach((size) => {
        const n = el('button', 'option',
          `<span class="option__radio"></span>` +
          `<span class="option__text"><strong>${t(size.name)}</strong></span>` +
          `<span class="option__price">${money(it.prices[size.id])}</span>`);
        n.type = 'button';
        n.setAttribute('aria-checked', String(state.boxSize === size.id));
        n.onclick = () => { state.boxSize = size.id; renderItem(); };
        boxSizes.appendChild(n);
      });
    }

    $('#salads-question span').textContent = t(it.saladBox ? T.boxContentsQ : T.saladsQ);
    $('#salads-question small').textContent = t(it.saladBox ? T.boxContentsHint : T.saladsFree);
    const salads = $('#salads');
    salads.innerHTML = '';
    SALADS.forEach((s) => {
      const n = el('button', 'salad',
        `<span class="salad__tile">${photo(s.photo, t(s.name))}` +
        `<span class="salad__check">${ICON.check}</span></span>` +
        `<span>${t(s.name)}</span>`);
      n.type = 'button';
      n.setAttribute('aria-pressed', String(state.salads.includes(s.id)));
      n.onclick = () => { toggle(state.salads, s.id, 5); renderItem(); };
      salads.appendChild(n);
    });

    const fries = $('#fries');
    fries.innerHTML = '';
    const noFries = el('button', 'option',
      `<span class="option__radio"></span><span class="option__text"><strong>${t(T.noFries)}</strong></span>`);
    noFries.type = 'button';
    noFries.setAttribute('aria-pressed', String(state.fries === null));
    noFries.onclick = () => { state.fries = null; renderItem(); };
    fries.appendChild(noFries);
    FRIES.forEach((f) => {
      const n = el('button', 'option',
        `<span class="option__radio"></span><span class="option__thumb">${photo(f.photo, t(f.name))}</span>` +
        `<span class="option__text"><strong>${t(f.name)}</strong></span>` +
        `<span class="option__price">+${money(f.price)}</span>`);
      n.type = 'button';
      n.setAttribute('aria-pressed', String(state.fries === f.id));
      n.onclick = () => { state.fries = f.id; renderItem(); };
      fries.appendChild(n);
    });

    const extras = $('#extras');
    extras.innerHTML = '';
    EXTRAS.forEach((e) => {
      const n = el('button', 'option',
        `<span class="option__box">${ICON.check}</span>` +
        `<span class="option__text"><strong>${t(e.name)}</strong></span>` +
        `<span class="option__price">${e.price ? '+' + money(e.price) : t(T.free)}</span>`);
      n.type = 'button';
      n.setAttribute('aria-pressed', String(state.extras.includes(e.id)));
      n.onclick = () => { toggle(state.extras, e.id); renderItem(); };
      extras.appendChild(n);
    });

    $('#qty').textContent = state.qty;
    $('#item-total').textContent = money(unitPrice() * state.qty);
  }

  function commitItem() {
    const it = currentItem();
    if (!it) return;
    const bread = BREADS.find((b) => b.id === state.bread);
    const selectedFries = FRIES.find((f) => f.id === state.fries);
    const boxSize = { name: state.boxSize === 'quarter' ? T.boxQuarter : T.boxHalf };
    const parts = (it.saladBox ? [boxSize] : it.dish ? [] : [bread])
      .concat(SALADS.filter((s) => state.salads.includes(s.id)))
      .concat(EXTRAS.filter((e) => state.extras.includes(e.id)))
      .concat(selectedFries ? [selectedFries] : [])
      .filter(Boolean)
      .map((p) => p.name);
    const note = $('#note').value.trim();
    state.cart.push({
      key: it.id + '-' + Date.now(), name: it.name, photo: it.photo,
      unit: unitPrice(), qty: state.qty, parts, note,
    });
    renderCart();
    show('cart');
  }

  /* ---------- drinks ---------- */
  function addDrink(drink) {
    const line = state.cart.find((candidate) => candidate.key === 'drink-' + drink.id);
    if (line) line.qty += 1;
    else state.cart.push({
      key: 'drink-' + drink.id,
      name: drink.name,
      photo: drink.photo,
      unit: drink.price,
      qty: 1,
      parts: [],
      kind: 'drink',
    });
    renderMenu();
    renderCart();
  }

  /* ---------- cart & totals ---------- */
  const subtotal = () => state.cart.reduce((a, l) => a + l.unit * l.qty, 0);
  const total = () => subtotal();

  function renderTotals(node) {
    node.innerHTML =
      `<div><dt>${t(T.subtotal)}</dt><dd>${money(subtotal())}</dd></div>` +
      `<div class="is-total"><dt>${t(T.total)}</dt><dd>${money(total())}</dd></div>`;
  }

  function renderCart() {
    const list = $('#cart');
    list.innerHTML = '';
    if (!state.cart.length) {
      list.appendChild(el('li', 'line', `<span class="line__detail">${t(T.emptyCart)}</span>`));
    }
    state.cart.forEach((l) => {
      const detail = l.parts.length
        ? l.parts.map(t).join(' · ')
        : t(l.kind === 'drink' ? T.drink : T.side);
      const li = el('li', 'line',
        `<span class="line__thumb">${photo(l.photo, '')}</span>` +
        `<span class="line__body"><strong>${t(l.name)}</strong>` +
        `<span class="line__detail">${detail}${l.note ? ' · ' + l.note : ''}</span>` +
        `<span class="line__row"><span class="line__qty">` +
        `<button type="button" data-dec>${ICON.minus}</button><span>${l.qty}</span>` +
        `<button type="button" data-inc>${ICON.plus}</button></span>` +
        `<span class="line__total">${money(l.unit * l.qty)}</span></span></span>`);
      $('[data-dec]', li).onclick = () => bump(l.key, -1);
      $('[data-inc]', li).onclick = () => bump(l.key, 1);
      list.appendChild(li);
    });
    renderTotals($('#totals-cart'));
    renderTotals($('#totals-checkout'));
    renderCartBar();
  }

  function bump(key, delta) {
    const line = state.cart.find((l) => l.key === key);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) state.cart = state.cart.filter((l) => l.key !== key);
    renderCart();
  }

  function renderCartBar() {
    const bar = $('#cartbar');
    const count = state.cart.reduce((a, l) => a + l.qty, 0);
    bar.hidden = !(state.screen === 'home' && count > 0);
    $('#cartbar-count').textContent = count;
    $('#cartbar-total').textContent = money(subtotal());
  }

  /* ---------- checkout ---------- */
  function renderPlace() {
    const b = $('#place');
    const customerName = $('#customer-name').value.trim();
    const customerPhone = $('#customer-phone').value.trim();
    const later = $('#pickup-slot').value === 'later';
    const pickupValue = $('#pickup-later').value;
    const pickupValid = !later || (pickupValue && new Date(pickupValue).getTime() > Date.now());
    b.disabled = !customerName || !customerPhone || !pickupValid || !state.cart.length;
  }

  function pickupTimeText() {
    const slot = $('#pickup-slot').value;
    if (slot === 'later') {
      return new Intl.DateTimeFormat(state.lang, { dateStyle: 'medium', timeStyle: 'short' })
        .format(new Date($('#pickup-later').value));
    }
    return slot === 'asap' ? t(T.pickupAsapReceipt) : t(T[`pickup${slot}`]);
  }

  function renderOrderStatus() {
    const list = $('#order-status');
    list.innerHTML = '';
    [T.statusReceived, T.statusPreparing, T.statusReady].forEach((label, index) => {
      const step = el('li', index === 0 ? 'is-current' : 'is-pending', t(label));
      if (index === 0) step.setAttribute('aria-current', 'step');
      list.appendChild(step);
    });
  }

  /* ---------- confirmation ---------- */
  function placeOrder() {
    renderPlace();
    if ($('#place').disabled || !state.cart.length) return;
    saveLastOrder();
    renderOrderStatus();
    $('#receipt').innerHTML =
      `<div><dt>${t(T.orderNo)}</dt><dd>#${state.orderNo}</dd></div>` +
      `<div><dt>${t(T.payQ)}</dt><dd>${t(T.payCash)}</dd></div>` +
      `<div><dt>${t(T.pickupTimeLabel)}</dt><dd>${pickupTimeText()}</dd></div>` +
      `<div><dt>${t(T.total)}</dt><dd>${money(total())}</dd></div>`;
    show('done');
  }

  function reset() {
    state.cart = []; state.pay = 'cash'; state.orderNo += 1;
    $('#customer-name').value = '';
    $('#customer-phone').value = '';
    $('#pickup-slot').value = 'asap';
    $('#pickup-later').value = '';
    $('#pickup-later').hidden = true;
    renderCart(); renderPopular(); renderPlace();
    show('home');
  }

  /* ---------- wiring ---------- */
  document.querySelectorAll('.lang button').forEach((b) => {
    b.onclick = () => {
      state.lang = b.dataset.lang;
      applyLang(); renderCats(); renderMenu(); renderStatic();
      renderItem(); renderCart();
      renderPlace();
    };
  });
  document.querySelectorAll('[data-go]').forEach((b) => {
    b.onclick = () => {
      const to = b.dataset.go;
      if (to === 'cart') renderCart();
      if (to === 'checkout') { state.pay = 'cash'; renderPlace(); }
      show(to);
    };
  });
  document.querySelectorAll('[data-category]').forEach((button) => {
    button.onclick = () => {
      state.cat = button.dataset.category;
      renderCats();
      renderMenu();
      show('home');
      $('#menu-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  });
  $('#cta-menu').onclick = () => $('#cats').scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('#reorder').onclick = reorderLastOrder;
  $('#qty-minus').onclick = () => { state.qty = Math.max(1, state.qty - 1); renderItem(); };
  $('#qty-plus').onclick = () => { state.qty += 1; renderItem(); };
  $('#to-sides').onclick = commitItem;
  $('#customer-name').oninput = renderPlace;
  $('#customer-phone').oninput = renderPlace;
  $('#pickup-slot').onchange = () => {
    const later = $('#pickup-slot').value === 'later';
    const input = $('#pickup-later');
    input.hidden = !later;
    if (later) {
      const localNow = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
      input.min = localNow.toISOString().slice(0, 16);
    }
    renderPlace();
  };
  $('#pickup-later').oninput = renderPlace;
  $('#place').onclick = placeOrder;
  $('#reset').onclick = reset;

  /* ---------- boot ---------- */
  applyLang();
  renderCats(); renderMenu(); renderStatic();
  renderCart();
  renderPlace();
  show('home');
  window.setInterval(updateOpenStatus, 60000);
})();
