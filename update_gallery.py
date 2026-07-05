import os
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

js_content = f"window.galleryYears = {json.dumps(final_years)};\n"
js_content += f"window.galleryData = {json.dumps(gallery_data, indent=2)};\n"

data_js_path = os.path.join(base_dir, "js", "gallery-data.js")
os.makedirs(os.path.dirname(data_js_path), exist_ok=True)
with open(data_js_path, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Gallery updated! Found {len(gallery_data)} items across {len(years)} years.")
print("The website will now show the latest files automatically.")
