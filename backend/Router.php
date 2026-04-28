<?php
// backend/Router.php

class Router {
    private $routes = [];

    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }

    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }

    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }

    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }

    private function addRoute($method, $path, $handler) {
        // Convert route params like {slug} to regex
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<\1>[a-zA-Z0-9_-]+)', $path);
        $pattern = "#^" . $pattern . "$#";
        $this->routes[] = [
            'method' => $method,
            'pattern' => $pattern,
            'handler' => $handler
        ];
    }

    public function dispatch($requestUri, $requestMethod) {
        // Remove query string from URI
        $uri = parse_url($requestUri, PHP_URL_PATH);
        // Strip base path if necessary, assuming /api is the prefix
        // We'll leave it as is, and patterns should match /api/...

        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && preg_match($route['pattern'], $uri, $matches)) {
                // Filter named parameters
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);

                // Execute handler
                if (is_callable($route['handler'])) {
                    call_user_func_array($route['handler'], [$params]);
                } else if (is_string($route['handler'])) {
                    // "Controller@method" or just require a file
                    // Here we just use an anonymous function or include file logic
                    // We'll define routes with closures that include the appropriate API file
                }
                return;
            }
        }

        // Handle 404
        require_once __DIR__ . '/helpers/response.php';
        errorResponse('Not Found', 404);
    }
}
