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