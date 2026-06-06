<?php
include "config.php";
include "create_notification.php";

$data = json_decode(file_get_contents("php://input"), true);

$application_id = $data["application_id"];
$team_id = $data["team_id"];
$leader_id = $data["leader_id"];
$user_id = $data["user_id"];
$status = $data["status"];

if ($status !== "accepted" && $status !== "declined") {
  echo json_encode(["success" => false, "message" => "Invalid status."]);
  exit;
}

$leaderCheck = $conn->prepare("
  SELECT id
  FROM teams
  WHERE id = ? AND leader_id = ?
  LIMIT 1
");

$leaderCheck->bind_param("ii", $team_id, $leader_id);
$leaderCheck->execute();

if ($leaderCheck->get_result()->num_rows === 0) {
  echo json_encode(["success" => false, "message" => "Only leader can manage applications."]);
  exit;
}

if ($status === "accepted") {
  $countStmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM team_members
    WHERE team_id = ? AND status = 'accepted'
  ");

  $countStmt->bind_param("i", $team_id);
  $countStmt->execute();
  $count = $countStmt->get_result()->fetch_assoc();

  if ((int)$count["total"] >= 7) {
    echo json_encode(["success" => false, "message" => "Team is already full."]);
    exit;
  }

  $checkUserTeam = $conn->prepare("
    SELECT id
    FROM team_members
    WHERE user_id = ? AND status = 'accepted'
    LIMIT 1
  ");

  $checkUserTeam->bind_param("i", $user_id);
  $checkUserTeam->execute();

  if ($checkUserTeam->get_result()->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Player already has a team."]);
    exit;
  }

  $addMember = $conn->prepare("
    INSERT INTO team_members (team_id, user_id, status, invited_by)
    VALUES (?, ?, 'accepted', ?)
  ");

  $addMember->bind_param("iii", $team_id, $user_id, $leader_id);
  $addMember->execute();

  createNotification(
    $conn,
    $user_id,
    "Application Accepted",
    "Your application to join a team was accepted.",
    "team"
  );
}

$update = $conn->prepare("
  UPDATE team_applications
  SET status = ?
  WHERE id = ?
");

$update->bind_param("si", $status, $application_id);
$success = $update->execute();

if ($status === "declined") {
  createNotification(
    $conn,
    $user_id,
    "Application Declined",
    "Your application to join a team was declined.",
    "team"
  );
}

echo json_encode([
  "success" => $success,
  "message" => $status === "accepted" ? "Application accepted." : "Application declined."
]);
?>