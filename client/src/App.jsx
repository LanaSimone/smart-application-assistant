import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [applications, setApplications] = useState([
    {id: 1, company: "test co", role: "qa engineer", status: "Applied"}
  ])

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    location: "",
    salary: "",
    jobLink: "",
    dateApplied: "",
    description: "",
    notes: "",

  })

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

  return (
    <div>
      <h1>Smart Application Assistant</h1>
      <h2>Applications</h2>
      <input
      name="company"
      placeholder="Company"
      onChange={handleInputChange}
      />
      <p>Company: {formData.company}</p>
      
      {applications.map((app) => (
        <div key ={app.id}>
          <p>{app.company}</p>
          <p>{app.role}</p>
          <p>Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
}

export default App;