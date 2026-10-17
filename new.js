
let activeTabId = 'services';


function openTab(evt, tabId) {
    activeTabId = tabId; 

    
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(tab => tab.classList.remove("active"));

    
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => btn.classList.remove("active"));

    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add("active");
    }
    evt.currentTarget.classList.add("active");

    
    adjustFormInputs(tabId);
}


function adjustFormInputs(tabId) {
    const formBlock = document.getElementById('add-row-form');
    const formTitle = document.getElementById('form-title');
    const formInputs = document.getElementById('form-inputs');

    
    if (tabId === 'contacts') {
        formBlock.style.display = 'none';
        return;
    }

    
    formBlock.style.display = 'block';

    if (tabId === 'services') {
        formTitle.innerText = 'Додати нову послугу';
        formInputs.innerHTML = `
            <input type="text" id="input1" placeholder="Найменування" required>
            <input type="text" id="input2" placeholder="Ціна" required>
            <input type="text" id="input3" placeholder="Час роботи" required>
        `;
    } else if (tabId === 'staff') {
        formTitle.innerText = 'Додати нового співробітника';
        formInputs.innerHTML = `
            <input type="text" id="input1" placeholder="ПІБ Співробітника" required>
            <input type="text" id="input2" placeholder="Посада / Спеціалізація" required>
        `;
    } else if (tabId === 'warranty') {
        formTitle.innerText = 'Додати нове гарантійне зобов\'язання';
        formInputs.innerHTML = `
            <input type="text" id="input1" placeholder="Вид послуги / Запчастини" required>
            <input type="text" id="input2" placeholder="Термін гарантії" required>
            <input type="text" id="input3" placeholder="Умова" required>
        `;
    } else if (tabId === 'regulations') {
        formTitle.innerText = 'Додати новий пункт регламенту';
        formInputs.innerHTML = `
            <input type="text" id="input1" placeholder="Що замінюємо / Перевіряємо" required>
            <input type="text" id="input2" placeholder="Періодичність" required>
            <input type="text" id="input3" placeholder="Примітка" required>
        `;
    } else if (tabId === 'packages') {
        formTitle.innerText = 'Додати новий пакет регулярного ТО';
        formInputs.innerHTML = `
            <input type="text" id="input1" placeholder="Пакет послуг" required>
            <input type="text" id="input2" placeholder="Що входить у вартість?" required>
            <input type="text" id="input3" placeholder="Рекомендований інтервал" required>
            <input type="text" id="input4" placeholder="Вартість робіт (грн)" required>
        `;
    }
}


function addRowToActiveTable() {
    const val1 = document.getElementById('input1')?.value.trim();
    const val2 = document.getElementById('input2')?.value.trim();
    const val3 = document.getElementById('input3')?.value.trim();
    const val4 = document.getElementById('input4')?.value.trim(); 
    
    if (!val1 || !val2) {
        alert('Будь ласка, заповніть обов\'язкові поля!');
        return;
    }

    const activeTableBody = document.querySelector(`#${activeTabId} tbody`);
    if (!activeTableBody) return;

    const newRow = document.createElement('tr');

    
    if (activeTabId === 'services') {
        newRow.innerHTML = `
            <td>${val1}</td><td>${val2}</td><td>${val3 || ''}</td>
            <td><button onclick="deleteRow(this, 'packages')">❌</button></td>`;
    } else if (activeTabId === 'staff') {
        newRow.innerHTML = `
            <td>${val1}</td><td>${val2}</td>
            <td><button onclick="deleteRow(this)">❌</button></td>`;
    } else if (activeTabId === 'warranty') {
        newRow.innerHTML = `
            <td>${val1}</td><td>${val2}</td><td>${val3 || ''}</td>
            <td><button onclick="deleteRow(this)">❌</button></td>`;
    } else if (activeTabId === 'regulations') {
        newRow.innerHTML = `
            <td>${val1}</td><td>${val2}</td><td>${val3 || ''}</td>
            <td><button onclick="deleteRow(this)">❌</button></td>`;
    } else if (activeTabId === 'packages') {
        
        newRow.innerHTML = `
            <td><strong>${val1}</strong></td><td>${val2}</td><td>${val3 || ''}</td><td>${val4 || ''}</td>
            <td><button onclick="deleteRow(this)">❌</button></td>`;
    }

    
    activeTableBody.appendChild(newRow);

    
    if (document.getElementById('input1')) document.getElementById('input1').value = '';
    if (document.getElementById('input2')) document.getElementById('input2').value = '';
    if (document.getElementById('input3')) document.getElementById('input3').value = '';
    if (document.getElementById('input4')) document.getElementById('input4').value = '';
}


function deleteRow(button, connectedTableId) {
    if (connectedTableId) {
        const connectedTable = document.getElementById(connectedTableId);
        if (connectedTable) {
            const currentRow = button.closest('tr');
            const rowText = currentRow.cells[0].innerText.trim(); 
            
            
            const isUsed = connectedTable.innerText.includes(rowText);
            
            if (isUsed) {
                alert("Помилка! Дані використовуються в іншій таблиці (" + connectedTableId + "), тому наразі видалити їх неможливо.");
                return; 
            }
        }
    }
    
   
    button.closest('tr').remove();
}


document.addEventListener('click', function(e) {
    const cell = e.target.closest('td');
    if (!cell || cell.querySelector('button') || cell.querySelector('input')) return;
    if (cell.hasAttribute('rowspan')) return; 

    const oldValue = cell.innerText.trim();
    
    cell.innerHTML = `<input type="text" style="width:90%; padding:4px;" value="${oldValue}">`;
    const input = cell.querySelector('input');
    input.focus();

    function save() {
        const newValue = input.value.trim();
        cell.innerText = newValue || oldValue;
    }

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') save();
    });

    input.addEventListener('blur', save);
});
