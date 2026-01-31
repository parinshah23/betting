#!/bin/bash

echo "================================"
echo "PHASE 2 AUTHENTICATED API TESTS"
echo "================================"
echo ""

BASE_URL="http://localhost:3001"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASS="password123"

# Get admin token
echo "Getting admin token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}")
ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
    echo "Failed to get admin token!"
    exit 1
fi

echo "✓ Admin token acquired"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

PASSED=0
FAILED=0

# Function to test authenticated endpoint
test_auth_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected=$4
    local desc=$5
    
    echo -n "Testing $desc... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d "$data")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN")
    fi
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "  Response: $response"
        ((FAILED++))
    fi
}

echo "--- AUTHENTICATED USER ROUTES ---"
test_auth_endpoint "GET" "/api/auth/me" "" "success.*true" "Get current user"
test_auth_endpoint "GET" "/api/users/profile" "" "success.*true" "Get user profile"

echo ""
echo "--- ADMIN ROUTES ---"
test_auth_endpoint "GET" "/api/admin/competitions" "" "success.*true" "Admin get all competitions"
test_auth_endpoint "GET" "/api/admin/users" "" "success.*true" "Admin get all users"
test_auth_endpoint "GET" "/api/admin/orders" "" "success.*true" "Admin get all orders"
test_auth_endpoint "GET" "/api/admin/content" "" "success.*true" "Admin get content"

echo ""
echo "================================"
echo "RESULTS:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}ALL AUTHENTICATED TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}SOME TESTS FAILED!${NC}"
    exit 1
fi
