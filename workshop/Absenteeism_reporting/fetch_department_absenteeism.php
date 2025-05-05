<?php
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "kilburnazondb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
    exit;
}

// Fetch average absence rate by department
$sql = "
    SELECT 
    d.department_name AS name,
    ROUND(
        COUNT(DISTINCT lr.Employee_id) / COUNT(DISTINCT d.Employee_id) * 100,
        2
    ) AS absence_rate_percentage
    FROM 
        department d
    LEFT JOIN 
        leave_requests lr 
    ON 
        d.Employee_id = lr.Employee_id
    GROUP BY 
        d.department_id, d.department_name;

";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $departments = [];
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }
    echo json_encode(['success' => true, 'departments' => $departments]);
} else {
    echo json_encode(['success' => false, 'error' => 'No department data found.']);
}

$conn->close();
?>
