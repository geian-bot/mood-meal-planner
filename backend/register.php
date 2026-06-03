<?php
$allowed_origins = [
    "http://localhost:5173",
    "https://your-vercel-app.vercel.app" // ← fill this in later
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["username"]) || !isset($data["password"])) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$username = $data["username"];
$password = password_hash($data["password"], PASSWORD_DEFAULT);

// Prepared statement — no SQL injection
$stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    // Check for duplicate username
    if ($conn->errno === 1062) {
        echo json_encode(["success" => false, "message" => "Username already taken"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error registering user"]);
    }
}
?>