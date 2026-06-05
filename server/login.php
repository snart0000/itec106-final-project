<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $data["email"]);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($data["password"], $user["password"])) {
  unset($user["password"]);

  echo json_encode([
    "success" => true,
    "user" => $user
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Invalid email or password"
  ]);
}
?>