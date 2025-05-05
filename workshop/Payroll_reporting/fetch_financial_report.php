<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "kilburnazondb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
    exit;
}

// Get filter parameters
$data = json_decode(file_get_contents('php://input'), true);
$department = $data['department'] ?? '';
$startDate = $data['startDate'] ?? '';
$endDate = $data['endDate'] ?? '';
$position = $data['position'] ?? '';
$minSalary = $data['minSalary'] ?? '';
$maxSalary = $data['maxSalary'] ?? '';

$sql = "
    SELECT * FROM payroll_records pr
    JOIN employee e ON pr.Employee_id = e.Employee_id
    WHERE 1=1
";

$params = [];
$types = "";

if (!empty($department)) {
    $sql .= " AND e.department = ?";
    $params[] = $department;
    $types .= "s";
}
if (!empty($startDate)) {
    $sql .= " AND pr.period_start >= ?";
    $params[] = $startDate;
    $types .= "s";
}
if (!empty($endDate)) {
    $sql .= " AND pr.period_end <= ?";
    $params[] = $endDate;
    $types .= "s";
}
if (!empty($position)) {
    $sql .= " AND e.position LIKE ?";
    $params[] = "%$position%"; 
    $types .= "s";
}
if (!empty($minSalary)) {
    $sql .= " AND e.salary >= ?";
    $params[] = $minSalary;
    $types .= "d";
}
if (!empty($maxSalary)) {
    $sql .= " AND e.salary <= ?";
    $params[] = $maxSalary;
    $types .= "d";
}

$stmt = $conn->prepare($sql);

if ($params) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $records = [];
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }
    echo json_encode(['success' => true, 'records' => $records]);
} else {
    echo json_encode(['success' => false, 'records' => []]);
}

$stmt->close();
$conn->close();
?>
