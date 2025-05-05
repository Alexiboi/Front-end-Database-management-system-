<?php
$servername = "localhost";
$username = "root"; 
$password = "root"; 
$dbname = "kilburnazondb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode the JSON request body
    $data = json_decode(file_get_contents('php://input'), true);

    $name = $data['name'];
    $position = $data['position'];
    $salary = $data['salary'];
    $dob = $data['dob'];
    $home_address = $data['home_address'];
    $hired_date = $data['hired_date'];
    $photo_url = $data['photo_url'];
    $email = $data['email'];
    $contract = $data['contract'];
    $nin = $data['nin'];
    $department = $data['department'];
    $phone_no = $data['phone_no'];

    // Calculate employee_id as the number of current employees + 1
    $employeeCountQuery = "SELECT COUNT(*) as count FROM employee";
    $result = $conn->query($employeeCountQuery);
    $employee_id = ($result->fetch_assoc()['count'] ?? 0) + 1;

    // Generate random numbers for department_id and location_id
    $department_id = rand(1000, 9999);
    $location_id = rand(1000, 9999);

    // Insert query
    $sql = "INSERT INTO employee (Employee_id, Department_id, Location_id, name, position, salary, dob, home_address, hired_date, photo_url, email, contract, nin, department, phone_no)
            VALUES ('$employee_id', '$department_id', '$location_id','$name', '$position', '$salary', '$dob', '$home_address', '$hired_date', '$photo_url', '$email', '$contract', '$nin', '$department', '$phone_no')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }

   

    $stmt->close();
} else {
    // Handle GET request to fetch employees
    $sql = "SELECT * FROM employee";
    $result = $conn->query($sql);

    $employees = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $employees[] = $row;
        }
    }

    echo json_encode($employees);
}

$conn->close();
?>
