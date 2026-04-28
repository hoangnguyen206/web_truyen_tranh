<?php
// backend/helpers/response.php

function jsonResponse($data = null, $message = '', $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data'    => $data
    ]);
    exit;
}

function errorResponse($message = 'An error occurred', $code = 400, $data = null) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    
    echo json_encode([
        'success' => false,
        'message' => $message,
        'data'    => $data
    ]);
    exit;
}
