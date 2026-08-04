#!/usr/bin/env python3
"""Tiny HTTP server with SPA fallback (any unknown path serves index.html)."""
import http.server
import os
import sys
from urllib.parse import unquote

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = unquote(self.path.split('?')[0])
        if path == '/' or path == '':
            self.path = '/index.html'
            return super().send_head()
        translated = self.translate_path(path)
        if not os.path.isfile(translated):
            self.path = '/index.html'
        return super().send_head()

    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    os.chdir(sys.argv[1] if len(sys.argv) > 1 else '.')
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
    server = http.server.HTTPServer(('', port), SPAHandler)
    print(f'Serving {os.getcwd()} on :{port} (SPA fallback enabled)')
    server.serve_forever()
