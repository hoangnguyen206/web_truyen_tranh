<?php
// backend/api/auth.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';

// Google OAuth configuration
define('GOOGLE_CLIENT_ID', $_ENV['GOOGLE_CLIENT_ID'] ?? getenv('GOOGLE_CLIENT_ID'));
define('GOOGLE_CLIENT_SECRET', $_ENV['GOOGLE_CLIENT_SECRET'] ?? getenv('GOOGLE_CLIENT_SECRET'));

// Cố định đường dẫn callback để tránh lỗi redirect_uri_mismatch
define('GOOGLE_REDIRECT_URI', $_ENV['GOOGLE_REDIRECT_URI'] ?? getenv('GOOGLE_REDIRECT_URI') ?: 'http://localhost:8000/auth/google/callback');

function handleLogin() {
    global $conn;
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['email']) || !isset($input['password'])) {
        errorResponse('Vui lòng nhập đầy đủ email và mật khẩu', 400);
    }
    
    $email = $conn->real_escape_string($input['email']);
    $password = $input['password'];
    
    // Find user by email
    $stmt = $conn->prepare("SELECT user_id, username, name, email, password, avatar, roles FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        errorResponse('Email hoặc mật khẩu không đúng', 401);
    }
    
    $user = $result->fetch_assoc();
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        errorResponse('Email hoặc mật khẩu không đúng', 401);
    }
    
    // Set session
    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['user_name'] = $user['name'] ?: $user['username'];
    $_SESSION['user_email'] = $user['email'];
    
    jsonResponse([
        'user' => [
            'id' => $user['user_id'],
            'name' => $user['name'] ?: $user['username'],
            'email' => $user['email'],
            'avatar' => $user['avatar'],
            'roles' => $user['roles']
        ]
    ], 'Đăng nhập thành công');
}

function handleRegister() {
    global $conn;
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($input['username']) || !isset($input['email']) || !isset($input['password']) || !isset($input['name'])) {
        errorResponse('Vui lòng nhập đầy đủ thông tin', 400);
    }
    
    $username = trim($input['username']);
    $name = trim($input['name']);
    $email = trim($input['email']);
    $password = $input['password'];
    
    // Validate
    if (strlen($username) < 3) {
        errorResponse('Tên người dùng phải có ít nhất 3 ký tự', 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        errorResponse('Email không hợp lệ', 400);
    }
    if (strlen($password) < 6) {
        errorResponse('Mật khẩu phải có ít nhất 6 ký tự', 400);
    }
    
    // Check if username or email already exists
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        errorResponse('Tên người dùng hoặc email đã tồn tại', 409);
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (username, name, email, password, roles) VALUES (?, ?, ?, ?, 'user')");
    $stmt->bind_param("ssss", $username, $name, $email, $hashedPassword);
    
    if (!$stmt->execute()) {
        errorResponse('Không thể tạo tài khoản. Vui lòng thử lại.', 500);
    }
    
    $userId = $conn->insert_id;
    
    // Auto login after register
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    
    jsonResponse([
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'avatar' => null,
            'roles' => 'user'
        ]
    ], 'Đăng ký thành công');
}

function handleLogout() {
    session_destroy();
    jsonResponse(null, 'Đăng xuất thành công');
}

function handleGetMe() {
    global $conn;
    if (isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];
        $stmt = $conn->prepare("SELECT user_id, username, name, email, avatar, roles FROM users WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            jsonResponse([
                'id' => $user['user_id'],
                'name' => $user['name'] ?: $user['username'],
                'email' => $user['email'],
                'avatar' => $user['avatar'],
                'roles' => $user['roles']
            ]);
        }
    }
    errorResponse('Not authenticated', 401);
}

/**
 * Google OAuth: Return the authorization URL
 */
function handleGoogleAuthUrl() {
    if (empty(GOOGLE_CLIENT_ID)) {
        errorResponse('Google OAuth chưa được cấu hình. Vui lòng thiết lập GOOGLE_CLIENT_ID trong môi trường.', 503);
    }
    
    $params = [
        'client_id' => GOOGLE_CLIENT_ID,
        'redirect_uri' => GOOGLE_REDIRECT_URI,
        'response_type' => 'code',
        'scope' => 'openid email profile',
        'access_type' => 'offline',
        'prompt' => 'consent'
    ];
    
    $url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
    
    jsonResponse(['url' => $url]);
}

/**
 * Google OAuth: Exchange code for token and get user info
 */
function handleGoogleCallback() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $code = $input['code'] ?? null;
    
    if (!$code) {
        errorResponse('Mã xác thực không hợp lệ', 400);
    }
    
    if (empty(GOOGLE_CLIENT_ID) || empty(GOOGLE_CLIENT_SECRET)) {
        errorResponse('Google OAuth chưa được cấu hình', 503);
    }
    
    // Exchange code for tokens
    $tokenUrl = 'https://oauth2.googleapis.com/token';
    $postData = [
        'code' => $code,
        'client_id' => GOOGLE_CLIENT_ID,
        'client_secret' => GOOGLE_CLIENT_SECRET,
        'redirect_uri' => GOOGLE_REDIRECT_URI,
        'grant_type' => 'authorization_code'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $tokenUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $tokenResponse = curl_exec($ch);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($tokenResponse === false) {
        errorResponse('Lỗi kết nối tới Google: ' . $curlError, 500);
    }
    
    $tokenData = json_decode($tokenResponse, true);
    
    if (!isset($tokenData['access_token'])) {
        $errorMsg = 'Unknown error';
        if (isset($tokenData['error_description'])) {
            $errorMsg = $tokenData['error_description'];
        } else if (isset($tokenData['error'])) {
            $errorMsg = $tokenData['error'];
        } else {
            $errorMsg = $tokenResponse;
        }
        errorResponse('Không thể xác thực với Google (Token API): ' . $errorMsg . ' | Raw: ' . $tokenResponse, 401);
    }
    
    $accessToken = $tokenData['access_token'];
    
    // Get user info from Google
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://www.googleapis.com/oauth2/v2/userinfo');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $accessToken]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $userInfoResponse = curl_exec($ch);
    $userInfoError = curl_error($ch);
    curl_close($ch);
    
    if ($userInfoResponse === false) {
        errorResponse('Lỗi kết nối tới Google UserInfo: ' . $userInfoError, 500);
    }
    
    $googleUser = json_decode($userInfoResponse, true);
    
    if (!isset($googleUser['email'])) {
        errorResponse('Không thể lấy thông tin từ Google', 401);
    }
    
    $googleEmail = $googleUser['email'];
    $googleName = $googleUser['name'] ?? $googleUser['email'];
    $googleAvatar = $googleUser['picture'] ?? null;
    $googleId = $googleUser['id'] ?? '';
    
    // Check if user already exists with this email
    $stmt = $conn->prepare("SELECT user_id, username, name, email, avatar, roles FROM users WHERE email = ?");
    $stmt->bind_param("s", $googleEmail);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Existing user - update avatar from Google if not set
        $user = $result->fetch_assoc();
        
        if (empty($user['avatar']) && $googleAvatar) {
            $updateStmt = $conn->prepare("UPDATE users SET avatar = ? WHERE user_id = ?");
            $updateStmt->bind_param("si", $googleAvatar, $user['user_id']);
            $updateStmt->execute();
            $user['avatar'] = $googleAvatar;
        }
        
        // Set session
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_name'] = $user['name'] ?: $user['username'];
        $_SESSION['user_email'] = $user['email'];
        
        jsonResponse([
            'user' => [
                'id' => $user['user_id'],
                'name' => $user['name'] ?: $user['username'],
                'email' => $user['email'],
                'avatar' => $user['avatar'] ?: $googleAvatar,
                'roles' => $user['roles']
            ]
        ], 'Đăng nhập Google thành công');
    } else {
        // New user - create account
        $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $googleName)) . '_' . substr($googleId, -4);
        $randomPass = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO users (username, name, email, password, avatar, roles) VALUES (?, ?, ?, ?, ?, 'user')");
        $stmt->bind_param("sssss", $username, $googleName, $googleEmail, $randomPass, $googleAvatar);
        
        if (!$stmt->execute()) {
            errorResponse('Không thể tạo tài khoản Google', 500);
        }
        
        $userId = $conn->insert_id;
        
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_name'] = $googleName;
        $_SESSION['user_email'] = $googleEmail;
        
        jsonResponse([
            'user' => [
                'id' => $userId,
                'name' => $googleName,
                'email' => $googleEmail,
                'avatar' => $googleAvatar,
                'roles' => 'user'
            ]
        ], 'Đăng ký Google thành công');
    }
}
