import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useState } from "react";
import { useForm } from "react-hook-form";

import "./App.css";
import axios from "axios";

function App() {
  const { register, handleSubmit } = useForm();
  const [employeeList, setEmployeeList] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);

  // const [newName, setNewName] = useState("");
  // const [newAge, setNewAge] = useState(0);
  // const [newCountry, setNewCountry] = useState("");
  // const [newPosition, setPosition] = useState("");
  const [newWage, setNewWage] = useState(0);

  const getEmployees = async () => {
    if (isSubmit === false) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }

    try {
      const data = (await axios.get("http://localhost:8081/")).data;
      setEmployeeList(data);
    } catch (error) {
      console.error(error);
    }
  };
  const updateEmployeeWage = async (id) => {
    try {
      await axios.put("http://localhost:8081/update", {
        wage: newWage,
        id: id,
      });

      setEmployeeList(
        employeeList.map((employee) => {
          return employee.id === id
            ? {
                ...employee,
                wage: newWage,
              }
            : employee;
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/delete/${id}`);
      setEmployeeList(
        employeeList.filter((val) => {
          return val.id !== id;
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  const onSubmit = async (data) => {
    try {
      const newEmployeeData = {
        name: data.nameInputted,
        age: data.ageInputted,
        country: data.countryInputted,
        position: data.positionInputted,
        wage: data.wageInputted,
      };

      await axios.post("http://localhost:8081/create", newEmployeeData);

      setEmployeeList([...employeeList, { ...newEmployeeData }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Employee information</h1>
      <div className="information">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="Name"
              placeholder="Enter the full name"
              {...register("nameInputted", { required: true })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter the age"
              {...register("ageInputted", { required: true })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the country"
              {...register("countryInputted", { required: true })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the position"
              {...register("positionInputted", { required: true })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Wage</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the wage"
              {...register("wageInputted", { required: true })}
            />
          </Form.Group>

          <Button variant="success" type="submit">
            Submit
          </Button>
        </Form>
      </div>

      <hr />

      <div className="employees">
        <Button className="btn btn-primary" onClick={getEmployees}>
          Show employees
        </Button>
        <br></br>
        <br></br>
        {isSubmit &&
          employeeList.map((val, key) => {
            return (
              <div className="mb-3">
                <div className="card-body text-left">
                  <p id={key} className="card-text">
                    Name: {val.name}
                  </p>
                  <p id={key} className="card-text">
                    Age: {val.age}
                  </p>
                  <p id={key} className="card-text">
                    Country: {val.country}
                  </p>
                  <p id={key} className="card-text">
                    Position: {val.position}
                  </p>
                  <p id={key} className="card-text">
                    Wage: {val.wage}
                  </p>
                  <div className="d-flex">
                    <input
                      type="number"
                      style={{ width: "300px" }}
                      placeholder="15000..."
                      className="form-control"
                      onChange={(event) => {
                        setNewWage(event.target.value);
                      }}
                    />
                    <Button
                      className="btn btn-warning"
                      onClick={() => updateEmployeeWage(val.id)}
                    >
                      Update
                    </Button>
                    <Button
                      className="btn btn-danger"
                      onClick={() => deleteEmployee(val.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
