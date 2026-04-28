<?php
require_once 'backend/config/database.php';

$sql = file_get_contents('database/migration_views.sql');
$conn->multi_query($sql);
do {
    if ($result = $conn->store_result()) {
        $result->free();
    }
} while ($conn->next_result());

echo "Migration completed.\n";
