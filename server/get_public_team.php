<?php
include "config.php";

$team_id = $_GET["team_id"] ?? 0;
$user_id = $_GET["user_id"] ?? 0;

$teamStmt = $conn->prepare("
  SELECT id, team_name, team_logo, leader_id
  FROM teams
  WHERE id = ?
");

$teamStmt->bind_param("i", $team_id);
$teamStmt->execute();
$teamResult = $teamStmt->get_result();

if ($teamResult->num_rows === 0) {
  echo json_encode(["success" => false, "message" => "Team not found."]);
  exit;
}

$team = $teamResult->fetch_assoc();

$membersStmt = $conn->prepare("
  SELECT u.id, u.first_name, u.last_name, u.ign, u.uid
  FROM team_members tm
  JOIN users u ON tm.user_id = u.id
  WHERE tm.team_id = ? AND tm.status = 'accepted'
");

$membersStmt->bind_param("i", $team_id);
$membersStmt->execute();

$membersResult = $membersStmt->get_result();
$members = [];

while ($row = $membersResult->fetch_assoc()) {
  $members[] = $row;
}

$checkApplication = $conn->prepare("
  SELECT id
  FROM team_applications
  WHERE team_id = ? AND user_id = ? AND status = 'pending'
  LIMIT 1
");

$checkApplication->bind_param("ii", $team_id, $user_id);
$checkApplication->execute();

$has_pending_application = $checkApplication->get_result()->num_rows > 0;

$checkUserTeam = $conn->prepare("
  SELECT id
  FROM team_members
  WHERE user_id = ? AND status = 'accepted'
  LIMIT 1
");

$checkUserTeam->bind_param("i", $user_id);
$checkUserTeam->execute();

$has_team = $checkUserTeam->get_result()->num_rows > 0;

echo json_encode([
  "success" => true,
  "team" => $team,
  "members" => $members,
  "member_count" => count($members),
  "has_pending_application" => $has_pending_application,
  "has_team" => $has_team
]);
?>