import urllib.request
import json

lesson_ids = [1, 2, 6, 26, 51, 76, 101, 126, 151, 176, 201, 226, 251, 276, 301, 326, 351, 376, 401, 426, 451, 476, 501, 526, 551, 576, 601]

with open("exercise_audit.txt", "w", encoding="utf-8") as f:
    for lid in lesson_ids:
        try:
            url = f"http://localhost:8000/lessons/{lid}"
            res = urllib.request.urlopen(url)
            data = json.loads(res.read().decode("utf-8"))
            f.write(f"=== Lesson ID {lid}: {data.get('title')} ===\n")
            exercises = data.get("exercises", [])
            f.write(f"Total Exercises: {len(exercises)}\n")
            for ex in exercises[:4]:
                opts = [o.get("text") for o in ex.get("options", [])]
                f.write(f"  Ex ID {ex.get('id')}: Type={ex.get('type')}, Q='{ex.get('question_text')}', Ans='{ex.get('correct_answer')}', Opts={opts}\n")
            f.write("\n")
        except Exception as e:
            f.write(f"Error checking lesson {lid}: {e}\n\n")

print("Audit output written to exercise_audit.txt")
