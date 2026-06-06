<?php
include "config.php";

$team_name = $_POST["team_name"] ?? "";
$team_logo = $_POST["team_logo"] ?? "";
$leader_id = $_POST["leader_id"] ?? 0;

$check = $conn->prepare("
  SELECT id 
  FROM team_members 
  WHERE user_id = ? AND status = 'accepted'
  LIMIT 1
");

$check->bind_param("i", $leader_id);
$check->execute();

$checkResult = $check->get_result();

if ($checkResult->num_rows > 0) {
  echo json_encode([
    "success" => false,
    "message" => "You already have a team."
  ]);
  exit;
}

if (isset($_FILES["team_logo_file"]) && $_FILES["team_logo_file"]["error"] === 0) {
  $uploadDir = "upload/team_logos/";

  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
  }

  $fileName = time() . "_" . basename($_FILES["team_logo_file"]["name"]);
  $targetPath = $uploadDir . $fileName;

  if (move_uploaded_file($_FILES["team_logo_file"]["tmp_name"], $targetPath)) {
    $team_logo = $targetPath;
  }
}

$stmt = $conn->prepare("
  INSERT INTO teams (team_name, team_logo, leader_id) 
  VALUES (?, ?, ?)
");

$stmt->bind_param("ssi", $team_name, $team_logo, $leader_id);

if ($stmt->execute()) {
  $team_id = $conn->insert_id;

  $member = $conn->prepare("
    INSERT INTO team_members (team_id, user_id, status) 
    VALUES (?, ?, 'accepted')
  ");

  $member->bind_param("ii", $team_id, $leader_id);
  $member->execute();

  echo json_encode([
    "success" => true,
    "team_id" => $team_id
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Failed to create team."
  ]);
}
?>