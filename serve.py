"""Preview the whole site locally, the way GitHub Pages serves it: one address with the home page at /,
and the Property finder: its city overview at /RE-screening/ and its per-city property ranking at /RE-jkt/.

    python serve.py              # http://localhost:8000
    python serve.py 8080         # another port

Expects RE-screening and RE-jkt checked out next to this folder (any capitalisation). A section
whose checkout is missing is left out; the menu still links to it.
"""
import http.server
import os
import sys
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PARENT = ROOT.parent


def find(name):
    for p in PARENT.iterdir():
        if p.name.lower() == name.lower() and (p / "dashboard").is_dir():
            return p / "dashboard"
    return None


MOUNTS = {"/re-screening/": find("RE-screening"), "/re-jkt/": find("RE-jkt")}


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = path.split("?", 1)[0].split("#", 1)[0]
        for prefix, folder in MOUNTS.items():
            if folder and clean.lower().startswith(prefix):
                return str(folder / clean[len(prefix):])
        return str(ROOT / "site" / clean.lstrip("/"))

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    for prefix, folder in MOUNTS.items():
        print(f"{prefix:16} {folder or 'not found next to this folder'}")
    url = f"http://localhost:{port}/"
    print(f"Serving {url}  (Ctrl+C to stop)")
    if not os.environ.get("NO_BROWSER"):
        webbrowser.open(url)
    http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()


if __name__ == "__main__":
    main()
