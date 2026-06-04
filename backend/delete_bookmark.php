<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = ["https://mood-meal-planner.vercel.app","http://localhost:5173","http://localhost:5174"];
$is_allowed = in_array($origin, $allowed_origins) ||
              preg_match('/^https:\/\/mood-meal-planner.*\.vercel\.app$/', $origin) ||
              preg_match('/^http:\/\/localhost:\d+$/', $origin);
if ($is_allowed) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, X-User-Id");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
}
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$user_id = intval($_SERVER['HTTP_X_USER_ID'] ?? 0);
if (!$user_id) { echo json_encode(["success" => false, "message" => "Not logged in"]); exit; }

include "db.php";
$data = json_decode(file_get_contents("php://input"), true);
$recipe_id = $data['recipe_id'] ?? '';

$stmt = $conn->prepare("DELETE FROM saved_recipes WHERE user_id = ? AND recipe_id = ?");
$stmt->bind_param("is", $user_id, $recipe_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to remove"]);
}
?>