<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root"; 
$password = "root"; 
$dbname = "kilburnazondb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

$employee_id = $data['Employee_id'];
$new_position = $data['newPosition'];
$new_salary = $data['newSalary'];

// Update query
$sql = "UPDATE employee SET position = '$new_position', salary = '$new_salary' WHERE Employee_id = '$employee_id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $conn->error]);
}

$conn->close();
?>
