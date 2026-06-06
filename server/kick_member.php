<?php
include "config.php";
include "create_notification.php";

$data = json_decode(file_get_contents("php://input"), true);

$team_id = $data["team_id"];
$leader_id = $data["leader_id"];
$member_id = $data["member_id"];

if ((int)$leader_id === (int)$member_id) {
  echo json_encode([
    "success" => false,
    "message" => "Leader cannot kick himself."
  ]);
  exit;
}

$checkLeader = $conn->prepare("
  SELECT id 
  FROM teams 
  WHERE id = ? AND leader_id = ?
  LIMIT 1
");

$checkLeader->bind_param("ii", $team_id, $leader_id);
$checkLeader->execute();
$result = $checkLeader->get_result();

if ($result->num_rows === 0) {
  echo json_encode([
    "success" => false,
    "message" => "Only the leader can kick members."
  ]);
  exit;
}

$stmt = $conn->prepare("
  DELETE FROM team_members 
  WHERE team_id = ? AND user_id = ? AND status = 'accepted'
");

$stmt->bind_param("ii", $team_id, $member_id);
$success = $stmt->execute();

echo json_encode([
  "success" => $success,
  "message" => $success ? "Member kicked successfully." : "Failed to kick member."
]);

createNotification(
  $conn,
  $member_id,
  "Kicked from Team",
  "You were removed from your team.",
  "team"
);

createNotification(
  $conn,
  $leader_id,
  "Member Kicked",
  "You removed a member from your team.",
  "team"
);
?>