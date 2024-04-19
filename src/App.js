import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState({
    email: "",
    password: "",
    Name: "",
  });
  const [user, setUser] = useState({ loggedIn: false, token: "" });
  const [Forms, setForms] = useState([]);
  const [FormInfo, setFormInfo] = useState({});

  const handleForm = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const signupSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/auth/signUp",
        method: "post",
        data: data,
      });
      window.alert(res.data.msg);
    } catch (e) {
      window.alert("ERROR");
      console.error(e);
    }
  };

  const loginSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/auth/login",
        method: "post",
        data: data,
      });
      window.alert(res.data.msg);
      if (res.data.token) setUser({ loggedIn: true, token: res.data.token });
    } catch (e) {
      window.alert("ERROR");
      console.error(e);
    }
  };

  useEffect(() => {
    if (user.loggedIn && user.token !== "") getMyForms();
  }, [user]);

  const getMyForms = async () => {
    try {
      const res = await axios({
        url: "http://localhost:5600/form/all",
        method: "get",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setForms(res.data.data);
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  const handleAddFormInfo = (e) =>
    setFormInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addForm = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/form/create",
        method: "post",
        data: { ...FormInfo, email: data.email },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.msg === "Form Created") getMyForms();
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  return (
    <div className="S1">
      {user.loggedIn ? (
        <div style={{ margin: 50, display: "flex" }}>
          <div style={{ marginRight: 10 }}>
            {Forms && Forms.length > 0 ? (
              <div>
                <h1>Your Forms. Click to delete</h1>
                <ul>
                  {Forms.map((i) => (
                    <li
                      onClick={async () => {
                        try {
                          const res = await axios({
                            url: "http://localhost:5600/books/deleteByIsbn",
                            method: "post",
                            data: { isbn: i.isbn },
                            headers: { Authorization: `Bearer ${user.token}` },
                          });
                          if (res.data.msg) getMyForms();
                        } catch (e) {
                          console.error(e);
                          window.alert("ERROR");
                        }
                      }}
                    >
                      {i.name} 
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <h1>NO FORMS FOUND</h1>
            )}
          </div>
          <div>
            <form
              onSubmit={addForm}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h1>Add Form</h1>
              <h4>Form Name</h4>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleAddFormInfo}
                style={{ margin: 5 }}
              />
              <h4>No. of Pages</h4>
              <input
                type="number"
                name="pages"
                value={data.pages}
                onChange={handleAddFormInfo}
                style={{ margin: 5 }}
              />
              <h4>Public?</h4>
              <input
                type="checkbox"
                name="public"
                value={data.public}
                onChange={handleAddFormInfo}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div style={{ margin: 50 }}>
            <form
              onSubmit={signupSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h1>Signup</h1>
              <h4> Your Name</h4>
              <input
                type="text"
                name="Name"
                value={data.Name}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <h4>Email</h4>
              <input
                type="text"
                name="email"
                data={data.email}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <h4>Password</h4>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div>
            <form
              onSubmit={loginSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h1>Login</h1>
              <h4>Email</h4>
              <input
                type="text"
                name="email"
                data={data.email}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <h4>Password</h4>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
