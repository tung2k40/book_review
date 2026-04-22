import urllib.request
import json

data = json.dumps({"name": "Test Author"}).encode('utf-8')
req = urllib.request.Request("http://localhost:8000/api/authors/", data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"Error {e.code}: {e.read().decode()}")
