<?php
include "config.php";

$sql = "
SELECT 
  t.id,
  t.title,
  t.tournament_date,
  t.venue,
  t.prize_pool,
  t.organizer,
  t.registration_deadline,
  t.status,
  COUNT(tr.id) AS total_teams
FROM tournaments t
LEFT JOIN tournament_registrations tr 
  ON t.id = tr.tournament_id
GROUP BY t.id
ORDER BY t.tournament_date ASC
";

$result = $conn->query($sql);

$tournaments = [];

while ($row = $result->fetch_assoc()) {
  $tournaments[] = $row;
}

echo json_encode([
  "success" => true,
  "tournaments" => $tournaments
]);
?>