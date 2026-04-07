const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const databasePath = path.join(__dirname, "..", "applications.db");
const database = new sqlite3.Database(databasePath);

database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Applied',
      location TEXT,
      salary TEXT,
      job_link TEXT,
      date_applied TEXT,
      description TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.get("/api/health", (request, response) => {
  response.json({ message: "Server is running" });
});

app.get("/api/applications", (request, response) => {
  const query = `
    SELECT *
    FROM applications
    ORDER BY created_at DESC
  `;

  database.all(query, [], (error, rows) => {
    if (error) {
      return response.status(500).json({ error: "Failed to fetch applications" });
    }

    response.json(rows);
  });
});

app.delete("/api/applications/:id", (request, response) => {
  const applicationId = request.params.id;

  database.run(
    "DELETE FROM applications where id = ?",
    [applicationId],
    function (error){
      if (error){
        return response.status(500).json({ error: "Failed to delete application"
        })
        response.json({ message: "Application deleted successfully"});
      }
    }
  )
})

app.post("/api/applications", (request, response) => {
  const {
    company,
    role,
    status,
    location,
    salary,
    jobLink,
    dateApplied,
    description,
    notes
  } = request.body;

  const query = `
    INSERT INTO applications (
      company,
      role,
      status,
      location,
      salary,
      job_link,
      date_applied,
      description,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    company,
    role,
    status || "Applied",
    location || "",
    salary || "",
    jobLink || "",
    dateApplied || "",
    description || "",
    notes || ""
  ];

  database.run(query, values, function (error) {
    if (error) {
      return response.status(500).json({ error: "Failed to create application" });
    }

    database.get(
      "SELECT * FROM applications WHERE id = ?",
      [this.lastID],
      (fetchError, row) => {
        if (fetchError) {
          return response.status(500).json({ error: "Application created but failed to fetch it" });
        }

        response.status(201).json(row);
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});