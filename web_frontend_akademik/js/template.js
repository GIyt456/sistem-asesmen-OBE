// =========================================================
// MESIN PERAKIT KOMPONEN GLOBAL & LOGIKA SIDEBAR
// =========================================================


async function loadComponent(elementId, fileUrl) {
    try {
        // Trik anti-cache agar selalu memuat file terbaru
        const clearCacheUrl = fileUrl + "?v=" + new Date().getTime(); 
        const response = await fetch(clearCacheUrl);
        if (!response.ok) throw new Error(`Gagal memuat ${fileUrl}`);
        
        const html = await response.text();
        const targetElement = document.getElementById(elementId);
        
        if (targetElement) {
            targetElement.innerHTML = html;
            
            // JIKA SIDEBAR BERHASIL DIMUAT, LANGSUNG JALANKAN INISIALISASINYA
            if (fileUrl.includes("sidebar.html") && typeof window.initSmartSidebar === "function") {
                setTimeout(window.initSmartSidebar, 150);
            }
        }
    } catch (error) {
        console.error("❌ Error Template:", error);
    }
}

function inisialisasiKomponenGlobal() {
    if (document.getElementById("sidebar-container")) {
        loadComponent("sidebar-container", "/components/sidebar.html");
    }
    if (document.getElementById("navbar-container")) {
        loadComponent("navbar-container", "/components/navbar.html");
    }
}

// Jalankan perakitan saat DOM siap
document.addEventListener("DOMContentLoaded", inisialisasiKomponenGlobal);

// =========================================================
// FUNGSI ANIMASI & NAVIGASI SIDEBAR (GLOBAL)
// =========================================================

window.toggleDropdown = function(menuId, chevronId) {
    const menu = document.getElementById(menuId);
    const chevron = document.getElementById(chevronId);
    if (!menu || !chevron) return;
    
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'flex';
        chevron.style.transform = 'rotate(180deg)';
    } else {
        menu.style.display = 'none';
        chevron.style.transform = 'rotate(0deg)';
    }
};

window.toggleDropdownPlus = function(element) {
    const dropdownContainer = element.nextElementSibling;
    const icon = element.querySelector('.arrow-icon');
    if (!dropdownContainer || !icon) return;

    if (dropdownContainer.style.display === "flex" || dropdownContainer.style.display === "block") {
        dropdownContainer.style.display = "none";
        icon.style.transform = "rotate(0deg)";
    } else {
        dropdownContainer.style.display = "flex";
        dropdownContainer.style.flexDirection = "column";
        icon.style.transform = "rotate(180deg)";
    }
};

window.logout = function() {
    if(confirm("Apakah Anda yakin ingin keluar?")) {
        localStorage.clear();
        // Pastikan path ke halaman login ini sesuai dengan folder Anda
        window.location.replace('/login/login.html'); 
    }
};

window.initSmartSidebar = function() {
    const prodi = localStorage.getItem("prodi_aktif") || "ti"; 
    const loginName = localStorage.getItem("user_login") || `Kaprodi ${prodi.toUpperCase()}`;
    const basePath = `/kaprodi/kaprodi_${prodi}`; 

    const adminNameEl = document.getElementById("adminName");
    const adminRoleEl = document.getElementById("adminRole");
    const avatarEl = document.getElementById("sidebarAvatar");
    const sidebarEl = document.querySelector('.sidebar');
    if (sidebarEl && prodi === 'si') {
        sidebarEl.classList.add('theme-si');
    }

    // Atur Profil
    if(adminNameEl) adminNameEl.innerText = loginName;
    if(adminRoleEl) adminRoleEl.innerText = prodi === 'si' ? "PRODI SISTEM INFORMASI" : "PRODI TEKNIK INFORMATIKA";
    if(avatarEl) {
        const avatarColor = prodi === 'si' ? '1e3a8a' : '8b0000'; 
        avatarEl.src = `https://ui-avatars.com/api/?name=${loginName}&background=${avatarColor}&color=fff&bold=true`;
    }

    // Atur Link Dinamis & SPA Router
    document.querySelectorAll('.sidebar [data-path]').forEach(el => {
        let path = el.getAttribute('data-path');
        
        // Jika Kaprodi SI klik Home, otomatis ganti rutenya ke file "_si"
        if (path === '/admin_config.html' && prodi === 'si') {
            path = '/admin_config_si.html';
        }

        if(el.tagName.toLowerCase() === 'a') {
            el.href = basePath + path; 
        } else {
            el.onclick = (e) => {
                // Peta rute "Tanpa Loading" (Single Page Application)
                const ruteInternal = {
                    '/cpl.html': 'cpl',
                    '/cpmk.html': 'cpmk',
                    '/mapping/map_cpl_cpmk.html': 'mapping',
                    '/mapping/map_mk_cpmk.html': 'mapping-mk',
                    '/settings.html': 'reset',
                    '/import_krs.html': prodi === 'si' ? 'krs-upload' : 'krs', // Beda nama ID antara SI & TI
                    '/admin_config_si.html': 'dashboard',
                    '/admin_config.html': 'dashboard'
                };

                const namaTab = ruteInternal[path];
                
                // ✨ KUNCI PERBAIKAN ERROR: Cek apakah elemen target beneran ADA di file HTML ini? ✨
                let elemenTargetAda = false;
                if (namaTab) {
                    elemenTargetAda = document.getElementById('content-' + namaTab) || document.getElementById(namaTab);
                }

                // Jika fungsi pindah tab tersedia DAN elemennya memang ada di file ini...
                if (typeof window.switchTab === "function" && elemenTargetAda) {
                    e.preventDefault();
                    window.switchTab(namaTab); // Pindah tab dengan mulus
                } else {
                    // Jika elemennya tidak ada, berarti itu file terpisah. Lakukan pindah halaman normal!
                    window.location.href = basePath + path; 
                }
            };
        }
    });
};

// =========================================================
// PENGAMAN CSS
// =========================================================
var styleDropdown = document.createElement('style');
styleDropdown.innerHTML = `
    .dropdown-container { display: none; background-color: #1e293b; padding: 5px 0; border-radius: 4px; margin-top: 5px; }
    .dropdown-item { display: block; padding: 10px 20px; color: #cbd5e1; text-decoration: none; font-size: 0.85rem; transition: 0.2s; }
    .dropdown-item:hover { background-color: rgba(255,255,255,0.05); color: white; padding-left: 25px; }
`;
document.head.appendChild(styleDropdown);