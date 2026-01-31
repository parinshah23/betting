#!/bin/bash

echo "================================"
echo "PHASE 2 API TEST SUITE"
echo "================================"
echo ""

BASE_URL="http://localhost:3001"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASS="password123"
USER_EMAIL="user@example.com"
USER_PASS="password123"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test an endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected=$4
    local desc=$5
    
    echo -n "Testing $desc... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint")
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

echo "--- PUBLIC ENDPOINTS ---"
test_endpoint "GET" "/health" "" "status.*ok" "Health check"
test_endpoint "GET" "/api/competitions" "" "success.*true" "Get competitions"
test_endpoint "GET" "/api/competitions/featured" "" "success.*true" "Get featured competitions"
test_endpoint "GET" "/api/winners" "" "success.*true" "Get winners"

# Generate unique email for registration test to avoid conflicts
UNIQUE_EMAIL="testuser$(date +%s)@test.com"

echo ""
echo "--- AUTHENTICATION ---"
test_endpoint "POST" "/api/auth/register" "{\"email\":\"$UNIQUE_EMAIL\",\"password\":\"password123\",\"first_name\":\"Test\",\"last_name\":\"User\"}" "success.*true" "User registration"
test_endpoint "POST" "/api/auth/login" "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" "success.*true" "Admin login"
test_endpoint "POST" "/api/auth/login" "{\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASS\"}" "success.*true" "User login"

echo ""
echo "--- SKILL-BASED ENTRY ---"
test_endpoint "POST" "/api/competitions/verify-answer" '{"competition_id":"8a056ac2-4f15-4686-beb6-c4b1b1c1d474","answer":"4"}' "success.*true" "Verify correct answer"
test_endpoint "POST" "/api/competitions/verify-answer" '{"competition_id":"8a056ac2-4f15-4686-beb6-c4b1b1c1d474","answer":"5"}' "success.*true" "Verify wrong answer"

echo ""
echo "================================"
echo "RESULTS:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}SOME TESTS FAILED!${NC}"
    exit 1
fi
