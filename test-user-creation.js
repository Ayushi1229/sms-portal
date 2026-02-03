// Test user creation
const testData = {
  email: 'testuser@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'TestPassword123',
  roleId: 5, // student
  departmentId: '' // empty to test without department
};

fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
  .then(res => res.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch(err => {
    console.error('Error:', err);
  });
