<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "kilburnazondb";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed.']));
}

// Get request data
$requestData = json_decode(file_get_contents('php://input'), true);

$requestId = $requestData['Leave_id'];
$status = $requestData['Status'];

// Update the status of the leave request
$sql = "UPDATE leave_requests SET Status = ? WHERE Leave_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $requestId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update request status.']);
}

// Close the connection
$conn->close();
?>
