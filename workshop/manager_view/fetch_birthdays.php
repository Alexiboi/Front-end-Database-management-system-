<?php
$servername = "localhost";
$username = "root"; 
$password = "root"; 
$dbname = "kilburnazondb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


// Handle GET request to fetch employees
$sql = "SELECT * FROM employee WHERE MONTH(dob) = MONTH(CURRENT_DATE)";
$result = $conn->query($sql);

$employees = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }
}

echo json_encode($employees);

$conn->close();
?>
