<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO team_members (team_id, user_id, status) VALUES (?, ?, 'pending')");
$stmt->bind_param("ii", $data["team_id"], $data["user_id"]);

echo json_encode([
  "success" => $stmt->execute(),
  "message" => "Invite sent"
]);
?>