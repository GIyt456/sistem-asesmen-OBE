async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Gagal memuat ${componentPath}`);
        
        const htmlData = await response.text();
        document.getElementById(elementId).innerHTML = htmlData;
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("sidebar-container", "/kaprodi/kaprodi_ti/components/sidebar.html");
    loadComponent("navbar-container", "/kaprodi/kaprodi_ti/components/navbar.html");
});

// Tambahkan fungsi ini agar dropdown bisa diklik
window.toggleDropdown = function(element) {
    // Tutup dropdown lain yang sedang terbuka (opsional, agar rapi)
    let allDropdowns = document.querySelectorAll('.dropdown-container');
    allDropdowns.forEach(dropdown => {
        if(dropdown !== element.nextElementSibling) {
            dropdown.style.display = 'none';
        }
    });

    // Buka/Tutup dropdown yang diklik
    var dropdownContent = element.nextElementSibling;
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }
};

// Tambahkan CSS khusus lewat JS agar dropdown terlihat elegan
const styleDropdown = document.createElement('style');
styleDropdown.innerHTML = `
    .dropdown-container { display: none; background-color: #1e293b; padding: 5px 0; border-radius: 4px; margin-top: 5px; }
    .dropdown-item { color: #cbd5e1 !important; padding: 10px 15px 10px 40px !important; text-decoration: none !important; display: block; font-size: 0.85rem; transition: 0.2s; }
    .dropdown-item:hover { color: #ffc561 !important; background-color: rgba(255, 255, 255, 0.05); }
    .menu-item.has-dropdown { cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
`;
document.head.appendChild(styleDropdown);