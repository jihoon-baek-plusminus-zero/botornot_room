# Bot or Not Room - 웹 기반 웹앱 서비스

## 📋 프로젝트 개요

**Bot or Not Room**은 웹 기반의 웹앱 서비스로, GitHub를 통한 버전 관리, Supabase를 통한 데이터베이스 관리, 그리고 Vercel을 통한 배포를 목표로 하는 프로젝트입니다.

### 🎯 주요 목표
- 웹 기반 웹앱 서비스 개발 및 배포
- GitHub를 통한 체계적인 버전 관리
- Supabase를 활용한 효율적인 데이터베이스 관리
- Vercel을 통한 안정적인 프로덕션 배포

### 🛠️ 기술 스택
- **프론트엔드**: HTML, CSS, JavaScript (추후 프레임워크 추가 예정)
- **백엔드**: Supabase (데이터베이스, 인증, API)
- **배포**: Vercel
- **버전 관리**: GitHub
- **개발 환경**: Cursor IDE

---

## 🔧 세부적인 개발 방식

### 1. 개발 환경 설정
- Cursor IDE를 통한 AI 지원 개발
- GitHub 저장소 생성 및 초기 설정
- Supabase 프로젝트 생성 및 설정
- Vercel 프로젝트 연결

### 2. 개발 워크플로우
1. **기능 기획**: AI와 협업하여 기능 요구사항 정의
2. **코드 작성**: AI 지원을 받아 효율적인 코드 작성
3. **테스트**: 기능별 단위 테스트 및 통합 테스트
4. **커밋**: GitHub에 단계별 커밋 및 푸시
5. **배포**: Vercel을 통한 자동 배포

### 3. 데이터베이스 설계
- Supabase를 통한 테이블 설계
- API 엔드포인트 설계 및 구현
- 인증 및 권한 관리 시스템 구축

---

## 📝 개발 로그 기록

### 2024년 12월 19일 (목요일) - 프로젝트 초기 설정
**시간**: 오후 (현재 시간 기준)

#### ✅ 추가된 항목
- README.md 파일 생성
- 프로젝트 개요 및 목표 정의
- 개발 방식 및 워크플로우 정의
- 개발 로그 기록 시스템 구축
- 함수/변수 기록 섹션 생성
- 공통지침 문서화

#### 🔄 수정된 항목
- 없음 (초기 생성)

#### ❌ 삭제된 항목
- 없음 (초기 생성)

#### 📋 작업 내용
- 프로젝트의 전체적인 구조와 방향성 설정
- AI와의 협업을 위한 개발 로그 시스템 구축
- 향후 개발 과정에서 참고할 수 있는 가이드라인 작성

---

## 🔍 함수명, 변수명 등 기록

### 📁 파일 구조
```
botornot_room/
├── README.md
├── index.html (예정)
├── styles/
│   └── main.css (예정)
├── scripts/
│   └── main.js (예정)
└── docs/ (예정)
```

### 🏗️ 예상 주요 함수/변수 (개발 진행에 따라 업데이트)
- **함수명**: `initializeApp()`, `handleUserInput()`, `processData()`
- **변수명**: `userData`, `appConfig`, `databaseConnection`
- **클래스명**: `UserManager`, `DataProcessor`, `APIClient`

### 📊 데이터베이스 테이블 구조 (예정)
- **users**: 사용자 정보 테이블
- **sessions**: 세션 관리 테이블
- **data**: 주요 데이터 저장 테이블

---

## 📋 공통지침

### 1. 코드 작성 규칙
- **네이밍 컨벤션**: camelCase 사용 (JavaScript)
- **주석**: 한국어로 상세한 설명 작성
- **들여쓰기**: 2칸 공백 사용
- **파일명**: 소문자와 하이픈(-) 사용

### 2. 커밋 메시지 규칙
- **형식**: `[타입] 간단한 설명`
- **예시**: `[추가] 사용자 인증 기능 구현`, `[수정] 로그인 폼 유효성 검사 개선`
- **타입**: 추가, 수정, 삭제, 리팩토링, 문서화

### 3. 개발 로그 작성 규칙
- **절대 기존 개발 기록을 수정하지 않음**
- **새로운 개발 내용은 항상 하단에 추가**
- **날짜와 시간을 명확히 기록**
- **추가/수정/삭제된 항목을 구분하여 기록**

### 4. AI 협업 규칙
- **명확한 요구사항 제시**: 구체적이고 명확한 기능 요청
- **단계별 개발**: 복잡한 기능은 작은 단위로 분할하여 개발
- **코드 리뷰**: AI가 제안한 코드에 대한 검토 및 피드백
- **문서화**: 모든 주요 기능에 대한 README 업데이트

### 5. 테스트 및 배포 규칙
- **기능별 테스트**: 각 기능 구현 후 기본적인 테스트 수행
- **단계별 배포**: 개발 → 스테이징 → 프로덕션 순서로 진행
- **백업**: 중요한 변경사항 전 백업 생성

---

## 🚀 다음 단계

### 즉시 진행할 작업
1. GitHub 저장소 생성 및 초기 설정
2. Supabase 프로젝트 생성
3. 기본 HTML/CSS/JavaScript 파일 생성
4. Vercel 프로젝트 연결

### 단기 목표 (1주 내)
- 기본 웹앱 구조 구축
- Supabase 연결 및 기본 데이터베이스 설정
- GitHub 저장소에 초기 코드 커밋

### 중기 목표 (1개월 내)
- 핵심 기능 구현 완료
- 테스트 및 디버깅
- Vercel을 통한 첫 배포

---

## 📞 연락처 및 참고자료

- **프로젝트 저장소**: [https://github.com/jihoon-baek-plusminus-zero/botornot_room.git](https://github.com/jihoon-baek-plusminus-zero/botornot_room.git)
- **배포 URL**: [Vercel 링크 예정]
- **데이터베이스**: [https://llncdkeyaqsnbveocoaz.supabase.co](https://llncdkeyaqsnbveocoaz.supabase.co)
- **Supabase Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbmNka2V5YXFzbmJ2ZW9jb2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3OTUzOTYsImV4cCI6MjA3MjM3MTM5Nn0.rM86JtTF2-3w__rtwyHU39SDU10XyV2BqiTfJ2Pi3kM`

---

*이 README는 프로젝트 진행 상황에 따라 지속적으로 업데이트됩니다. 개발 로그는 절대 기존 내용을 수정하지 않고 하단에 추가하는 방식으로 관리됩니다.*

---

## 📝 개발 로그 기록 (계속)

### 2024년 12월 19일 (목요일) - 프로젝트 링크 정보 추가
**시간**: 오후 (현재 시간 기준)

#### ✅ 추가된 항목
- GitHub 저장소 링크: https://github.com/jihoon-baek-plusminus-zero/botornot_room.git
- Supabase 데이터베이스 링크: https://llncdkeyaqsnbveocoaz.supabase.co
- Supabase Anon Public Key 정보 추가

#### 🔄 수정된 항목
- 연락처 및 참고자료 섹션의 링크 정보 업데이트

#### ❌ 삭제된 항목
- 없음

#### 📋 작업 내용
- 실제 GitHub 저장소 및 Supabase 프로젝트 링크 정보 반영
- README 문서의 실용성 향상
- 향후 개발 시 참고할 수 있는 실제 링크 정보 제공

---

### 2024년 12월 19일 (목요일) - 메인 화면 기본 구조 구현
**시간**: 오후 (현재 시간 기준)

#### ✅ 추가된 항목
- `index.html` 파일 생성 - 메인 화면 기본 구조
- `styles/main.css` 파일 생성 - 현대적인 UI 스타일링
- `scripts/main.js` 파일 생성 - 기본 JavaScript 기능
- 1:1 접속 및 1:N 접속 버튼 구현
- 반응형 디자인 적용
- 호버 효과 및 애니메이션 추가

#### 🔄 수정된 항목
- 없음

#### ❌ 삭제된 항목
- 없음

#### 📋 작업 내용
- 메인 화면의 기본적인 HTML 구조 구축
- 그라데이션 배경과 현대적인 버튼 디자인 적용
- 모바일 및 데스크톱 환경을 고려한 반응형 레이아웃 구현
- 버튼 클릭 시 개발 중임을 알리는 기본 기능 구현
- 향후 기능 확장을 위한 JavaScript 구조 설계
