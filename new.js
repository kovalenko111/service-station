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