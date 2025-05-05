let employees = []; // Store employees globally for filtering
let changeLog = [];

// Fetch employees from the server
function fetchEmployeeData() {
    fetch('employees.php')
        .then(response => response.json())
        .then(data => {
            employees = data; // Store fetched employees
            renderEmployeeCards(employees);
        })
        .catch(error => console.error('Error fetching employee data:', error));
}

// Render employee cards
function renderEmployeeCards(employees) {
    const container = document.getElementById('employeeCards');
    container.innerHTML = ''; // Clear previous content
    employees.forEach(employee => {
        const card = createEmployeeCard(employee);
        container.appendChild(card);
    });
}

// Create a single employee card
function createEmployeeCard(employee) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${employee.photo_url}" alt="${employee.name}">
        <h3>${employee.name}</h3>
        <p>${employee.position}</p>
        <p>${employee.department}</p>
        <button onclick="showEmployeeDetails(${employee.Employee_id})">View Details</button>
    `;
    return card;
}

// Filter employees based on search and department
function filterEmployees() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const departmentFilter = document.getElementById('departmentFilter').value;

    const filtered = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchInput) || 
                              employee.position.toLowerCase().includes(searchInput);
        const matchesDepartment = !departmentFilter || employee.department === departmentFilter;

        return matchesSearch && matchesDepartment;
    });

    renderEmployeeCards(filtered);
}

// Show detailed view in a modal
function showEmployeeDetails(employeeId) {
    console.log(employees)
    const employee = employees.find(emp => emp.Employee_id === String(employeeId));
    console.log(employee)
    if (employee) {
        document.getElementById('modalName').textContent = employee.name;
        document.getElementById('modalDetails').innerHTML = `
            <p>Position: ${employee.position}</p>
            <p>Department: ${employee.department}</p>
            <p>Email: ${employee.email}</p>
            <p>Phone: ${employee.phone_no}</p>
            <p>Address: ${employee.home_address}</p>
            <p>Start Date: ${employee.hired_date}</p>
            <p>Salary: $${employee.salary}</p>
        `;
        document.getElementById('employeeModal').style.display = 'block';
    }
}

// Close the modal
function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
}

// Function to generate a unique ID
function generateUniqueId() {
    return Math.floor(Math.random() * 1000);
}



// Event listeners for search and filter
document.getElementById('searchInput').addEventListener('input', filterEmployees);
document.getElementById('departmentFilter').addEventListener('change', filterEmployees);

// Initialize the app
fetchEmployeeData();
