<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("UPDATE team_members SET status = ? WHERE id = ?");
$stmt->bind_param("si", $data["status"], $data["invite_id"]);

echo json_encode(["success" => $stmt->execute()]);
?>