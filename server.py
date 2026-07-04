#!/usr/bin/env python3
import http.server, os

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()
    def log_message(self, *a): pass

os.chdir(os.path.dirname(os.path.abspath(__file__)))
http.server.HTTPServer(("", 4000), NoCacheHandler).serve_forever()
