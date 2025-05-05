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

$sql = "SELECT * FROM employee_records ORDER BY action_date DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $records = [];
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $records]);
} else {
    echo json_encode(['success' => false, 'data' => []]);
}

$conn->close();
?>
