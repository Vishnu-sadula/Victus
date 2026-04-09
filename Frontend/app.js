const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Store HTML in a constant
const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Victus</title>
  <style>
    body{font-family:Inter,system-ui,Roboto,Arial;margin:0;background:#f3f6ff;display:flex;align-items:center;justify-content:center;height:100vh}
    .card{background:#fff;padding:20px;border-radius:10px;box-shadow:0 8px 24px rgba(15,23,42,0.06);width:360px}
    h2{margin:0 0 8px;color:#7c3aed}
    label{display:block;font-size:13px;margin-top:10px}
    input{width:100%;padding:10px;border-radius:8px;border:1px solid #e6e9f2;margin-top:6px;box-sizing:border-box}
    button{margin-top:14px;padding:10px 14px;background:linear-gradient(90deg,#7c3aed,#06b6d4);color:#fff;border:0;border-radius:8px;cursor:pointer;width:100%}
    .result{margin-top:12px;padding:10px;background:#f8fafc;border-radius:8px;border:1px solid #eef2ff;font-size:14px;white-space:pre-wrap;word-break:break-all}
  </style>
</head>
<body>
  <div class="card">
    <h2>Victus . frontend</h2>
    <form id="userForm">
      <label for="username">Username</label>
      <input id="username" name="username" type="text" required placeholder="username">

      <label for="job_role">Job Role</label>
      <input id="job_role" name="job_role" type="text" placeholder="job role">

      <label for="user_id">ID</label>
      <input id="user_id" name="user_id" type="number" placeholder="user id">

      <button type="submit">Submit</button>
    </form>
    <div id="result" class="result" style="display:none"></div>
  </div>

  <script>
    const form = document.getElementById('userForm');
    const result = document.getElementById('result');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      result.style.display = 'none';
      const formData = new FormData(form);
      const data = new URLSearchParams(formData);

      try {
        const resp = await fetch('/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: data
        });

        const ct = resp.headers.get('content-type') || '';
        let output;
        if (ct.includes('application/json')) {
          const json = await resp.json();
          output = JSON.stringify(json, null, 2);
        } else {
          output = await resp.text();
        }

        result.textContent = output;
        result.style.display = 'block';
      } catch (err) {
        result.textContent = 'Error: ' + err.message;
        result.style.display = 'block';
      }
    });
  </script>
</body>
</html>
`;

// Serve the HTML string directly
app.get('/', (req, res) => {
  res.send(HTML_CONTENT);
});

app.post('/submit', async (req, res) => {
  const { username = '', job_role = '', user_id = '' } = req.body;

  try {
    const resp = await fetch('http://127.0.0.1:5000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, job_role, user_id })
    });

    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
        return res.json(await resp.json());
    }

    if (resp.ok) {
      const data = await resp.json();
      // Send only the message string, not the whole JSON object
      return res.send(data.message || "Data saved successfully!");
    }

    return res.send(await resp.text());
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(502).send('Error contacting backend: ' + err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
