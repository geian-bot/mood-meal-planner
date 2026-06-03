<?php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = [
    "https://mood-meal-planner.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
];
$is_allowed = in_array($origin, $allowed_origins) ||
              preg_match('/^https:\/\/mood-meal-planner.*\.vercel\.app$/', $origin) ||
              preg_match('/^http:\/\/localhost:\d+$/', $origin);
if ($is_allowed) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
}
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

include "db.php";

$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM recipes WHERE user_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$recipes = [];
while ($row = $result->fetch_assoc()) {
    $row['ingredients'] = json_decode($row['ingredients'], true);
    $recipes[] = $row;
}

echo json_encode(["success" => true, "recipes" => $recipes]);
?>