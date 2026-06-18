// =========================================================
// MESIN PERAKIT KOMPONEN GLOBAL & LOGIKA SIDEBAR
// =========================================================

async function loadComponent(elementId, fileUrl) {
    try {
        console.log(`[Sistem OBE] Memuat komponen: ${fileUrl}...`); 
        
        const clearCacheUrl = fileUrl + "?v=" + new Date().getTime(); 
        const response = await fetch(clearCacheUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status} saat memuat ${fileUrl}`);
        }
        
        const html = await response.text();
        const targetElement = document.getElementById(elementId);
        
        if (targetElement) {
            targetElement.innerHTML = html;
            console.log(`[Sistem OBE] ✅ Berhasil memuat ke dalam #${elementId}`);
            
            if (fileUrl.includes("sidebar.html") && typeof window.initSmartSidebar === "function") {
                setTimeout(window.initSmartSidebar, 200); 
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
    if(confirm("Apakah Anda yakin ingin keluar dari Sistem OBE?")) {
        localStorage.clear();
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

    if(adminNameEl) adminNameEl.innerText = loginName;
    if(adminRoleEl) adminRoleEl.innerText = prodi === 'si' ? "PRODI SISTEM INFORMASI" : "PRODI TEKNIK INFORMATIKA";
    if(avatarEl) {
        const avatarColor = prodi === 'si' ? '0097a7' : '8b0000'; 
        avatarEl.src = `https://ui-avatars.com/api/?name=${loginName}&background=${avatarColor}&color=fff&bold=true`;
    }

    document.querySelectorAll('.sidebar [data-path]').forEach(el => {
        let path = el.getAttribute('data-path');
        
        if (path === '/admin_config.html' && prodi === 'si') {
            path = '/admin_config_si.html';
        }

        // ==============================================================
        // 🔥 SOLUSI ANTI-DOBEL URL (PERBAIKAN ERROR 404) 🔥
        // ==============================================================
        let cleanPath = path;
        
        // Membersihkan kata 'kaprodi' atau 'kaprodi_si' jika sudah terlanjur ada di HTML
        cleanPath = cleanPath.replace(/^\/?kaprodi\//, '/'); 
        cleanPath = cleanPath.replace(new RegExp(`^\\/?kaprodi_${prodi}\\/`), '/');
        
        // Memastikan rute diawali dengan garis miring (slash)
        if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

        // Gabungkan Base Path dengan rute yang sudah dibersihkan
        let finalUrl = basePath + cleanPath;
        
        // Sapu bersih garis miring dobel (//) yang tidak disengaja
        finalUrl = finalUrl.replace(/\/\//g, '/');
        // ==============================================================

        if(el.tagName.toLowerCase() === 'a') {
            el.href = finalUrl; 
        } else {
            el.onclick = (e) => {
                const ruteInternal = {
                    '/cpl.html': 'cpl',
                    '/cpmk.html': 'cpmk',
                    '/mapping/map_cpl_cpmk.html': 'mapping',
                    '/mapping/map_mk_cpmk.html': 'mapping-mk',
                    '/settings.html': 'reset',
                    '/import_krs.html': prodi === 'si' ? 'krs-upload' : 'krs',
                    '/admin_config_si.html': 'dashboard',
                    '/admin_config.html': 'dashboard'
                };

                const namaTab = ruteInternal[path]; // Gunakan path asli untuk lookup
                
                let elemenTargetAda = false;
                if (namaTab) {
                    elemenTargetAda = document.getElementById('content-' + namaTab) || document.getElementById(namaTab);
                }

                if (typeof window.switchTab === "function" && elemenTargetAda) {
                    e.preventDefault();
                    window.switchTab(namaTab); 
                } else {
                    // Gunakan finalUrl yang sudah anti-error
                    window.location.href = finalUrl; 
                }
            };
        }
    });
};

// =========================================================
// PENGAMAN CSS DROPDOWN
// =========================================================
var styleDropdown = document.createElement('style');
styleDropdown.innerHTML = `
    .dropdown-container { display: none; background-color: #1e293b; padding: 5px 0; border-radius: 4px; margin-top: 5px; }
    .dropdown-item { display: block; padding: 10px 20px; color: #cbd5e1; text-decoration: none; font-size: 0.85rem; transition: 0.2s; }
    .dropdown-item:hover { background-color: rgba(255,255,255,0.05); color: white; padding-left: 25px; }
`;
document.head.appendChild(styleDropdown);