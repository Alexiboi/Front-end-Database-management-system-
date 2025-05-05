<?php
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "kilburnazondb";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Get request data
$requestData = json_decode(file_get_contents('php://input'), true);

$employeeName = $requestData['Employee_name'];
$leaveType = $requestData['Leave_type'];
$startDate = $requestData['Start_date'];
$endDate = $requestData['End_date'];
$comments = $requestData['Comments'];

// Get the Employee_id based on the Employee_name
$sql = "SELECT Employee_id FROM employee WHERE name = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $employeeName);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $employeeId = $row['Employee_id'];

    // Insert the leave request
    $insertSql = "INSERT INTO leave_requests (Employee_id, Leave_type, Start_date, End_date, Comments, Status) VALUES (?, ?, ?, ?, ?, 'Pending')";
    $insertStmt = $conn->prepare($insertSql);
    $insertStmt->bind_param("issss", $employeeId, $leaveType, $startDate, $endDate, $comments);

    if ($insertStmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to submit leave request.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Employee not found.']);
}

// Close the connection
$conn->close();
?>
