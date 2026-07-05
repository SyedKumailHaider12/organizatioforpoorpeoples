import os
import re

base_dir = r"d:\Hospital Projects\OFPP-Website"

gallery_html_path = os.path.join(base_dir, "pages", "gallery.html")

with open(gallery_html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the static filter buttons
new_filters = '''<!-- Gallery Filter -->
            <div id="gallery-filters" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 40px; flex-wrap: wrap;">
                <!-- Filters injected by JS -->
            </div>'''
content = re.sub(r'<!-- Gallery Filter -->.*?</div>', new_filters, content, flags=re.DOTALL, count=1)

# Replace the gallery grid contents
new_grid = '''<div class="gallery-grid" id="gallery-grid">
                <!-- Gallery items injected by JS -->
            </div>'''
content = re.sub(r'<div class="gallery-grid">.*?</div>\s*<!-- Note -->', new_grid + '\n            <!-- Note -->', content, flags=re.DOTALL)

# Inject JS scripts before </body>
scripts = '''
    <script src="../js/gallery-data.js"></script>
    <script src="../js/gallery.js"></script>
'''
if "gallery-data.js" not in content:
    content = content.replace('</body>', scripts + '\n</body>')

with open(gallery_html_path, "w", encoding="utf-8") as f:
    f.write(content)

# Create gallery.js
gallery_js_path = os.path.join(base_dir, "js", "gallery.js")
os.makedirs(os.path.dirname(gallery_js_path), exist_ok=True)
with open(gallery_js_path, "w", encoding="utf-8") as f:
    f.write('''
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
''')

# Create update_gallery.py
update_py_path = os.path.join(base_dir, "update_gallery.py")
with open(update_py_path, "w", encoding="utf-8") as f:
    f.write('''import os
import json
import glob

base_dir = r"d:\Hospital Projects\OFPP-Website"
public_dir = os.path.join(base_dir, "public")

years = set()
gallery_data = []

# Scan for folders that look like years (2020-2030)
if os.path.exists(public_dir):
    for entry in os.listdir(public_dir):
        if entry.isdigit() and len(entry) == 4:
            year_path = os.path.join(public_dir, entry)
            if os.path.isdir(year_path):
                years.add(entry)
                
                # Scan for media files
                for file_entry in os.listdir(year_path):
                    file_path = os.path.join(year_path, file_entry)
                    if os.path.isfile(file_path):
                        ext = os.path.splitext(file_entry)[1].lower()
                        if ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                            mtype = "image"
                        elif ext in ['.mp4', '.webm', '.ogg', '.mov']:
                            mtype = "video"
                        else:
                            continue
                            
                        # Sort by modified time later
                        mtime = os.path.getmtime(file_path)
                        
                        gallery_data.append({
                            "year": entry,
                            "src": f"../public/{entry}/{file_entry}",
                            "type": mtype,
                            "filename": file_entry,
                            "mtime": mtime
                        })

# Sort newest first
gallery_data.sort(key=lambda x: x['mtime'], reverse=True)

# Remove mtime before writing
for item in gallery_data:
    del item['mtime']

sorted_years = sorted(list(years), reverse=True)
final_years = ["All"] + sorted_years

js_content = f"window.galleryYears = {json.dumps(final_years)};\\n"
js_content += f"window.galleryData = {json.dumps(gallery_data, indent=2)};\\n"

data_js_path = os.path.join(base_dir, "js", "gallery-data.js")
os.makedirs(os.path.dirname(data_js_path), exist_ok=True)
with open(data_js_path, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Gallery updated! Found {len(gallery_data)} items across {len(years)} years.")
print("The website will now show the latest files automatically.")
''')

print("Setup completed. You can now use update_gallery.py")
