const previewImage = document.getElementById('previewImage');
const previewTitle = document.getElementById('previewTitle');
const previewDescription = document.getElementById('previewDescription');
const materialSelect = document.getElementById('material');
const engravingInput = document.getElementById('engraving');
const ringSizeInput = document.getElementById('ringSize');
const stoneTypeSelect = document.getElementById('stoneType');
const tableBody = document.getElementById('designsTable');
const cartTable = document.getElementById('cartTable');
const message = document.getElementById('message');
const form = document.getElementById('ringForm');
const stoneRadios = [...document.querySelectorAll('input[name="stoneOption"]')];

function getStoneOption() {
  const checked = document.querySelector('input[name="stoneOption"]:checked');
  return checked ? checked.value : 'With Stone';
}

function getPreviewImage() {
  const metal = materialSelect.value;

  switch (metal) {
    case 'Yellow Gold':
      return '/images/preview-yellow.png';
    case 'White Gold':
      return '/images/preview-white.png';
    case 'Rose Gold':
      return '/images/preview-rose.png';
    case 'Silver':
      return '/images/preview-silver.png';
    default:
      return '/images/ring.png';
  }
}

function getPayload() {
  return {
    material: materialSelect.value,
    stoneOption: getStoneOption(),
    stoneType: stoneTypeSelect.value,
    ringSize: ringSizeInput.value.trim(),
    engravingText: engravingInput.value.trim()
  };
}

function updatePreview() {
  const p = getPayload();
  previewImage.src = getPreviewImage();
  previewTitle.textContent = p.material ? 'Custom Ring' : 'No ring selected yet';
  previewDescription.innerHTML = `
    <strong>Material:</strong> ${p.material || 'Select one'}<br>
    <strong>Stone:</strong> ${p.stoneOption}${p.stoneOption === 'With Stone' && p.stoneType ? ` (${p.stoneType})` : ''}<br>
    <strong>Size:</strong> ${p.ringSize || 'Not selected'}<br>
    <strong>Engraving:</strong> ${p.engravingText || 'No engraving'}
  `;
}

function setMessage(type, text) {
  message.innerHTML = `<div class="alert alert-${type} py-2 mb-0">${text}</div>`;
  setTimeout(() => {
    if (message.innerHTML.includes(text)) message.innerHTML = '';
  }, 3000);
}

function validateClient() {
  form.classList.add('was-validated');
  if (!materialSelect.value) return 'Please choose a metal type.';
  if (!ringSizeInput.value.trim()) return 'Ring size is required.';
  if (getStoneOption() === 'With Stone' && !stoneTypeSelect.value) return 'Please choose a stone type.';
  return null;
}

async function loadDesigns() {
  const res = await fetch('/api/designs');
  const rows = await res.json();

  if (!rows.length) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No saved rings yet.</td></tr>';
    return;
  }

  tableBody.innerHTML = rows.map(row => `
    <tr>
      <td>${row.id}</td>
      <td><span class="badge badge-soft">${row.material}</span></td>
      <td>${row.stone_option}${row.stone_type ? ` (${row.stone_type})` : ''}</td>
      <td>${row.ring_size}</td>
      <td>${row.engraving_text || '—'}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${row.id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

function getCart() {
  return JSON.parse(localStorage.getItem('ringCart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('ringCart', JSON.stringify(cart));
}

function loadCart() {
  const cart = getCart();
  if (!cart.length) {
    cartTable.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">Cart is empty.</td></tr>';
    return;
  }

  cartTable.innerHTML = cart.map((item, index) => `
    <tr>
      <td>${item.material}</td>
      <td>${item.stoneOption}${item.stoneType ? ` (${item.stoneType})` : ''}</td>
      <td>${item.ringSize}</td>
      <td>${item.engravingText || '—'}</td>
      <td><button class="btn btn-sm btn-outline-danger remove-cart-btn" data-index="${index}">Remove</button></td>
    </tr>
  `).join('');
}

stoneRadios.forEach(r => r.addEventListener('change', () => {
  stoneTypeSelect.disabled = getStoneOption() === 'Without Stone';
  if (stoneTypeSelect.disabled) stoneTypeSelect.value = '';
  updatePreview();
}));

[materialSelect, stoneTypeSelect, ringSizeInput, engravingInput].forEach(el =>
  el.addEventListener('input', updatePreview)
);

stoneRadios.forEach(r => r.addEventListener('change', updatePreview));

document.getElementById('saveWishlistBtn').addEventListener('click', () => {
  form.requestSubmit();
});

document.getElementById('reloadBtn').addEventListener('click', loadDesigns);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const err = validateClient();
  if (err) return setMessage('warning', err);

  const payload = getPayload();
  const res = await fetch('/api/designs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) return setMessage('danger', data.error || 'Save failed.');

  setMessage('success', 'Ring saved successfully!');
  await loadDesigns();
});

tableBody.addEventListener('click', async (e) => {
  const btn = e.target.closest('.delete-btn');
  if (!btn) return;

  if (!confirm('Delete this ring design?')) return;

  const res = await fetch(`/api/designs/${btn.dataset.id}`, { method: 'DELETE' });
  const data = await res.json();

  if (!res.ok) return setMessage('danger', data.error || 'Delete failed.');

  setMessage('success', 'Ring deleted.');
  await loadDesigns();
});

document.getElementById('addCartBtn').addEventListener('click', () => {
  const payload = getPayload();

  if (!payload.material) return setMessage('warning', 'Choose a metal first.');
  if (!payload.ringSize) return setMessage('warning', 'Enter ring size first.');
  if (payload.stoneOption === 'With Stone' && !payload.stoneType) return setMessage('warning', 'Choose a stone type.');

  const cart = getCart();
  cart.push(payload);
  saveCart(cart);
  setMessage('success', 'Added to cart.');
  loadCart();
});

cartTable.addEventListener('click', (e) => {
  const btn = e.target.closest('.remove-cart-btn');
  if (!btn) return;

  const cart = getCart();
  cart.splice(Number(btn.dataset.index), 1);
  saveCart(cart);
  setMessage('info', 'Removed from cart.');
  loadCart();
});

stoneTypeSelect.disabled = getStoneOption() === 'Without Stone';
updatePreview();
loadDesigns();
loadCart();