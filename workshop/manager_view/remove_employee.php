<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "kilburnazondb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}


// Read input data from the request body
$data = json_decode(file_get_contents('php://input'), true);

$employeeId = $data['Employee_id'];

// Check if the employee exists
$checkQuery = "SELECT * FROM employee WHERE Employee_id = ?";
$stmt = $conn->prepare($checkQuery);
$stmt->bind_param("i", $employeeId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Employee not found']);
    exit;
}

$employee = $result->fetch_assoc();

// Log the removal in the removal_records table
$logQuery = "INSERT INTO removal_records (Employee_id, name, position, department, action_time) VALUES (?, ?, ?, ?, NOW())";
$logStmt = $conn->prepare($logQuery);
$logStmt->bind_param("isss", $employee['Employee_id'], $employee['name'], $employee['position'], $employee['department']);

if (!$logStmt->execute()) {
    echo json_encode(['success' => false, 'error' => 'Failed to log removal']);
    exit;
}

// Remove the employee from the employee_table
$deleteQuery = "DELETE FROM employee WHERE Employee_id = ?";
$deleteStmt = $conn->prepare($deleteQuery);
$deleteStmt->bind_param("i", $employeeId);

if ($deleteStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Employee removed successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to remove employee']);
}
?>
