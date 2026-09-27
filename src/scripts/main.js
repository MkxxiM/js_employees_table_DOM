'use strict';
// Global variables

const headers = document.querySelectorAll('thead th');
const tbody = document.querySelector('tbody');
const trows = [...tbody.querySelectorAll('tr')];

// Table sorting implementation

let clickCounter = 0;

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    clickCounter++;

    if (clickCounter % 2 !== 0) {
      ASCsort(tbody, index);
    } else {
      DESCsort(tbody, index);
    }
  });
});

function ASCsort(table, index) {
  const rows = [...table.querySelectorAll('tr')];

  rows.sort((a, b) => {
    const aElem = a.cells[index].textContent.trim();
    const bElem = b.cells[index].textContent.trim();

    const aElemNum = Number(aElem.replace(/[$,]/g, ''));
    const bElemNum = Number(bElem.replace(/[$,]/g, ''));

    if (!Number.isNaN(aElemNum) && !Number.isNaN(bElemNum)) {
      return aElemNum - bElemNum;
    }

    return aElem.localeCompare(bElem);
  });

  rows.forEach((row) => table.appendChild(row));
}

function DESCsort(table, index) {
  const rows = [...table.querySelectorAll('tr')];

  rows.sort((a, b) => {
    const aElem = a.cells[index].textContent.trim();
    const bElem = b.cells[index].textContent.trim();

    const aElemNum = Number(aElem.replace(/[$,]/g, ''));
    const bElemNum = Number(bElem.replace(/[$,]/g, ''));

    if (!Number.isNaN(aElemNum) && !Number.isNaN(bElemNum)) {
      return bElemNum - aElemNum;
    }

    return bElem.localeCompare(aElem);
  });

  rows.forEach((row) => table.appendChild(row));
}
// End region

// Table row selection
let active = false;

trows.forEach((row) => {
  row.addEventListener('click', () => {
    active = !active;

    if (active) {
      row.classList.add('active');
    } else {
      row.classList.remove('active');
    }
  });
});
// End of region

// Form implementation

const form = document.createElement('form');
const button = document.createElement('button');

function createForm() {
  form.classList.add('new-employee-form');
  button.textContent = 'Save to table';

  for (let i = 0; i < headers.length; i++) {
    form.appendChild(addLabel(i));
  }

  form.appendChild(button);
  document.body.appendChild(form);
}

function addLabel(index) {
  const label = document.createElement('label');

  label.textContent = `${headers[index].textContent}:`;

  label.appendChild(addInput(index));

  return label;
}

function addInput(index) {
  if (index === 2) {
    return addSelect();
  }

  const input = document.createElement('input');

  input.setAttribute('name', headers[index].textContent.toLowerCase());
  input.setAttribute('data-qa', headers[index].textContent.toLowerCase());

  input.setAttribute('type', 'text');
  input.required = true;

  if (input.dataset.qa === 'name') {
    input.setAttribute('minlength', '4');
  }

  if (input.dataset.qa === 'age') {
    input.setAttribute('type', 'number');
    input.setAttribute('min', '18');
    input.setAttribute('max', '90');
  }

  if (input.dataset.qa === 'salary') {
    input.setAttribute('type', 'number');
  }

  return input;
}

function addSelect() {
  const select = document.createElement('select');

  select.name = 'office';
  select.required = true;

  const cityOfficeSet = new Set();

  for (const row of trows) {
    cityOfficeSet.add(row.cells[2].textContent);
  }

  for (const office of cityOfficeSet) {
    const option = document.createElement('option');

    option.setAttribute('value', office);
    option.textContent = `${office}`;

    select.appendChild(option);
  }

  return select;
}

createForm();

// End of region

// Form validation

button.addEventListener('click', (e) => {
  e.preventDefault();

  const newRow = document.createElement('tr');

  for (let i = 0; i < form.length - 1; i++) {
    const cell = document.createElement('td');

    if (i === form.length - 2) {
      const salary = Number(form[i].value);

      cell.textContent = `$${salary.toLocaleString('en-US')}`;
    } else {
      cell.textContent = form[i].value;
    }
    newRow.appendChild(cell);
  }

  if (form.checkValidity()) {
    tbody.appendChild(newRow);
    notification('success');
  } else {
    notification('error');
  }
});

function notification(type) {
  const message = document.createElement('div');

  message.classList.add('notification');
  message.classList.add(type);
  message.setAttribute('data-qa', 'notification');
  document.body.append(message);

  function hide(element) {
    element.style.display = 'none';
  }

  setTimeout(() => hide(message), 2000);
}
