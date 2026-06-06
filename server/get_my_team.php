<?php
include "config.php";

$user_id = $_GET["user_id"] ?? 0;

$stmt = $conn->prepare("
  SELECT 
    t.id,
    t.team_name,
    t.team_logo,
    t.leader_id
  FROM teams t
  INNER JOIN team_members tm ON t.id = tm.team_id
  WHERE tm.user_id = ? AND tm.status = 'accepted'
  LIMIT 1
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
  echo json_encode([
    "has_team" => false
  ]);
  exit;
}

$team = $result->fetch_assoc();

$membersStmt = $conn->prepare("
  SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.ign,
    u.role1,
    u.uid,
    u.server
  FROM team_members tm
  INNER JOIN users u ON tm.user_id = u.id
  WHERE tm.team_id = ? AND tm.status = 'accepted'
  LIMIT 7
");

$membersStmt->bind_param("i", $team["id"]);
$membersStmt->execute();

$membersResult = $membersStmt->get_result();
$members = [];

while ($row = $membersResult->fetch_assoc()) {
  $members[] = $row;
}

echo json_encode([
  "has_team" => true,
  "team" => $team,
  "members" => $members
]);
?>