// Змінна для відстеження активного табу
let activeTabId = 'services';

// 1 та 2. ЗБЕРЕЖЕННЯ ТА ЗАВАНТАЖЕННЯ З LOCALSTORAGE
function saveAllTablesToStorage() {
    let tablesData = {};
    // Проходимо по всіх таблицях, крім контактів
    const tables = document.querySelectorAll('.tab-content:not(#contacts)');
    tables.forEach(table => {
        let rowsData = [];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let cellsData = [];
            // Збираємо текст з усіх комірок, крім останньої (де кнопка видалення)
            for (let i = 0; i < row.cells.length; i++) {
                if (row.cells[i].querySelector('button')) continue;
                cellsData.push(row.cells[i].innerText.trim());
            }
            rowsData.push(cellsData);
        });
        tablesData[table.id] = rowsData;
    });
    
    // Записуємо в LocalStorage
    localStorage.setItem('sto_tables_cache', JSON.stringify(tablesData));
}

function loadAllTablesFromStorage() {
    const cachedData = localStorage.getItem('sto_tables_cache');
    if (!cachedData) {
        // Якщо в пам'яті нічого немає, зберігаємо поточні дані з HTML (перший запуск)
        saveAllTablesToStorage();
        updateSelectOptions();
        return;
    }

    const tablesData = JSON.parse(cachedData);
    
    // Відновлюємо дані в HTML для кожної таблиці
    for (let tableId in tablesData) {
        const table = document.getElementById(tableId);
        if (!table) continue;
        const tbody = table.querySelector('tbody');
        if (!tbody) continue;

        tbody.innerHTML = ''; // Очищаємо таблицю

        tablesData[tableId].forEach(rowData => {
            const tr = document.createElement('tr');
            
            // Наповнюємо комірки текстом
            rowData.forEach(cellText => {
                const td = document.createElement('td');
                // Додаємо клас для редагування, якщо це не перша колонка Пакетів ТО (завдання 4)
                if (tableId !== 'packages' || rowData.indexOf(cellText) !== 1) {
                    td.className = 'editable';
                }
                td.innerText = cellText;
                tr.appendChild(td);
            });

            // Додаємо кнопку видалення назад у рядок
            const deleteTd = document.createElement('td');
            if (tableId === 'services') {
                deleteTd.innerHTML = `<button onclick="deleteRow(this, 'packages')">❌</button>`;
            } else {
                deleteTd.innerHTML = `<button onclick="deleteRow(this)">❌</button>`;
            }
            tr.appendChild(deleteTd);
            tbody.appendChild(tr);
        });
    }
    updateSelectOptions();
}

// 3. АВТОМАТИЧНА СИНХРОНІЗАЦІЯ ВКЛАДОК
window.addEventListener('storage', function(e) {
    if (e.key === 'sto_tables_cache') {
        loadAllTablesFromStorage();
    }
});

// Переключення табів
function openTab(evt, tabId) {
    activeTabId = tabId;
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add("active");
    if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");

    adjustFormInputs(tabId);
}

// 4. ПРИВ'ЯЗКА У ВИГЛЯДІ ВИПАДНОГО СПИСКУ (SELECT)
function updateSelectOptions() {
    // Збираємо всі назви послуг з першої таблиці
    const servicesRows = document.querySelectorAll('#services tbody tr');
    let servicesList = [];
    servicesRows.forEach(row => {
        if (row.cells[0]) servicesList.push(row.cells[0].innerText.trim());
    });

    window.currentServicesList = servicesList;

    // Якщо зараз відкрита вкладка пакетів ТО, оновлюємо список у формі
    if (activeTabId === 'packages') {
        const container = document.getElementById('input2-container');
        if (container) {
            let optionsHtml = servicesList.map(s => `<option value="${s}">${s}</option>`).join('');
            if (!optionsHtml) optionsHtml = '<option value="">Спочатку додайте послуги!</option>';
            container.innerHTML = `<select id="input2" style="padding:6px; margin-right:5px;">${optionsHtml}</select>`;
        }
    }
}

function adjustFormInputs(tabId) {
    const formBlock = document.getElementById('add-row-form');
    const formTitle = document.getElementById('form-title');
    const container = document.getElementById('input2-container');

    if (!formBlock) return;
    if (tabId === 'contacts') { formBlock.style.display = 'none'; return; }
    formBlock.style.display = 'block';

    // Повертаємо звичайний інпут за замовчуванням
    if (container) {
        container.innerHTML = `<input type="text" id="input2" placeholder="Поле 2" required>`;
    }

    const inp1 = document.getElementById('input1');
    const inp2 = document.getElementById('input2');
    const inp3 = document.getElementById('input3');
    const inp4 = document.getElementById('input4');

    // Скидаємо видимість полів
    if (inp3) inp3.style.display = 'inline-block';
    if (inp4) inp4.style.display = 'none';

    if (tabId === 'services') {
        formTitle.innerText = 'Додати нову послугу';
        if (inp1) inp1.placeholder = 'Найменування';
        if (inp2) inp2.placeholder = 'Ціна';
        if (inp3) inp3.placeholder = 'Час роботи';
    } else if (tabId === 'staff') {
        formTitle.innerText = 'Додати нового співробітника';
        if (inp1) inp1.placeholder = 'ПІБ Співробітника';
        if (inp2) inp2.placeholder = 'Посада';
        if (inp3) inp3.style.display = 'none';
    } else if (tabId === 'packages') {
        formTitle.innerText = 'Додати новий пакет ТО';
        if (inp1) inp1.placeholder = 'Пакет послуг';
        if (inp3) inp3.placeholder = 'Інтервал';
        if (inp4) inp4.style.display = 'inline-block';
        if (inp4) inp4.placeholder = 'Вартість (грн)';
        
        // Перетворюємо друге поле на випадний список з послугами
        updateSelectOptions();
    } else {
        formTitle.innerText = 'Додати рядок';
        if (inp1) inp1.placeholder = 'Поле 1';
        if (inp2) inp2.placeholder = 'Поле 2';
        if (inp3) inp3.placeholder = 'Поле 3';
    }
}

// Додавання рядка
function addRowToActiveTable() {
    const val1 = document.getElementById('input1')?.value.trim();
    const val2 = document.getElementById('input2')?.value.trim();
    const val3 = document.getElementById('input3')?.value.trim();

    if (!val1 || !val2) {
        alert('Будь ласка, заповніть поля!');
        return;
    }

    const activeTableBody = document.querySelector(`#${activeTabId} tbody`);
    if (!activeTableBody) return;

    const newRow = document.createElement('tr');

    if (activeTabId === 'services') {
        newRow.innerHTML = `
            <td>${val1}</td><td>${val2}</td><td>${val3 || ''}</td>
            <td><button onclick="deleteRow(this, 'packages')">❌</button></td>`;
    } 
    else if (activeTabId === 'packages') {
        // 1. Собираем все услуги из первой таблицы, чтобы сделать из них выпадающий список
        const servicesRows = document.querySelectorAll('#services tbody tr');
        let optionsHtml = '';
        servicesRows.forEach(row => {
            if (row.cells.length > 0) {
                const name = row.cells[0].innerText.trim();
                optionsHtml += `<option value="${name}">${name}</option>`;
            }
        });

        // 2. Создаем строку, где вместо текста во второй ячейке будет список <select>
        newRow.innerHTML = `
            <td>${val1}</td>
            <td>
                <select onchange="saveAllTablesToStorage()" style="padding:4px; width:100%;">
                    ${optionsHtml}
                </select>
            </td>
            <td>${val3 || ''}</td>
            <td><button onclick="deleteRow(this)">❌</button></td>`;
    } 
    else {
        newRow.innerHTML = `
            <td>${val1}</td><td>${val2}</td><td>${val3 || ''}</td>
            <td><button onclick="deleteRow(this)">❌</button></td>`;
    }

    activeTableBody.appendChild(newRow);
    
    // Сохраняем изменения в localStorage
    if (typeof saveAllTablesToStorage === 'function') saveAllTablesToStorage();

    // Очищаем форму
    if (document.getElementById('input1')) document.getElementById('input1').value = '';
    if (document.getElementById('input2')) document.getElementById('input2').value = '';
    if (document.getElementById('input3')) document.getElementById('input3').value = '';
}

// Видалення рядка з перевіркою зв'язків
function deleteRow(button, connectedTableId) {
    const currentRow = button.closest('tr');
    if (!currentRow) return;

    if (connectedTableId) {
        const connectedTable = document.getElementById(connectedTableId);
        if (connectedTable) {
            const textToCheck = currentRow.cells[0].innerText.trim();
            // Перевіряємо, чи є назва послуги в таблиці пакетів ТО
            if (connectedTable.innerText.includes(textToCheck)) {
                alert("Помилка! Дані '" + textToCheck + "' використовуються в іншій таблиці (Пакети ТО), тому наразі видалити їх неможливо.");
                return;
            }
        }
    }
    
    currentRow.remove();
    saveAllTablesToStorage(); // Оновлюємо кеш пам'яті після видалення
    updateSelectOptions();
}

// Зміна даних у комірках по кліку
document.addEventListener('click', function(e) {
    const cell = e.target.closest('td');
    if (!cell || cell.querySelector('button') || cell.querySelector('input')) return;
    if (cell.hasAttribute('rowspan')) return;
    
    // Забороняємо вручну редагувати прив'язану комірку списку в Пакетах ТО (Пункт 4)
    if (cell.closest('table').id === 'packages' && cell.cellIndex === 1) return;

    const oldValue = cell.innerText.trim();
    cell.innerHTML = `<input type="text" style="width:90%; padding:4px;" value="${oldValue}">`;
    const input = cell.querySelector('input');
    input.focus();

    function save() {
        const newValue = input.value.trim();
        cell.innerText = newValue || oldValue;
        saveAllTablesToStorage(); // Записуємо зміни комірки в LocalStorage
        updateSelectOptions();
    }

        // Сохраняем по нажатию на Enter
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') save();
    }); // <-- ТУТ: Просто закрываем круглую скобку и ставим точку с запятой

    // Сохраняем, если кликнули в любом другом месте экрана
    input.addEventListener('blur', save);
}); // <-- Эта скобка закрывает весь обработчик событий клика document.addEventListener('click', ...)


