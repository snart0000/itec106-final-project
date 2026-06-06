<?php
include "config.php";
include "create_notification.php";

$data = json_decode(file_get_contents("php://input"), true);

$team_id = $data["team_id"];
$user_id = $data["user_id"];

$checkTeam = $conn->prepare("
  SELECT id
  FROM team_members
  WHERE user_id = ? AND status = 'accepted'
  LIMIT 1
");

$checkTeam->bind_param("i", $user_id);
$checkTeam->execute();

if ($checkTeam->get_result()->num_rows > 0) {
  echo json_encode([
    "success" => false,
    "message" => "You already have a team."
  ]);
  exit;
}

$countStmt = $conn->prepare("
  SELECT COUNT(*) AS total
  FROM team_members
  WHERE team_id = ? AND status = 'accepted'
");

$countStmt->bind_param("i", $team_id);
$countStmt->execute();
$count = $countStmt->get_result()->fetch_assoc();

if ((int)$count["total"] >= 7) {
  echo json_encode([
    "success" => false,
    "message" => "This team is already full."
  ]);
  exit;
}

$checkApplication = $conn->prepare("
  SELECT id
  FROM team_applications
  WHERE team_id = ? AND user_id = ? AND status = 'pending'
  LIMIT 1
");

$checkApplication->bind_param("ii", $team_id, $user_id);
$checkApplication->execute();

if ($checkApplication->get_result()->num_rows > 0) {
  echo json_encode([
    "success" => false,
    "message" => "You already submitted an application."
  ]);
  exit;
}

$stmt = $conn->prepare("
  INSERT INTO team_applications (team_id, user_id, status)
  VALUES (?, ?, 'pending')
");

$stmt->bind_param("ii", $team_id, $user_id);
$success = $stmt->execute();

if ($success) {
  $leaderStmt = $conn->prepare("SELECT leader_id FROM teams WHERE id = ?");
  $leaderStmt->bind_param("i", $team_id);
  $leaderStmt->execute();
  $leader = $leaderStmt->get_result()->fetch_assoc();

  createNotification(
    $conn,
    $leader["leader_id"],
    "New Team Application",
    "A player submitted an application to join your team.",
    "team"
  );
}

echo json_encode([
  "success" => $success,
  "message" => $success ? "Application submitted." : "Failed to submit application."
]);
?>