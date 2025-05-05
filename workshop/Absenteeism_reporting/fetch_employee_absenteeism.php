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

// Get employee name from query
$employeeName = isset($_GET['name']) ? $conn->real_escape_string($_GET['name']) : '';

if (empty($employeeName)) {
    echo json_encode(['success' => false, 'error' => 'Employee name is required.']);
    exit;
}

// Fetch employee absenteeism data
$sql = "
    SELECT 
        e.name, 
        SUM(DATEDIFF(lr.End_date, lr.Start_date) + 1) AS total_days, 
        GROUP_CONCAT(DISTINCT lr.Comments SEPARATOR ', ') AS reasons
    FROM 
        leave_requests lr
    JOIN 
        employee e 
    ON 
        lr.Employee_id = e.Employee_id
    WHERE 
        e.name LIKE '%$employeeName%'
    GROUP BY 
        e.Employee_id
";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Fetch periodic absences
    $sqlPeriodic = "
        SELECT 
            DATE_FORMAT(Start_date, '%Y-%m') AS period, 
            SUM(DATEDIFF(End_date, Start_date) + 1) AS days
        FROM 
            leave_requests
        WHERE 
            Employee_id = (SELECT Employee_id FROM employee WHERE name LIKE '%$employeeName%' LIMIT 1)
        GROUP BY 
            period
    ";

    $resultPeriodic = $conn->query($sqlPeriodic);
    $periodicAbsences = [];

    while ($period = $resultPeriodic->fetch_assoc()) {
        $periodicAbsences[] = ['period' => $period['period'], 'days' => $period['days']];
    }

    echo json_encode([
        'success' => true,
        'name' => $row['name'],
        'total_days' => $row['total_days'],
        'reasons' => explode(', ', $row['reasons']),
        'periodic_absences' => $periodicAbsences
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'No data found for the specified employee.']);
}

$conn->close();
?>
