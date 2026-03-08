## auth notes

current setup is:

- refresh token lives in an `httpOnly` cookie
- same refresh token is stored hashed in DB (`User.refreshTokenHash`)
- access token is short-lived and should stay in frontend memory (not `localStorage`)

when access token expires, frontend hits `/auth/refresh` (with credentials). backend verifies refresh token + rotates both tokens.

logout clears cookie + sets `refreshTokenHash` to `null`.

this gives a decent balance:

- safer long-lived token handling (`httpOnly`)
- short access token window
- refresh rotation

## google oauth (already working)

flow:

1. user goes to `GET /auth/google`
2. backend sends them to google consent screen
3. google sends them back to `GET /auth/google/callback`
4. backend finds linked `OAuthAccount` (or creates/links user)
5. backend issues app tokens just like normal login
6. frontend can call `/auth/refresh` to get a fresh access token when needed

linking behavior:

- existing oauth account -> login that user
- same verified email as existing user -> link provider to that user
- otherwise -> create new user + create oauth account row

## tiktok login kit (planned)

intended flow:

1. user goes to `GET /auth/tiktok`
2. backend generates `state`, stores it in cookie, redirects to tiktok auth
3. tiktok returns to callback with `code` + `state`
4. backend validates `state`
5. backend exchanges `code` for tokens
6. backend fetches tiktok user info (`open_id`, profile fields)
7. backend links/creates local user
8. backend issues normal app tokens (same model as email/google)
