<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "kilburnazondb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Fetch all pending leave requests with employee names
$sql = "
    SELECT 
        lr.Leave_id, 
        lr.Employee_id, 
        lr.Leave_type, 
        lr.Start_date, 
        lr.End_date, 
        lr.Comments, 
        lr.Status,
        e.name 
    FROM 
        leave_requests lr
    JOIN 
        employee e 
    ON 
        lr.Employee_id = e.Employee_id
    WHERE 
        lr.Status = 'Pending'
";

$result = $conn->query($sql);

if ($result) {
    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }

    echo json_encode(['success' => true, 'requests' => $requests]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error fetching requests: ' . $conn->error]);
}

// Close the connection
$conn->close();
?>
