const express = require('express');
const Airtable = require('airtable');
const path = require('path');
require('dotenv').config();


const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Airtable config
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// API ROUTES
app.get('/records', (req, res) => {
  const records = [];

  base('Tasks')
    .select({ maxRecords: 200, sort: [{ field: 'Created time', direction: 'desc' }] })
    .eachPage(
      (pageRecords, fetchNextPage) => {
        records.push(...pageRecords.map((r) => r.fields));
        fetchNextPage();
      },
      (err) => {
        if (err) {
          console.error('Airtable error object:', JSON.stringify(err, null, 2));
          return res.status(500).json({
            error: err.message || 'Unknown error',
            fullError: err
          });
        }
        res.json(records);
      }
    );
});

app.post('/records', async (req, res) => {
  try {
    const { Name, Status, Notes } = req.body;

    const created = await base('Tasks').create([
      { fields: { Name, Status, Notes } }
    ]);

    const clean = created.map((record) => ({
      id: record.id,
      ...record.fields
    }));

    if (req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
      return res.redirect('/records');
    }

    res.json(clean);
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ error: err.message || 'Failed to create record' });
  }
});

// HTML form for creating a task
app.get('/new-task', (req, res) => {
  res.send(`
    <h2>Create a New Task</h2>
    <form action="/records" method="POST">
      <label>Name: <input name="Name" required /></label><br/>
      <label>Status: 
        <select name="Status">
          <option>New</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </label><br/>
      <label>Notes: <textarea name="Notes"></textarea></label><br/>
      <button type="submit">Create Task</button>
    </form>
  `);
});

// HTML form for editing a task
app.get('/edit/:id', async (req, res) => {
  try {
    const record = await base('Tasks').find(req.params.id);
    const { Name, Status, Notes } = record.fields;

    res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Edit Task</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen;
        background-color: #f9fafb;
        margin: 0;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
      }

      h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
      }

      form {
        background: white;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
      }

      label {
        display: block;
        margin-bottom: 1rem;
        font-weight: 600;
      }

      input, select, textarea {
        width: 100%;
        padding: 0.5rem;
        margin-top: 0.25rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        font-size: 1rem;
      }

      button {
        background-color: #2563eb;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        font-size: 1rem;
        cursor: pointer;
      }

      button:hover {
        background-color: #1d4ed8;
      }

      .nav {
        margin-top: 2rem;
        text-align: center;
      }

      .nav a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 500;
      }

      .nav a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <h2>✏️ Edit Task</h2>
    <form action="/update/${record.id}" method="POST">
      <label>
        Name:
        <input name="Name" value="${Name || ''}" required />
      </label>

      <label>
        Status:
        <select name="Status">
          <option${Status === 'New' ? ' selected' : ''}>New</option>
          <option${Status === 'In Progress' ? ' selected' : ''}>In Progress</option>
          <option${Status === 'Done' ? ' selected' : ''}>Done</option>
        </select>
      </label>

      <label>
        Notes:
        <textarea name="Notes" rows="4">${Notes || ''}</textarea>
      </label>

      <button type="submit">Update Task</button>
    </form>

    <div class="nav">
      <p><a href="/records">&larr; Back to Records</a> | <a href="/">🏠 Home</a></p>
    </div>
  </body>
  </html>
`);

  } catch (err) {
    console.error('Edit form error:', err);
    res.status(500).send('Could not load task');
  }
});

app.post('/update/:id', async (req, res) => {
  try {
    const { Name, Status, Notes } = req.body;

    await base('Tasks').update(req.params.id, {
      Name,
      Status,
      Notes
    });

    res.redirect(303, '/');
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).send('Failed to update task');
  }
});

// Health check
app.get('/ping', (req, res) => {
  res.send('✅ Airtable API is running. Try /records');
});

// FINAL: Serve frontend index.html for any other route (React router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});
