from flask import Flask, request, jsonify

app = Flask(__name__)

# This list stays in memory while the server is running
USER_DATA = []

CSS = """
<style>
    body { font-family: 'Segoe UI', sans-serif; background-color: white; color: BlueViolet; padding: 20px; }
    .container { max-width: 500px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 15px; }
    h1, h2 { text-align: center; }
    label { font-weight: bold; display: block; color: Black; margin-top: 10px; }
    input { width: 100%; padding: 12px; margin-bottom: 10px; border: 2px solid BlueViolet; border-radius: 8px; box-sizing: border-box; }
    button { width: 100%; background-color: BlueViolet; color: white; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
    .data-log { margin-top: 30px; border-top: 2px solid #f0f0f0; padding-top: 20px; }
    .entry { background: #f9f0ff; padding: 10px; border-radius: 5px; margin-bottom: 5px; color: black; font-size: 0.9rem; }
</style>
"""

@app.route("/", methods=["GET", "POST"])
def index():
    name, job, user_id, email_id = "Guest", "Unknown role", "N/A", "Unknown"

    if request.method == "POST":
        if request.is_json:
            data = request.get_json()
            name = data.get("username", name)
            job = data.get("job_role", job)
            user_id = data.get("user_id", user_id)
            email_id = data.get("email_id", email_id)
        else:
            # FIX: Use request.form and check naming
            name = request.form.get("username", name)
            job = request.form.get("job_role", job)
            user_id = request.form.get("user_id", user_id)
            email_id = request.form.get("email_id", email_id) # Matches lowercase now
        
        # FIX: Added email to the dictionary
        USER_DATA.append({"name": name, "job": job, "id": user_id, "email": email_id})

        if request.is_json:
            return jsonify({"status": "success", "message": f"Saved {name}"})

    # Update HTML generator to include email
    entries_html = "".join([
        f'<div class="entry"><b>{u["name"]}</b> (ID: {u["id"]}) - {u["job"]} <br><small>{u["email"]}</small></div>' 
        for u in reversed(USER_DATA)
    ])

    return f"""
    <!DOCTYPE html>
    <html>
    <head><title>Victus Backend</title>{CSS}</head>
    <body>
        <div class="container">
            <h1>Victus · Backend</h1>
            <form method="POST">
                <label>Username</label><input name="username" type="text" required>
                <label>Job Role</label><input name="job_role" type="text">
                <label>ID</label><input name="user_id" type="number">
                <label>Email Id</label><input name="email_Id" type="text">
                <button type="submit">Add User</button>
            </form>

            <div class="data-log">
                <h2>Stored Records ({len(USER_DATA)})</h2>
                {entries_html if USER_DATA else "<p style='text-align:center'>No data yet.</p>"}
            </div>
        </div>
    </body>
    </html>
    """

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
