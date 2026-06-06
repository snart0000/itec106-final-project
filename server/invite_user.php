<?php
include "config.php";
include "create_notification.php";

$data = json_decode(file_get_contents("php://input"), true);

$team_id = $data["team_id"];
$user_id = $data["user_id"];
$invited_by = $data["invited_by"];
$waiting_hours = $data["waiting_hours"] ?? 24;

$checkTeam = $conn->prepare("
  SELECT id 
  FROM team_members 
  WHERE user_id = ? AND status = 'accepted'
  LIMIT 1
");

$checkTeam->bind_param("i", $user_id);
$checkTeam->execute();
$teamResult = $checkTeam->get_result();

if ($teamResult->num_rows > 0) {
  echo json_encode([
    "success" => false,
    "message" => "This player already has a team."
  ]);
  exit;
}

$checkInvite = $conn->prepare("
  SELECT id 
  FROM team_members 
  WHERE team_id = ? 
  AND user_id = ? 
  AND status = 'pending'
  AND DATE_ADD(created_at, INTERVAL ? HOUR) > NOW()
  LIMIT 1
");

$checkInvite->bind_param("iii", $team_id, $user_id, $waiting_hours);
$checkInvite->execute();
$inviteResult = $checkInvite->get_result();

if ($inviteResult->num_rows > 0) {
  echo json_encode([
    "success" => false,
    "message" => "Waiting for response."
  ]);
  exit;
}

$stmt = $conn->prepare("
  INSERT INTO team_members (team_id, user_id, status, invited_by) 
  VALUES (?, ?, 'pending', ?)
");

$stmt->bind_param("iii", $team_id, $user_id, $invited_by);

$success = $stmt->execute();

echo json_encode([
  "success" => $success,
  "message" => $success ? "Invite sent" : "Failed to send invite"
]);

if ($success) {
  createNotification(
    $conn,
    $invited_by,
    "Player Invited",
    "You invited a player to your team.",
    "team"
  );

  createNotification(
    $conn,
    $user_id,
    "Team Invitation",
    "You received a team invitation.",
    "invite"
  );
}

?>