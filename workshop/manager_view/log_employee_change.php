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

// Get the JSON payload
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['employee_id'], $data['action_type'], $data['details'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid input data']);
    exit;
}

// Prepare and execute the SQL query
$employee_id = $conn->real_escape_string($data['employee_id']);
$action_type = $conn->real_escape_string($data['action_type']);
$details = $conn->real_escape_string($data['details']);

$sql = "INSERT INTO employee_records (employee_id, action_type, details)
        VALUES ('$employee_id', '$action_type', '$details')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Record added successfully']);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$conn->close();
?>
