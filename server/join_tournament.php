<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data["user_id"];
$tournament_id = $data["tournament_id"];

$teamStmt = $conn->prepare("
  SELECT t.id AS team_id
  FROM teams t
  INNER JOIN team_members tm ON t.id = tm.team_id
  WHERE tm.user_id = ? AND tm.status = 'accepted'
  LIMIT 1
");

$teamStmt->bind_param("i", $user_id);
$teamStmt->execute();
$teamResult = $teamStmt->get_result();

if ($teamResult->num_rows === 0) {
  echo json_encode([
    "success" => false,
    "message" => "You need a team before joining a tournament."
  ]);
  exit;
}

$team = $teamResult->fetch_assoc();
$team_id = $team["team_id"];

$countStmt = $conn->prepare("
  SELECT COUNT(*) AS total 
  FROM team_members 
  WHERE team_id = ? AND status = 'accepted'
");

$countStmt->bind_param("i", $team_id);
$countStmt->execute();
$count = $countStmt->get_result()->fetch_assoc();

if ((int)$count["total"] < 5) {
  echo json_encode([
    "success" => false,
    "message" => "Your team needs at least 5 members to join."
  ]);
  exit;
}

$tournamentStmt = $conn->prepare("
  SELECT status, registration_deadline 
  FROM tournaments 
  WHERE id = ?
");

$tournamentStmt->bind_param("i", $tournament_id);
$tournamentStmt->execute();
$tournament = $tournamentStmt->get_result()->fetch_assoc();

if (!$tournament) {
  echo json_encode([
    "success" => false,
    "message" => "Tournament not found."
  ]);
  exit;
}

if ($tournament["status"] === "complete" || strtotime($tournament["registration_deadline"]) < time()) {
  echo json_encode([
    "success" => false,
    "message" => "Registration is already closed."
  ]);
  exit;
}

$checkStmt = $conn->prepare("
  SELECT id 
  FROM tournament_registrations 
  WHERE tournament_id = ? AND team_id = ?
  LIMIT 1
");

$checkStmt->bind_param("ii", $tournament_id, $team_id);
$checkStmt->execute();

if ($checkStmt->get_result()->num_rows > 0) {
  echo json_encode([
    "success" => false,
    "message" => "Your team is already registered."
  ]);
  exit;
}

$stmt = $conn->prepare("
  INSERT INTO tournament_registrations 
  (tournament_id, team_id, registered_by)
  VALUES (?, ?, ?)
");

$stmt->bind_param("iii", $tournament_id, $team_id, $user_id);

$success = $stmt->execute();

echo json_encode([
  "success" => $success,
  "message" => $success ? "Tournament registration successful." : "Failed to register."
]);
?>