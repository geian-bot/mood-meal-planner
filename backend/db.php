<?php
$host = getenv("DB_HOST") ?: "localhost";
$user = getenv("DB_USER") ?: "root";
$pass = getenv("DB_PASS") ?: "";
$db   = getenv("DB_NAME") ?: "meal_planner";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "DB connection failed: " . $conn->connect_error
    ]));
}
?>