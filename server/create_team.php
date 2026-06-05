<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO teams (team_name, team_logo, leader_id) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $data["team_name"], $data["team_logo"], $data["leader_id"]);

if ($stmt->execute()) {
  $team_id = $conn->insert_id;

  $member = $conn->prepare("INSERT INTO team_members (team_id, user_id, status) VALUES (?, ?, 'accepted')");
  $member->bind_param("ii", $team_id, $data["leader_id"]);
  $member->execute();

  echo json_encode(["success" => true, "team_id" => $team_id]);
} else {
  echo json_encode(["success" => false]);
}
?>