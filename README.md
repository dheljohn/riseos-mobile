# RiseOS Mobile

A React Native wellness and productivity app that helps users track sleep, meals, and focus sessions — built with Expo and a Node.js backend.

Download Here

- <img src="https://github.com/user-attachments/assets/4c2e8cc5-0c23-4839-90f0-854bb530f2db" width="250" alt="qr-code" />

<!-- <img width="1083" height="1083" alt="qr-code" src="https://github.com/user-attachments/assets/4c2e8cc5-0c23-4839-90f0-854bb530f2db" /> -->

---

## Tech Stack

| Layer                    | Technology                                                                  |
| ------------------------ | --------------------------------------------------------------------------- |
| Framework                | [Expo](https://expo.dev) (SDK 54) / React Native                            |
| Language                 | TypeScript                                                                  |
| Routing                  | Expo Router v6 (file-based)                                                 |
| State (in-memory)        | [Zustand](https://zustand-demo.pmnd.rs/)                                    |
| Data Fetching            | [TanStack Query](https://tanstack.com/query) v5                             |
| HTTP Client              | [Axios](https://axios-http.com/)                                            |
| Persistent Token Storage | [Expo SecureStore](https://docs.expo.dev/versions/v54.0.0/sdk/securestore/) |
| Auth                     | JWT (access token + refresh token)                                          |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`) — for builds
- Android emulator or physical device

### Install & Run

```bash
git clone https://github.com/yourusername/riseos-mobile
cd riseos-mobile
npm install
npm start
```

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_URL=https://your-backend-url.com
```

> The following variables belong to the **backend** repo, not this app:
> `JWT_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`

---

## Project Structure

```
riseos-mobile/
├── app/
│   ├── _layout.tsx              # Root layout — font loading, auth init, navigation
│   ├── app.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (dashboard)/
│       ├── _layout.tsx          # Tab navigator with bottom nav bar
│       ├── index.tsx            # Home / summary screen
│       ├── sleep.tsx
│       ├── meals.tsx
│       └── focus.tsx
├── components/
│   ├── AuthInitializer.tsx      # Runs token refresh on cold start & foreground resume
│   ├── DashboardSkeleton.tsx
│   ├── DatePicker.tsx
│   ├── BottomNav.tsx
│   ├── auth/
│   │   └── AuthRedirect.tsx
│   ├── cards/
│   │   ├── Cardstyle.ts
│   │   ├── FocusCard.tsx
│   │   ├── MealCard.tsx
│   │   ├── PatternsCard.tsx
│   │   ├── PresetCard.tsx
│   │   ├── SleepCard.tsx
│   │   ├── StreakCard.tsx
│   │   └── newstreak.tsx
│   └── modal/
│       └── TimePreset.tsx
├── lib/
│   ├── api.ts                   # Axios instance with request/response interceptors
│   ├── secureStore.ts           # SecureStore helpers (save/get/delete refresh token)
│   ├── store.ts                 # Zustand auth store (access token + user, in-memory)
│   └── useNavigate.ts
├── service/
│   ├── focus.ts
│   ├── meals.ts
│   ├── sleep.ts
│   ├── summary.ts
│   └── hooks/
│       ├── useFocusLogs.ts
│       ├── useMealLogs.ts
│       ├── useSleepLogs.ts
│       └── useSummary.ts
├── styles/
│   ├── common.ts
│   └── theme.ts
├── types/
│   ├── logs.ts
│   ├── preset.ts
│   └── summary.ts
├── utils/
│   └── dateFormatter.ts
├── assets/
├── app.json
├── eas.json
└── .env
```

---

## Auth Flow

### Token Storage

| Token         | Storage             | Persistence                  |
| ------------- | ------------------- | ---------------------------- |
| Access token  | Zustand (in-memory) | Lost on app kill             |
| Refresh token | Expo SecureStore    | Persists across app restarts |

### Session Persistence

On every cold start and foreground resume, `AuthInitializer` runs the following:

1. Read refresh token from SecureStore
2. If none exists → clear auth state → redirect to login
3. If found → `POST /api/auth/refresh` with the refresh token
4. On success → save the new refresh token to SecureStore, set the new access token and user in Zustand → navigate to dashboard
5. On failure → delete the stale refresh token from SecureStore → clear auth state → redirect to login

### Token Rotation

The backend returns a new refresh token on every `/api/auth/refresh` call. The old token is replaced in SecureStore immediately after a successful refresh.

### Axios Interceptors (`lib/api.ts`)

- **Request** — attaches the current access token from Zustand as a `Bearer` header on every request
- **Response** — on a `401`, attempts a silent token refresh and retries the original request once. If the refresh also fails, clears auth and redirects to login. Refresh and login/register routes are excluded from the retry loop.

---

## Related Repos

| Repo                                                        | Description                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| [riseos-backend](https://github.com/dheljohn/riseos-backup) | Node.js REST API — auth, sleep, meals, focus, and summary endpoints |

---

## License

[MIT](LICENSE)
