<?php
include "config.php";
include "create_notification.php";

$data = json_decode(file_get_contents("php://input"), true);

$team_id = $data["team_id"];
$user_id = $data["user_id"];

$check = $conn->prepare("
  SELECT leader_id 
  FROM teams 
  WHERE id = ?
  LIMIT 1
");

$check->bind_param("i", $team_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows === 0) {
  echo json_encode([
    "success" => false,
    "message" => "Team not found."
  ]);
  exit;
}

$team = $result->fetch_assoc();

if ((int)$team["leader_id"] === (int)$user_id) {
  $deleteMembers = $conn->prepare("DELETE FROM team_members WHERE team_id = ?");
  $deleteMembers->bind_param("i", $team_id);
  $deleteMembers->execute();

  $deleteTeam = $conn->prepare("DELETE FROM teams WHERE id = ?");
  $deleteTeam->bind_param("i", $team_id);
  $success = $deleteTeam->execute();

  echo json_encode([
    "success" => $success,
    "message" => $success ? "Team deleted successfully." : "Failed to delete team."
  ]);
  exit;
}

$stmt = $conn->prepare("
  DELETE FROM team_members 
  WHERE team_id = ? AND user_id = ? AND status = 'accepted'
");

$stmt->bind_param("ii", $team_id, $user_id);
$success = $stmt->execute();

echo json_encode([
  "success" => $success,
  "message" => $success ? "You left the team." : "Failed to leave team."
]);

createNotification(
  $conn,
  $user_id,
  "Left Team",
  "You left your team.",
  "team"
);

?>