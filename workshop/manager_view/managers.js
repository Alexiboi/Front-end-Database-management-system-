let employees = []; // Store employees globally for filtering
let changeLog = [];

// Fetch employees from the server
function fetchEmployeeData() {
    
    fetch('manager_view_employees.php') 
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

// Filter employees based on birthdays in the current month
function filterEmployeesByBirthday() {
    let url = 'fetch_birthdays.php';
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            employees = data;  // Store fetched employees
            renderEmployeeCards(employees);  // Render employee cards
        })
        .catch(error => console.error('Error fetching employee data:', error));
    
}

// When clicking the button to show birthdays, fetch the filtered data
document.getElementById('birthdayButton').addEventListener('click', function() {
    filterEmployeesByBirthday();  // Fetch only employees with birthdays this month
});



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
            <p>DOB: ${employee.dob}</p>
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

// Handle Add Employee Form Submission
document.getElementById('addEmployeeForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const newEmployee = {
        name: document.getElementById('newName').value,
        position: document.getElementById('newPosition').value,
        salary: parseFloat(document.getElementById('newSalary').value),
        dob: document.getElementById('newDob').value,
        home_address: document.getElementById('newAddress').value || 'Not Provided',
        hired_date: document.getElementById('newHiredDate').value,
        photo_url: document.getElementById('newPhotoUrl').value || 'default.png',
        email: document.getElementById('newEmail').value,
        contract: document.getElementById('newContract').value || 'Not Provided',
        nin: document.getElementById('newNin').value || 'Not Provided',
        department: document.getElementById('newDepartment').value,
        phone_no: document.getElementById('newPhone').value
    };
    const new_emp_summary = {
        Employee_id: employees.length + 1,
        name: document.getElementById('newName').value,
        position: document.getElementById('newPosition').value,
        department: document.getElementById('newDepartment').value
    }
    updateSummary('added', new_emp_summary);

    // Send data to the backend
    fetch('manager_view_employees.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Fetch updated employee list
                fetchEmployeeData();
                alert('New employee added successfully!');
            } else {
                alert('Error adding employee: ' + data.error);
            }
        })
        .catch(error => console.error('Error adding employee:', error));

    // Clear the form
    document.getElementById('addEmployeeForm').reset();
});

// Promote an employee
document.getElementById('promoteEmployeeForm').addEventListener('submit', event => {
    event.preventDefault();
    const promoteId = parseInt(document.getElementById('promoteId').value);
    const newPosition = document.getElementById('newPositionPromote').value;

    // Find the employee locally
    const employee = employees.find(emp => emp.Employee_id === String(promoteId));
    if (employee) {
        const updatedSalary = employee.salary * 1.05; // Calculate 5% salary increase
    
        updateSummary('promoted', {
            Employee_id: employee.Employee_id,
            name: employee.name,
            newPosition: newPosition,
            newSalary: updatedSalary
        });

        // Send the updated details to the server
        fetch('update_promotion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Employee_id: promoteId,
                newPosition: newPosition,
                newSalary: updatedSalary,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update local data
                    employee.position = newPosition;
                    employee.salary = updatedSalary;

                    // Re-render the employee cards to reflect changes
                    renderEmployeeCards(employees);

                    console.log("promotion applied succesfully")
                } else {
                    // Show error message if the server responds with an error
                    console.log("error updating promotion")
                }
            })
            .catch(error => {
                console.error('Error updating promotion:', error);
                showFlashMessage('An error occurred while updating the promotion.', 'error');
            });
    } else {
        alert('Employee not found.');
    }

    // Reset the form
    document.getElementById('promoteEmployeeForm').reset();
});

document.getElementById('removeEmployeeForm').addEventListener('submit', event => {
    event.preventDefault()

    const employee_to_removeid = parseInt(document.getElementById('removeEmployeeId').value)
    // const employee = employees.find(emp => emp.Employee_id === String(employee_to_removeid));
    fetch('remove_employee.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Employee_id: employee_to_removeid
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                console.log("removal succesfull")
            } else {
                // Show error message if the server responds with an error
                console.log("error updating removal")
            }
        })
        .catch(error => {
            console.error('Error updating removal:', error);
        });

});



// Update summary to reflect employee changes
function updateSummary(changeType, employeeDetails) {
    console.log('Employee details sent to log:', employeeDetails);
    console.log('Employeeid:', employeeDetails.Employee_id);
    // Create a log message based on the change type

    let changeMessage = '';
    if (changeType === 'added') {
        changeMessage = `New employee added: ${employeeDetails.name}, ${employeeDetails.position}, ${employeeDetails.department}.`;
    } else if (changeType === 'promoted') {
        changeMessage = `Employee promoted: ${employeeDetails.name} is now ${employeeDetails.newPosition} with a new salary of $${employeeDetails.newSalary.toFixed(2)}.`;
    } else if (changeType === 'removed') {
        changeMessage = `Employee removed: ${employeeDetails.name}, who was a ${employeeDetails.position} in ${employeeDetails.department}.`;
    }

    // Add the message to the change log
    changeLog.push(changeMessage);

    

    // Send the change to the backend to log it in the database
    fetch('log_employee_change.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employee_id: employeeDetails.Employee_id, // Ensure you pass the correct employee ID
            action_type: changeType,
            details: changeMessage,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Change logged successfully:', data);
            } else {
                console.error('Error logging change:', data.error);
            }
        })
        .catch(error => {
            console.error('Error logging change:', error);
        });
}

// Event listeners for search and filter
document.getElementById('searchInput').addEventListener('input', filterEmployees);
document.getElementById('departmentFilter').addEventListener('change', filterEmployees);

// Initialize the app
fetchEmployeeData();
