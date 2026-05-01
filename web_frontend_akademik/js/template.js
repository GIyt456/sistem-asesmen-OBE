// Fungsi untuk memuat file HTML eksternal dan memasukkannya ke dalam elemen tertentu
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Gagal memuat ${componentPath}`);
        
        const htmlData = await response.text();
        document.getElementById(elementId).innerHTML = htmlData;
    } catch (error) {
        console.error(error);
        document.getElementById(elementId).innerHTML = `<p style="color:red;">Error loading component</p>`;
    }
}

// Saat halaman HTML selesai dimuat, jalankan perintah rakit komponen
document.addEventListener("DOMContentLoaded", () => {
    // Memanggil sidebar dan memasukkannya ke dalam div dengan id "sidebar-container"
    loadComponent("sidebar-container", "/components/sidebar.html");
    
    // Memanggil navbar dan memasukkannya ke dalam div dengan id "navbar-container"
    loadComponent("navbar-container", "/components/navbar.html");
});