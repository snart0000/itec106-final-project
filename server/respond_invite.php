<?php
include "config.php";
include "create_notification.php";

$data = json_decode(file_get_contents("php://input"), true);

$invite_id = $data["invite_id"];
$user_id = $data["user_id"];
$status = $data["status"];

if ($status !== "accepted" && $status !== "declined") {
  echo json_encode([
    "success" => false,
    "message" => "Invalid response."
  ]);
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
$userTeamResult = $checkUserTeam->get_result();

if ($status === "accepted" && $userTeamResult->num_rows > 0) {
  echo json_encode([
    "success" => false,
    "message" => "You already have a team."
  ]);
  exit;
}

$getInvite = $conn->prepare("
  SELECT team_id 
  FROM team_members 
  WHERE id = ? AND user_id = ? AND status = 'pending'
  LIMIT 1
");

$getInvite->bind_param("ii", $invite_id, $user_id);
$getInvite->execute();
$inviteResult = $getInvite->get_result();

if ($inviteResult->num_rows === 0) {
  echo json_encode([
    "success" => false,
    "message" => "Invite not found."
  ]);
  exit;
}

$invite = $inviteResult->fetch_assoc();
$team_id = $invite["team_id"];

if ($status === "accepted") {
  $countMembers = $conn->prepare("
    SELECT COUNT(*) AS total 
    FROM team_members 
    WHERE team_id = ? AND status = 'accepted'
  ");

  $countMembers->bind_param("i", $team_id);
  $countMembers->execute();
  $countResult = $countMembers->get_result();
  $count = $countResult->fetch_assoc();

  if ((int)$count["total"] >= 7) {
    echo json_encode([
      "success" => false,
      "message" => "This team is already full."
    ]);
    exit;
  }

  $stmt = $conn->prepare("
    UPDATE team_members 
    SET status = 'accepted' 
    WHERE id = ?
  ");

  $stmt->bind_param("i", $invite_id);
  $success = $stmt->execute();

  echo json_encode([
    "success" => $success,
    "message" => $success ? "Invite accepted." : "Failed to accept invite."
  ]);

  createNotification(
  $conn,
  $user_id,
  "Joined Team",
  "You accepted a team invitation and joined the team.",
  "team"
);

  exit;
}

$stmt = $conn->prepare("
  UPDATE team_members 
  SET status = 'declined' 
  WHERE id = ?
");

$stmt->bind_param("i", $invite_id);
$success = $stmt->execute();

echo json_encode([
  "success" => $success,
  "message" => $success ? "Invite declined." : "Failed to decline invite."
]);

createNotification(
  $conn,
  $user_id,
  "Declined Invite",
  "You declined a team invitation.",
  "team"
);
?>