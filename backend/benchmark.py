import urllib.request
import json
import time

def benchmark(url, name, payload=None):
    start = time.perf_counter()
    req_data = json.dumps(payload).encode("utf-8") if payload else None
    headers = {"Content-Type": "application/json"}
    req = urllib.request.Request(url, data=req_data, headers=headers)
    try:
        res = urllib.request.urlopen(req)
        body = res.read()
        elapsed = (time.perf_counter() - start) * 1000
        print(f"[{name}] Response: 200 OK | Time: {elapsed:.2f} ms")
        return body
    except Exception as e:
        elapsed = (time.perf_counter() - start) * 1000
        print(f"[{name}] Error: {e} | Time: {elapsed:.2f} ms")

print("--- BENCHMARKING AUTH & LOGIN ENDPOINTS (127.0.0.1) ---")
benchmark("http://127.0.0.1:8000/auth/guest", "POST /auth/guest", {})
benchmark("http://127.0.0.1:8000/auth/login", "POST /auth/login", {"email": "ashutosh@example.com", "password": "password123"})
benchmark("http://127.0.0.1:8000/auth/me", "GET /auth/me")
benchmark("http://127.0.0.1:8000/dashboard", "GET /dashboard")
