import { useEffect, useState } from 'react';
import './App.css';

// Backend URL from the frontend .env file
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const App = () => {
  const [students, setStudents] = useState([]);
  const [rollno, setRollno] = useState('');
  const [name, setName] = useState('');

  // Fetch all students from the backend
  const loadStudents = () => {
    fetch(`${API_BASE_URL}/api/students`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        return response.json();
      })
      .then(data => {
        setStudents(data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  };

  // Load students when the component mounts
  useEffect(() => {
    loadStudents();
  }, []);

  // Add a new student
  const addStudent = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter the student name.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/students`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rollno: Number(rollno),
            name: name.trim()
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          'Unable to add student. The roll number may already exist.'
        );
      }

      setRollno('');
      setName('');

      loadStudents();

      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px'
      }}
    >
      <h1>Student Management System</h1>

      <h2>Add Student</h2>

      <form
        onSubmit={addStudent}
        style={{ marginBottom: '30px' }}
      >
        <div style={{ marginBottom: '12px' }}>
          <input
            type="number"
            placeholder="Roll Number"
            value={rollno}
            onChange={e => setRollno(e.target.value)}
            required
            min="1"
            step="1"
            style={{
              padding: '8px',
              marginRight: '10px'
            }}
          />

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={25}
            required
            style={{
              padding: '8px'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '8px 18px',
            cursor: 'pointer'
          }}
        >
          Add Student
        </button>
      </form>

      <h2>Student List</h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          margin: '0 auto',
          borderCollapse: 'collapse',
          minWidth: '350px'
        }}
      >
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
          </tr>
        </thead>

        <tbody>
          {students.map(student => (
            <tr key={student.rollno}>
              <td>{student.rollno}</td>
              <td>{student.name}</td>
            </tr>
          ))}

          {students.length === 0 && (
            <tr>
              <td colSpan="2">No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;