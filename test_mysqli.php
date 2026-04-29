<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    $conn = new mysqli(null, 'root', '', 'test', null, '/tmp/bad.sock');
} catch (mysqli_sql_exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
