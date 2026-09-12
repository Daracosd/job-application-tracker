

import { useEffect, useState } from 'react';
import './App.css';





function App() {
  const [applications, setApplications] =useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus]=useState("All");
  const [searchTerm, setSearchTerm]=useState("");
  const [sortOption, setSortOption]= useState("newest");
  const [showProfileMenu, setShowProfileMenu]= useState(false);
  const [isLoggedIn, setLoggedIn]=useState(() =>{
    return !!localStorage.getItem("token");
  });
  const [showLoginForm, setShowLoginForm]=useState(false);
  const [showRegisterForm, setShowRegisterForm]=useState(false);
  const [registerMessage, setRegisterMessage]=useState('');

  const [loginData, setLoginData]=useState({
    email: '',
    password: ''
  });

  const[registerData, setRegisterData]=useState({
    name: '',
    email: '',
    password: ''
  });



  const [formdata, setFormData] =useState({
    company: '',
    position: '',
    status: 'Applied',
    location: '',
    job_url: '',
    salary: '',
    date_applied: ''
  });

  useEffect(()=> {

    if(!isLoggedIn){
      return
    }

    const token= localStorage.getItem("token");
    fetch("http://localhost:5000/api/applications",{
      headers:{
        Authorization: `Bearer ${token }`
      }
    })
      .then((response)=>response.json())
      .then((data)=>{
        setApplications(data);
      })
      .catch((error)=>{
        console.error("Error fetching applications: ",error);
      });
  }, [isLoggedIn]);



  const handleChange= (event) =>{
    setFormData({
      ...formdata,
      [event.target.name]: event.target.value
    });
  };

  const handleLoginChange= (event) =>{
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value
    });
  };

  const handleRegisterChange= (event) =>{
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value
    });
  };

  const handleLogin= (event)=>{
    event.preventDefault();
    fetch("http://localhost:5000/api/auth/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData)
    })
      .then((response)=>response.json())
      .then((data)=>{
        if(data.token){
          localStorage.setItem("token",data.token);
          setLoggedIn(true);
          setShowLoginForm(false);
        }
        console.log(data);
      })
      .catch((error)=>{
        console.error("Login error:",error)

      });
  };

  const handleLogout=() => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setApplications([]);
    setShowProfileMenu(false);

  }
  const handleRegister =  (event) =>{
    event.preventDefault();

    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registerData)
    })
      .then((response)=>response.json())
      .then((data)=>{
        console.log(data);

        if(data.message === "User registered successfully"){
          setRegisterMessage("Registration successful! You can now log in.");

          setShowRegisterForm(false);
          setShowLoginForm(true);

          setRegisterData({
            name: '',
            email:'',
            password:''
          });
        }else{
          setRegisterMessage(data.error || "Regitration failed.");
        }
      })
      .catch((error)=>{
        console.error("Registration error:", error);
        setRegisterMessage("Registration failed.  Please try again.");
      });
  };

  const handleDelete= (id) =>{
    const token=localStorage.getItem("token");
    fetch(`http://localhost:5000/api/applications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response)=> response.json())
      .then(()=>{
        fetch("http://localhost:5000/api/applications",{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((response) => response.json())
          .then((data)=>{
            setApplications(data);

          });
      })
    .catch((error)=>{
      console.error("Error deleting application:",error);
    });

  };

  const handleEdit= (application) => {
    setEditingId(application.id);

    setFormData({
      company: application.company,
      position: application.position,
      status: application.status,
      location: application.location,
      job_url: application.job_url,
      salary: application.salary,
      date_applied: application.date_applied

    });
  };

  const handleSubmit= (event) => {
    event.preventDefault();
    const token=localStorage.getItem("token");

    const url= editingId
      ? `http://localhost:5000/api/applications/${editingId}`
      : "http://localhost:5000/api/applications";

    const method= editingId ?"PUT" : "POST"
    

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formdata)
    })

    .then((response)=>response.json())
    .then((newApplication)=>{
      fetch("http://localhost:5000/api/applications",{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response)=>response.json())
        .then((data)=>{
          setApplications(data);
        });
      
      
      setFormData({
        company: '',
        position: '',
        status: 'Applied',
        location: '',
        job_url: '',
        salary: '',
        date_applied: ''
      });
      setEditingId(null);

    })
    .catch((error)=> {
      console.error("Error adding aplication: ", error);

    });

  };
  const totalApplications=applications.length;
  const appliedCount=applications.filter(
    (application) => application.status === "Applied"
  ).length
  const interviewCount=applications.filter(
    (application) => application.status === "Interview"
  ).length
  const offerCount=applications.filter(
    (application) => application.status === "Offer"
  ).length
  const rejectedCount=applications.filter(
    (application) => application.status === "Rejected"
  ).length


  const filteredApplications = applications.filter((application)=>{
    const matchesStatus=
      filterStatus === "All" ||
      application.status === filterStatus;

    const matchesSearch=
      application.company.toLowerCase().includes(searchTerm.toLowerCase())||
      application.position.toLowerCase().includes(searchTerm.toLowerCase())||
      application.location.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch && matchesStatus
  })
  .sort((a,b) =>{
    if(sortOption === "newest"){
      return new Date(b.date_applied) - new Date(a.date_applied);
    }
    if(sortOption === "oldest"){
      return new Date(a.date_applied) - new Date(b.date_applied);
    }
    if(sortOption === "companyAZ"){
      return a.company.localeCompare(b.company);
    }
    if(sortOption === "companyZA"){
      return b.company.localeCompare(a.company);
    }
    if(sortOption === "salaryHigh"){
      return Number(b.salary||0)-Number(a.salary||0);
    }
    if(sortOption === "salaryLow"){
      return Number(a.salary||0)-Number(b.salary||0);
    }

  })

  return(
    <div>
      <div className="top-bar">
        <h1>Job Application Tracker</h1>
        <div className="profile-container">
          <button
            className="profile-button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            👤
          </button>
          {showProfileMenu && (
            <div className="profile-menu">
              { !isLoggedIn?(
                <>
                  <button
                    onClick={()=>{
                    setShowLoginForm(true);
                    setShowProfileMenu(false);
                    }}
                  >
                    Login
                  </button>

                  <button

                    onClick={() => {
                    setShowRegisterForm(true);
                    setShowProfileMenu(false);
                    }}
                  >
                    Register
                  </button>
                </>
              ):(
                <button onClick={handleLogout}>
                  Logout
                </button>
              )}
              
              
            </div>
          )}
          
          {showLoginForm && (
            <div className="login-form">
              <h2>Login</h2>
              {registerMessage &&(
                <p className="register-message">
                  {registerMessage}
                </p>
              )}

              <form onSubmit={handleLogin}>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  
                  />
                </div>

                <div>
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  
                  />
                </div>
                <button type="submit">Login</button>
              </form>
            </div>
          )}
          {showRegisterForm && (
            <div className="login-form">
              <h2>Register</h2>

              <form onSubmit={handleRegister}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                  
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                  
                  />
                </div>

                <div>
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                  
                  />
                </div>
                <button type="submit">Register</button>
              </form>
            </div>
          )}

        </div>
      </div>
      <h2>Dashboard</h2>
      <div className="dashboard">
      <div className="dashboard-card">
        <h3>Total Applications</h3>
        <p>{totalApplications}</p>
      </div>
      
      <div className="dashboard-card">
        <h3>Applied</h3>
        <p>{appliedCount}</p>
      </div>
      <div className="dashboard-card">
        <h3>Interviews</h3>
        <p>{interviewCount}</p>
      </div>
      <div className="dashboard-card">
        <h3>Offers</h3>
        <p>{offerCount}</p>
      </div>
      <div className="dashboard-card">
        <h3>Rejected</h3>
        <p>{rejectedCount}</p>
      </div>
    </div>
      <form className="application-form" onSubmit={handleSubmit}>
        <div>
          <label>Company: </label>
          <input
            type="text"
            name="company"
            value={formdata.company}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Position: </label>
          <input
            type="text"
            name="position"
            value={formdata.position}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Status: </label>
          <select 
            name="status"
            value={formdata.status}
            onChange={handleChange}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
        </div>
        <div>
          <label>Location: </label>
          <input
            type="text"
            name="location"
            value={formdata.location}
            onChange={handleChange}
            
          />
        </div>
        <div>
          <label>Job URL: </label>
          <input
            type="url"
            name="job_url"
            value={formdata.job_url}
            onChange={handleChange}
            placeholder="https://example.com/job"
            required
          />
        </div>

        <div>
          <label>Salary: </label>
          <input
            type="text"
            name="salary"
            value={formdata.salary}
            onChange={handleChange}
            placeholder="e.g. 70000"
            
          />
        </div>
        <div>
          <label>Date Applied: </label>
          <input
            type="date"
            name="date_applied"
            value={formdata.date_applied}
            onChange={handleChange}
            required
          />
        </div>
          
        <button type="submit">
          {editingId ? "Update Application" : "Add Application"}
        </button>



      </form>
      <h2>My Applications</h2>


      <div className="application-controls">
      <div className="search-control">
      <label>Search: </label>
      <input
        type="text"
        placeholder="Search company, position, or location"
        value={searchTerm}
        onChange={(event)=> setSearchTerm(event.target.value)}
      />
      </div>
      <div className="filter-control">
      <label>Filter by Status: </label>
      <select 
        value={filterStatus}
        onChange={(event) => setFilterStatus(event.target.value)}
      >
        <option value= "All">All</option>
        <option value= "Applied">Applied</option>
        <option value= "Interview">Interview</option>
        <option value= "Rejected">Rejected</option>
        <option value= "Offer">Offer</option>
      </select>
      </div>
      
      <div className="sort-control">
      <label>Sort by: </label>
      <select 
        value={sortOption}
        onChange={(event) => setSortOption(event.target.value)}
      >
        <option value= "newest">Newest First</option>
        <option value= "oldest">Oldest First</option>
        <option value= "companyAZ">Company A-Z</option>
        <option value= "companyZA">Company Z-a</option>
        <option value= "salaryHigh">Salary High-Low</option>
        <option value= "salaryLow">Salary Low-High</option>
      </select>
      </div>

    </div>





      {applications.length===0?(
        <p>No applications yet.</p>
      ) : (
      <div className="application-table-wrapper">
        <div className="application-table">


          <div className="table-header">
            <div>Company</div>
            <div>Position</div>
            <div>Location</div>
            <div>Salary</div>
            <div>Date Applied</div>
            <div>Status</div>
            <div></div>
          </div>


          {filteredApplications.map((application)=> (
            <div className="application-row" key={application.id}>


              <div className="company-name">
                {application.company}
              </div>

              <div>
                {application.position}
              </div>

              <div>
                {application.location}
              </div>

              <div>
                {application.salary
                  ? `$${Number(application.salary).toLocaleString()}`
                  : "Not provided"}
              </div>

              <div>
                {application.date_applied
                ? new Date(application.date_applied).toLocaleDateString()
                : "not provided"
                }
              </div>

              <div>
                <span className={`status-badge ${application.status.toLowerCase()}`}>
                  {application.status}
                </span>
              </div>

              <div>
                <a
                  href={application.job_url}
                  target="_blank"
                  rel="noreferrer"
                  className="job-link"
                >
                  View Job
                </a>
              </div>

              <div className="card-buttons">
                <button onClick={()=> handleEdit(application)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(application.id)}>
                  Delete
                </button>
              </div>
            </div>

          ))}
        </div>
      </div>
      )}
    </div>
  );
}

export default App;
