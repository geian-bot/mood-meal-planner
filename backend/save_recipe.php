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
    header("Access-Control-Allow-Methods: POST, OPTIONS");
}
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id      = $_SESSION['user_id'];
$name         = $data['name'] ?? '';
$description  = $data['description'] ?? '';
$category     = $data['category'] ?? '';
$mood         = $data['mood'] ?? '';
$prep_time    = intval($data['prep_time'] ?? 0);
$servings     = intval($data['servings'] ?? 0);
$instructions = $data['instructions'] ?? '';
$ingredients  = json_encode($data['ingredients'] ?? []);
$image        = $data['image'] ?? null;

$stmt = $conn->prepare("INSERT INTO recipes (user_id, name, description, category, mood, prep_time, servings, instructions, ingredients, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("issssiisss", $user_id, $name, $description, $category, $mood, $prep_time, $servings, $instructions, $ingredients, $image);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "id" => $conn->insert_id]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to save recipe"]);
}
?>