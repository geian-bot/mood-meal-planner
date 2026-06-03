<?php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowed_origins = [
    "https://mood-meal-planner.vercel.app",
    "http://localhost:5173"
];

$is_allowed = in_array($origin, $allowed_origins) ||
              preg_match('/^https:\/\/mood-meal-planner.*\.vercel\.app$/', $origin);

if ($is_allowed) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
}

header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include "db.php";
// ... rest of your file stays exactly the same
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["username"]) || !isset($data["password"])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing input"
    ]);
    exit;
}

$username = $data["username"];
$password = $data["password"];

$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user["password"])) {

        // SESSION SAVE (CRITICAL)
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["username"] = $user["username"];

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "username" => $user["username"]
        ]);

    } else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect password"
        ]);
    }

} else {
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
}
?>