import re
from pathlib import Path

src = Path(__file__).resolve().parents[1] / "css" / "style.css"
dst = src.with_name("style.min.css")
css = re.sub(r"/\*[\s\S]*?\*/", "", src.read_text())
css = re.sub(r"\s+", " ", css)
css = re.sub(r"\s*([{}:;,>+~])\s*", r"\1", css).strip()
dst.write_text(css)
print(f"Wrote {dst} ({len(css)//1024}KB)")
