
document.addEventListener("DOMContentLoaded", () => {
    const filtersContainer = document.getElementById("gallery-filters");
    const gridContainer = document.getElementById("gallery-grid");
    
    if (!window.galleryData) {
        gridContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No photos found. Please add photos to the public folders and run update_gallery.py</p>';
        return;
    }

    let activeFilter = "All";

    function renderFilters() {
        filtersContainer.innerHTML = "";
        window.galleryYears.forEach(year => {
            const btn = document.createElement("button");
            btn.textContent = year;
            btn.style.padding = "8px 20px";
            btn.style.borderRadius = "25px";
            btn.style.cursor = "pointer";
            btn.style.fontFamily = "var(--font-primary)";
            btn.style.fontSize = "0.85rem";
            btn.style.fontWeight = "500";
            btn.style.transition = "all 0.3s ease";
            
            if (activeFilter === year) {
                btn.style.border = "2px solid var(--primary)";
                btn.style.background = "var(--primary)";
                btn.style.color = "white";
            } else {
                btn.style.border = "2px solid var(--primary)";
                btn.style.background = "transparent";
                btn.style.color = "var(--primary)";
            }
            
            btn.onclick = () => {
                activeFilter = year;
                renderFilters();
                renderGrid();
            };
            
            filtersContainer.appendChild(btn);
        });
    }

    function renderGrid() {
        gridContainer.innerHTML = "";
        
        const filteredData = activeFilter === "All" 
            ? window.galleryData 
            : window.galleryData.filter(item => item.year === activeFilter);
            
        if (filteredData.length === 0) {
            gridContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No media found for this year.</p>';
            return;
        }

        filteredData.forEach(item => {
            const div = document.createElement("div");
            div.className = "gallery-item";
            
            if (item.type === "video") {
                div.innerHTML = `
                    <video src="${item.src}" controls style="width:100%; height:100%; object-fit:cover;"></video>
                    <div class="gallery-overlay">${item.filename}</div>
                `;
            } else {
                div.innerHTML = `
                    <img src="${item.src}" alt="${item.filename}" loading="lazy">
                    <div class="gallery-overlay">${item.filename}</div>
                `;
            }
            gridContainer.appendChild(div);
        });
    }

    renderFilters();
    renderGrid();
});
