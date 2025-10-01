
import http.server
import socketserver
import json

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        # Format the data as a JavaScript export
        js_content = f"export const articles = {json.dumps(data, indent=2)};"
        
        with open('src/data/articles.js', 'w') as f:
            f.write(js_content)
            
        self.send_response(200)
        self.end_headers()

PORT = 8000
with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
