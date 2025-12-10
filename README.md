# 🎬 NeonFlix (TMDB React SPA)

## 개요 (Overview)
- TMDB 기반 영화 탐색/추천 Single Page Application.
- 로그인/회원가입, 위시리스트(LocalStorage 연동)까지 포함한 미니 OTT 스타일 웹앱.
- Popular/Table/Infinite Scroll, Search/필터, Wishlist(LocalStorage 전용)를 갖춘 과제형 프로젝트.
- Angular Demo와 확연히 다른 다크+레드 네온 컨셉, 페이지/카드/버튼에 다양한 애니메이션 적용.

## 데모 (Demo)
- 배포 URL: https://jooho-le.github.io/Front-End-Demo_Site_PB/

## 주요 기능 (Features)
- TMDB 영화 리스트: 인기/상영중/평점 상위/개봉 예정 등 4개 이상 엔드포인트 사용.
- 로그인/회원가입 + Remember me, TMDB API 키(비밀번호) LocalStorage 저장.
- 위시리스트: 영화 카드 클릭/버튼으로 찜 토글, LocalStorage 동기화, Wishlist 페이지는 API 호출 없이 로컬 데이터만 사용.
- Popular 페이지: Table View + Infinite Scroll View, 페이징/로드, Top 버튼.
- Search 페이지: 검색 + 필터(장르/평점/정렬), 필터 초기화.
- Wishlist 페이지: LocalStorage 기반 테이블 뷰, 제거 버튼으로 즉시 동기화.
- 반응형 레이아웃, hover/페이지 전환/모달 등 애니메이션, 아이콘 활용(react-icons).

## 페이지 / 라우트 (Pages & Routes)
- `/` Home: 인기/상영중/평점상위/개봉예정 섹션을 가로 스크롤 Row로 표시.
- `/popular` Popular: Table 뷰(페이지네이션) + Infinite Scroll 뷰, Top 버튼.
- `/search` Search: 검색 입력 + 장르/평점/정렬 필터, 필터 초기화.
- `/wishlist` Wishlist: LocalStorage에 저장된 찜 목록만 테이블로 표시(이미지/제목/평점/개봉일/제거).
- `/signin` 로그인: 이메일/비밀번호 + Remember me, 로그인 성공 시 홈으로 이동.
- `/signup` 회원가입: 이메일/비밀번호/비밀번호 확인/약관 동의, 완료 후 로그인 화면 전환.

## 기술 스택 (Tech Stack)
- Framework/Libraries: React 18, React Router 6, Axios, react-icons
- Styling/Animation: CSS, 커스텀 애니메이션 (hover, fade/slide 페이지 전환, 모달 팝업 등)
- Data/API: TMDB REST API (axios 인스턴스), LocalStorage
- Build/Tooling: react-scripts (CRA), TypeScript, npm
- DevOps: Git, GitHub Actions, GitHub Pages

## TMDB & 데이터 처리
- 주요 엔드포인트: `/movie/popular`, `/movie/now_playing`, `/movie/top_rated`, `/movie/upcoming`, `/search/movie`, `/genre/movie/list`
- 공통 파라미터: `api_key`, `language=ko-KR`, `region=KR`, `page`
- LocalStorage 키 예시:
  - `netflix-lite:users` (계정 목록), `netflix-lite:currentUser`, `netflix-lite:login`
  - `netflix-lite:tmdb-key` (비밀번호를 TMDB 키로 저장하는 흐름 기준)
  - `netflix-lite:wishlist` (찜한 영화 배열)

## Git Flow 전략 (Workflow)
- 브랜치: `main`(배포), `develop`(통합), `feature/*`(기능별)
- 흐름: 새 기능 → `feature/*` 개발 → PR → `develop` 머지 → 필요 시 `main` 머지 후 배포
- 예시 브랜치: `feature/layout-fancy-base`, `feature/auth-forms-guard`, `feature/popular-views`, `feature/search-filters`, `feature/wishlist-page`, `feature/ref-hook-animations`

## 폴더 구조 (Project Structure)
```
src/
  api/               # TMDB 클라이언트/타입
  components/
    auth/            # AuthForm, AuthModal 등
    common/          # Spinner, TopButton 등
    layout/          # Header, Footer, MainLayout
    movie/           # MovieCard, MovieRow
  context/           # AuthContext, WishlistContext
  hooks/             # useMovies 등 커스텀 훅
  pages/             # Home, Popular, Search, Wishlist, SignIn, SignUp 등
  routes/            # ProtectedRoute
  styles/            # global/card/layout 스타일
  index.tsx, App.tsx
```

## 설치 및 실행 (Getting Started)
- 요구 버전: Node 20+, npm
```
git clone https://github.com/jooho-le/Front-End-Demo_Site_PB.git
cd Front-End-Demo_Site_PB
npm install
```
- 환경변수: `.env`에 `REACT_APP_TMDB_API_KEY=...` 등 TMDB 키 설정 (`.env.example` 참고)
- 개발 서버: `npm start`
- 빌드: `npm run build`

## 배포 (Deployment)
- GitHub Actions + GitHub Pages
- 트리거: `main` 브랜치 푸시 시 워크플로우(`.github/workflows/deploy.yml`) 실행 → 빌드 → Pages 배포
- 워크플로우는 Node 20, `npm ci`/`npm run build` 후 `actions/deploy-pages` 사용

## 과제 요구사항 매핑 (Assignment Checklist)
- SPA & Router: React Router 기반 단일 페이지 앱
- TMDB 엔드포인트 4개 이상 사용: popular/now_playing/top_rated/upcoming/search/genre 등
- LocalStorage 3종 이상: users/currentUser/login/tmdb-key/wishlist 등
- Auth: 로그인/회원가입 + Remember me, 이메일 검증, 약관 동의
- Popular: Table View + Infinite Scroll, 페이지네이션/Top 버튼, 로딩/에러 UI
- Search: 검색 + 장르/평점/정렬 필터, 필터 초기화
- Wishlist: LocalStorage 데이터만 사용, 테이블 뷰, 제거 버튼으로 즉시 동기화
- 위시/카드: hover 확대, 위시 뱃지/하트 토글, fancy 스타일
- 페이지 전환: MainLayout 기반 fade/slide 애니메이션
- Git Flow: main/develop/feature-* 브랜치 전략 + PR 머지

즐거운 시네마 탐험을! 🚀
