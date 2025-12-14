#!/bin/bash

# API Testing Script for Instagram Clone Backend
# Make sure your backend server is running on port 5001

BASE_URL="http://localhost:5001"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Instagram Clone API Testing"
echo "=========================================="
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "Status: $http_code"
echo "Response: $body"
if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
fi
echo ""

# Test 2: Signup
echo -e "${YELLOW}Test 2: User Signup${NC}"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@example.com"
TEST_USERNAME="testuser${TIMESTAMP}"
signup_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USERNAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"password123\",
    \"fullName\": \"Test User\"
  }" \
  -c /tmp/cookies.txt)
signup_code=$(echo "$signup_response" | tail -n1)
signup_body=$(echo "$signup_response" | sed '$d')
echo "Status: $signup_code"
echo "Response: $signup_body"
if [ "$signup_code" == "201" ]; then
    echo -e "${GREEN}✓ Signup passed${NC}"
    USER_ID=$(echo "$signup_body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "User ID: $USER_ID"
    echo "Email: $TEST_EMAIL"
    # Signup already sets cookies, so we can continue
else
    echo -e "${RED}✗ Signup failed${NC}"
    if [ "$signup_code" == "400" ]; then
        echo "User might already exist, trying login instead..."
        # Try login with a known test user
        TEST_EMAIL="test@example.com"
    fi
fi
echo ""

# Test 3: Login (only if signup didn't work or we need to test login separately)
if [ "$signup_code" != "201" ]; then
    echo -e "${YELLOW}Test 3: User Login${NC}"
    login_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"password123\"
      }" \
      -c /tmp/cookies.txt)
    login_code=$(echo "$login_response" | tail -n1)
    login_body=$(echo "$login_response" | sed '$d')
    echo "Status: $login_code"
    if [ "$login_code" == "200" ]; then
        echo -e "${GREEN}✓ Login passed${NC}"
        USER_ID=$(echo "$login_body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "User ID: $USER_ID"
    else
        echo -e "${RED}✗ Login failed${NC}"
        echo "Response: $login_body"
        echo "Cannot continue without authentication"
        exit 1
    fi
    echo ""
else
    echo -e "${YELLOW}Test 3: User Login (skipped - using signup session)${NC}"
    echo -e "${GREEN}✓ Using authenticated session from signup${NC}"
    echo ""
fi

# Test 4: Get Current User (Me)
echo -e "${YELLOW}Test 4: Get Current User${NC}"
me_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/auth/me" -b /tmp/cookies.txt)
me_code=$(echo "$me_response" | tail -n1)
me_body=$(echo "$me_response" | sed '$d')
echo "Status: $me_code"
if [ "$me_code" == "200" ]; then
    echo -e "${GREEN}✓ Get current user passed${NC}"
    USER_ID=$(echo "$me_body" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "User ID: $USER_ID"
else
    echo -e "${RED}✗ Get current user failed${NC}"
    echo "Response: $me_body"
fi
echo ""

if [ -z "$USER_ID" ]; then
    echo -e "${RED}ERROR: Could not get USER_ID. Cannot continue with remaining tests.${NC}"
    exit 1
fi

# Test 5: Create Post
echo -e "${YELLOW}Test 5: Create Post${NC}"
create_post_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/posts" \
  -H "Content-Type: application/json" \
  -b /tmp/cookies.txt \
  -d '{
    "imageUrl": "https://picsum.photos/800/800",
    "caption": "This is a test post created via API"
  }')
create_post_code=$(echo "$create_post_response" | tail -n1)
create_post_body=$(echo "$create_post_response" | sed '$d')
echo "Status: $create_post_code"
echo "Response: $create_post_body"
if [ "$create_post_code" == "201" ]; then
    echo -e "${GREEN}✓ Create post passed${NC}"
    # Extract post _id from the response using Python for proper JSON parsing
    POST_ID=$(echo "$create_post_body" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('post', {}).get('_id', ''))" 2>/dev/null)
    if [ -z "$POST_ID" ]; then
        # Fallback: try to extract using grep (look for _id after "post":{)
        POST_ID=$(echo "$create_post_body" | grep -oP '"post":\{[^}]*"_id":"\K[^"]+' | head -1)
    fi
    echo "Post ID: $POST_ID"
else
    echo -e "${RED}✗ Create post failed${NC}"
    echo "Response: $create_post_body"
fi
echo ""

# Test 6: Get Post
if [ ! -z "$POST_ID" ]; then
    echo -e "${YELLOW}Test 6: Get Post${NC}"
    get_post_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/posts/$POST_ID" -b /tmp/cookies.txt)
    get_post_code=$(echo "$get_post_response" | tail -n1)
    get_post_body=$(echo "$get_post_response" | sed '$d')
    echo "Status: $get_post_code"
    if [ "$get_post_code" == "200" ]; then
        echo -e "${GREEN}✓ Get post passed${NC}"
    else
        echo -e "${RED}✗ Get post failed${NC}"
    fi
    echo ""
fi

# Test 7: Like Post
if [ ! -z "$POST_ID" ]; then
    echo -e "${YELLOW}Test 7: Like Post${NC}"
    like_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/posts/$POST_ID/like" -b /tmp/cookies.txt)
    like_code=$(echo "$like_response" | tail -n1)
    echo "Status: $like_code"
    if [ "$like_code" == "200" ]; then
        echo -e "${GREEN}✓ Like post passed${NC}"
    else
        echo -e "${RED}✗ Like post failed${NC}"
    fi
    echo ""
fi

# Test 8: Add Comment
if [ ! -z "$POST_ID" ]; then
    echo -e "${YELLOW}Test 8: Add Comment${NC}"
    comment_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/posts/$POST_ID/comments" \
      -H "Content-Type: application/json" \
      -b /tmp/cookies.txt \
      -d '{
        "text": "This is a test comment"
      }')
    comment_code=$(echo "$comment_response" | tail -n1)
    comment_body=$(echo "$comment_response" | sed '$d')
    echo "Status: $comment_code"
    if [ "$comment_code" == "201" ]; then
        echo -e "${GREEN}✓ Add comment passed${NC}"
        # Extract comment _id using Python
        COMMENT_ID=$(echo "$comment_body" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('comment', {}).get('_id', ''))" 2>/dev/null)
        if [ -z "$COMMENT_ID" ]; then
            COMMENT_ID=$(echo "$comment_body" | grep -oP '"_id":"\K[^"]+' | head -1)
        fi
        echo "Comment ID: $COMMENT_ID"
    else
        echo -e "${RED}✗ Add comment failed${NC}"
        echo "Response: $comment_body"
    fi
    echo ""
fi

# Test 9: Get Post Comments
if [ ! -z "$POST_ID" ]; then
    echo -e "${YELLOW}Test 9: Get Post Comments${NC}"
    get_comments_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/posts/$POST_ID/comments" -b /tmp/cookies.txt)
    get_comments_code=$(echo "$get_comments_response" | tail -n1)
    echo "Status: $get_comments_code"
    if [ "$get_comments_code" == "200" ]; then
        echo -e "${GREEN}✓ Get comments passed${NC}"
    else
        echo -e "${RED}✗ Get comments failed${NC}"
    fi
    echo ""
fi

# Test 10: Get Feed
echo -e "${YELLOW}Test 10: Get Feed${NC}"
feed_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/feed" -b /tmp/cookies.txt)
feed_code=$(echo "$feed_response" | tail -n1)
echo "Status: $feed_code"
if [ "$feed_code" == "200" ]; then
    echo -e "${GREEN}✓ Get feed passed${NC}"
else
    echo -e "${YELLOW}⚠ Get feed returned $feed_code (might be empty if no followed users)${NC}"
fi
echo ""

# Test 11: Get User Profile
echo -e "${YELLOW}Test 11: Get User Profile${NC}"
profile_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/users/$USER_ID" -b /tmp/cookies.txt)
profile_code=$(echo "$profile_response" | tail -n1)
echo "Status: $profile_code"
if [ "$profile_code" == "200" ]; then
    echo -e "${GREEN}✓ Get user profile passed${NC}"
else
    echo -e "${RED}✗ Get user profile failed${NC}"
fi
echo ""

# Test 12: Get User Posts
echo -e "${YELLOW}Test 12: Get User Posts${NC}"
user_posts_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/users/$USER_ID/posts" -b /tmp/cookies.txt)
user_posts_code=$(echo "$user_posts_response" | tail -n1)
echo "Status: $user_posts_code"
if [ "$user_posts_code" == "200" ]; then
    echo -e "${GREEN}✓ Get user posts passed${NC}"
else
    echo -e "${RED}✗ Get user posts failed${NC}"
fi
echo ""

# Test 12.5: Create a second user for follow testing
echo -e "${YELLOW}Test 12.5: Create Second User for Follow Test${NC}"
TIMESTAMP2=$(date +%s)
TEST_EMAIL2="testuser2${TIMESTAMP2}@example.com"
TEST_USERNAME2="testuser2${TIMESTAMP2}"
signup2_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USERNAME2\",
    \"email\": \"$TEST_EMAIL2\",
    \"password\": \"password123\",
    \"fullName\": \"Test User 2\"
  }" \
  -c /tmp/cookies2.txt)
signup2_code=$(echo "$signup2_response" | tail -n1)
signup2_body=$(echo "$signup2_response" | sed '$d')
if [ "$signup2_code" == "201" ]; then
    USER2_ID=$(echo "$signup2_body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "${GREEN}✓ Second user created: $USER2_ID${NC}"
    # Switch back to first user's cookies
    cp /tmp/cookies.txt /tmp/cookies_backup.txt 2>/dev/null
else
    echo -e "${YELLOW}⚠ Could not create second user for follow test${NC}"
    USER2_ID=""
fi
echo ""

# Test 12.6: Follow User (if we have a second user)
if [ ! -z "$USER2_ID" ] && [ "$USER2_ID" != "$USER_ID" ]; then
    echo -e "${YELLOW}Test 12.6: Follow User${NC}"
    follow_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/users/$USER2_ID/follow" -b /tmp/cookies.txt)
    follow_code=$(echo "$follow_response" | tail -n1)
    echo "Status: $follow_code"
    if [ "$follow_code" == "200" ]; then
        echo -e "${GREEN}✓ Follow user passed${NC}"
    else
        echo -e "${RED}✗ Follow user failed${NC}"
        echo "Response: $(echo "$follow_response" | sed '$d')"
    fi
    echo ""
    
    # Test 12.7: Unfollow User
    echo -e "${YELLOW}Test 12.7: Unfollow User${NC}"
    unfollow_response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/api/users/$USER2_ID/follow" -b /tmp/cookies.txt)
    unfollow_code=$(echo "$unfollow_response" | tail -n1)
    echo "Status: $unfollow_code"
    if [ "$unfollow_code" == "200" ]; then
        echo -e "${GREEN}✓ Unfollow user passed${NC}"
    else
        echo -e "${RED}✗ Unfollow user failed${NC}"
    fi
    echo ""
fi

# Test 13: Unlike Post
if [ ! -z "$POST_ID" ]; then
    echo -e "${YELLOW}Test 13: Unlike Post${NC}"
    unlike_response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/api/posts/$POST_ID/like" -b /tmp/cookies.txt)
    unlike_code=$(echo "$unlike_response" | tail -n1)
    echo "Status: $unlike_code"
    if [ "$unlike_code" == "200" ]; then
        echo -e "${GREEN}✓ Unlike post passed${NC}"
    else
        echo -e "${RED}✗ Unlike post failed${NC}"
    fi
    echo ""
fi

# Test 14: Delete Comment
if [ ! -z "$POST_ID" ] && [ ! -z "$COMMENT_ID" ]; then
    echo -e "${YELLOW}Test 14: Delete Comment${NC}"
    delete_comment_response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/api/posts/$POST_ID/comments/$COMMENT_ID" -b /tmp/cookies.txt)
    delete_comment_code=$(echo "$delete_comment_response" | tail -n1)
    echo "Status: $delete_comment_code"
    if [ "$delete_comment_code" == "200" ]; then
        echo -e "${GREEN}✓ Delete comment passed${NC}"
    else
        echo -e "${RED}✗ Delete comment failed${NC}"
    fi
    echo ""
fi

# Test 15: Delete Post
if [ ! -z "$POST_ID" ]; then
    echo -e "${YELLOW}Test 15: Delete Post${NC}"
    delete_post_response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/api/posts/$POST_ID" -b /tmp/cookies.txt)
    delete_post_code=$(echo "$delete_post_response" | tail -n1)
    echo "Status: $delete_post_code"
    if [ "$delete_post_code" == "200" ]; then
        echo -e "${GREEN}✓ Delete post passed${NC}"
    else
        echo -e "${RED}✗ Delete post failed${NC}"
    fi
    echo ""
fi

# Test 16: Logout
echo -e "${YELLOW}Test 16: Logout${NC}"
logout_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/logout" -b /tmp/cookies.txt)
logout_code=$(echo "$logout_response" | tail -n1)
echo "Status: $logout_code"
if [ "$logout_code" == "200" ]; then
    echo -e "${GREEN}✓ Logout passed${NC}"
else
    echo -e "${RED}✗ Logout failed${NC}"
fi
echo ""

echo "=========================================="
echo "API Testing Complete!"
echo "=========================================="

