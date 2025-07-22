# 🧮 계산기 서비스

간단하고 빠른 계산을 위한 웹 기반 계산기 서비스입니다.

## ✨ 기능

- **기본 연산**: 더하기, 빼기, 곱하기, 나누기
- **고급 연산**: 거듭제곱, 퍼센트 계산, 제곱근
- **웹 인터페이스**: 직관적이고 아름다운 UI
- **REST API**: 다른 애플리케이션에서 사용 가능한 API

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 서버 실행

```bash
# 개발 모드 (자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

### 3. 웹 브라우저에서 접속

서버가 실행되면 다음 URL로 접속하세요:
```
http://localhost:3000
```

## 📚 API 문서

### 서버 상태 확인
```
GET /api/health
```

**응답:**
```json
{
  "status": "OK",
  "message": "계산기 서비스가 정상적으로 작동 중입니다."
}
```

### 기본 연산 (두 숫자)
```
POST /api/calculate
```

**요청 본문:**
```json
{
  "operation": "add|subtract|multiply|divide|power|percentage",
  "a": 10,
  "b": 5
}
```

**응답:**
```json
{
  "operation": "add",
  "a": 10,
  "b": 5,
  "result": 15,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 단일 숫자 연산
```
POST /api/calculate/single
```

**요청 본문:**
```json
{
  "operation": "sqrt",
  "a": 16
}
```

**응답:**
```json
{
  "operation": "sqrt",
  "a": 16,
  "result": 4,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🔧 지원하는 연산

| 연산 | 설명 | 예시 |
|------|------|------|
| `add` | 더하기 | 5 + 3 = 8 |
| `subtract` | 빼기 | 10 - 4 = 6 |
| `multiply` | 곱하기 | 6 × 7 = 42 |
| `divide` | 나누기 | 15 ÷ 3 = 5 |
| `power` | 거듭제곱 | 2³ = 8 |
| `percentage` | 퍼센트 | 200의 25% = 50 |
| `sqrt` | 제곱근 | √16 = 4 |

## 🛠️ 기술 스택

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Package Manager**: npm

## 📁 프로젝트 구조

```
calculator-service/
├── package.json          # 프로젝트 설정 및 의존성
├── server.js             # Express 서버
├── public/
│   └── index.html        # 웹 인터페이스
└── README.md             # 프로젝트 문서
```

## 🐛 오류 처리

서비스는 다음과 같은 오류 상황을 처리합니다:

- **0으로 나누기**: "0으로 나눌 수 없습니다."
- **음수 제곱근**: "음수의 제곱근은 계산할 수 없습니다."
- **잘못된 연산**: "지원하지 않는 연산입니다."
- **필수 파라미터 누락**: "필수 파라미터가 누락되었습니다."

## 🔒 보안 고려사항

- CORS 설정으로 웹 브라우저에서 API 호출 가능
- 입력값 검증 및 오류 처리
- 안전한 수학 연산 (0으로 나누기 등 방지)

## 📝 라이선스

MIT License

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 만드세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

---

**즐거운 계산 되세요! 🧮✨** 