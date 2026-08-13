import urllib.request
import json

for lang in ["Hindi", "Marathi", "Bengali", "Tamil", "Telugu"]:
    req = urllib.request.Request(
        "http://localhost:8000/auth/select-language",
        data=json.dumps({"language": lang}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    user_data = json.loads(res.read().decode("utf-8"))
    
    dash_res = urllib.request.urlopen("http://localhost:8000/dashboard")
    dash_data = json.loads(dash_res.read().decode("utf-8"))
    
    first_unit = dash_data.get("units", [])[0]["title"] if dash_data.get("units") else "NONE"
    print(f"Switched to {lang} -> DB user.language_to_learn: '{user_data.get('language_to_learn')}', Dashboard active lang: '{dash_data.get('user', {}).get('language_to_learn')}', Unit 1: '{first_unit}'")
