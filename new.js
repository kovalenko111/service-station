function openTab(evt, tabId) {
  
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(tab => {
        tab.classList.remove("active");
    });

    
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.classList.remove("active");
    });


    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add("active");
    }
    
    evt.currentTarget.classList.add("active");
}

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

   
    if (tabId !== 'services' && tabId !== 'staff') {
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
    }
}


function addRowToActiveTable() {
    const val1 = document.getElementById('input1')?.value.trim();
    const val2 = document.getElementById('input2')?.value.trim();
    const val3 = document.getElementById('input3')?.value.trim();

    
    if (!val1 || !val2 || (document.getElementById('input3') && !val3)) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

  
    const activeTableBody = document.querySelector(`#${activeTabId} tbody`);
    if (!activeTableBody) return;

  
    const newRow = document.createElement('tr');

    
    if (activeTabId === 'services') {
        newRow.innerHTML = `<td>${val1}</td><td>${val2}</td><td>${val3}</td>`;
    } else if (activeTabId === 'staff') {
        newRow.innerHTML = `<td>${val1}</td><td>${val2}</td>`;
    }

    
    activeTableBody.appendChild(newRow);

    // Очищаем форму
    document.getElementById('input1').value = '';
    document.getElementById('input2').value = '';
    if (document.getElementById('input3')) {
        document.getElementById('input3').value = '';
    }
}
