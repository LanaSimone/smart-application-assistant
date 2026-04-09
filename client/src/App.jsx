import { useEffect, useState } from "react";
import "./App.css";

const initialFormData = {
  company: "",
  role: "",
  status: "Applied",
  location: "",
  salary: "",
  jobLink: "",
  dateApplied: "",
  description: "",
  notes: ""
}

function App() {
  const [applications, setApplications] = useState([])

  const [formData, setFormData] = useState(initialFormData)

  async function fetchApplications() {
    const response = await fetch("http://localhost:5000/api/applications");
    const data = await response.json();
    setApplications(data)
  }

  
  function handleInputChange(event){
    const {name, value} = event.target;
    setFormData ({
      ...formData,
      [name]: value
    });
  }
  
  useEffect(() => {
    fetchApplications();
  }, [])

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch("http://localhost:5000/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
      
    })

    const newApplication = await response.json()

    setApplications((currentApplications) =>[
      newApplication,
      ...currentApplications
    ])
    setFormData(initialFormData);
  }

  async function handleDelete(id) {
    const response = await fetch(`http://localhost:5000/api/applications/${id}`, {
      method: "DELETE"
    })

    setApplications(current =>
      current.filter(app => app.id != id)
    )
  }

  async function handleStatusChange(id, newStatus) {
    try{
    const response = await fetch(`http://localhost:5000/api/applications/${id}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({status:newStatus})
    });

    if (!response.ok) {
      throw new Error("Faled to update status")
    }

    setApplications(current =>
      current.map(app => 
        app.id === id
        ? { ...app, status: newStatus}
        : app
      )
    )
    
  } catch (error) {
    console.error(error);
  }
  }
  
  return (
    <div>
      <h1>Smart Application Assistant</h1>
      <h2>Applications</h2>
      <form onSubmit={handleSubmit}>
        <input
        type="date"
        name="dateApplied"
        placeholder="Date Applied"
        value={formData.dateApplied}
        onChange={handleInputChange}
        />
        <input
        name="company"
        placeholder="Company"
        value={formData.company}
        onChange={handleInputChange}
        />
        <input
        name="role"
        placeholder="Position"
        value={formData.role}
        onChange={handleInputChange}
        />
        <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleInputChange}
        />
        <select
        name="status"
        value={formData.status}
        onChange={handleInputChange}
        >
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
            
        <button type="submit">Save</button>
      </form>

      <p>Company: {formData.company}</p>
      <p>Role: {formData.role}</p>
      <p>Location: {formData.location}</p>
      <p>Status: {formData.status}</p>
      <p>Date Applied: {formData.dateApplied}</p>
      
      {applications.map((app) => (
        <div key ={app.id}>
          <p>Company: {app.company}</p>
          <p>Role: {app.role}</p>
          <p>Location:{app.location}</p>
          <select value={app.status} onChange={(event) => handleStatusChange(app.id, event.target.value)}>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <p>Date Applied: {app.date_applied}</p>
          <button onClick={() => handleDelete(app.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;