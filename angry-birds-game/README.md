# 🐦 앵그리버드 게임 🐦

HTML5 Canvas와 JavaScript로 만든 클래식 앵그리버드 게임입니다!

## 🎮 게임 특징

- **물리 엔진**: 중력과 마찰력을 구현한 현실적인 물리 효과
- **충돌 감지**: 정확한 충돌 감지 시스템
- **시각적 효과**: 폭발 효과와 애니메이션
- **레벨 시스템**: 돼지를 모두 파괴하면 다음 레벨로 진행
- **점수 시스템**: 돼지 파괴 시 점수 획득
- **반응형 디자인**: 다양한 화면 크기에 대응

## 🎯 게임 방법

1. **새 발사**: 슬링샷에 있는 새를 클릭하고 드래그하여 발사 준비
2. **조준**: 마우스를 움직여 발사 방향과 힘을 조절
3. **발사**: 마우스를 놓아 새를 발사
4. **목표**: 모든 돼지를 파괴하여 레벨 클리어!

## 🎨 게임 요소

### 🐦 새 (Bird)
- 주황색 원형 캐릭터
- 슬링샷에서 발사
- 물리 법칙에 따라 움직임
- 블록이나 돼지와 충돌 시 파괴

### 🐷 돼지 (Pig)
- 초록색 원형 캐릭터
- 파괴해야 할 목표
- 파괴 시 100점 획득

### 🧱 블록 (Block)
- 갈색 나무 블록
- 돼지를 보호하는 장애물
- 충돌 시 파괴되며 물리 효과 발생

## 🚀 실행 방법

1. 모든 파일을 같은 폴더에 저장
2. `index.html` 파일을 웹 브라우저에서 열기
3. 게임 시작!

## 📁 파일 구조

```
angry-birds-game/
├── index.html      # 메인 HTML 파일
├── style.css       # 스타일시트
├── game.js         # 게임 로직
└── README.md       # 이 파일
```

## 🎮 조작법

- **마우스 클릭 + 드래그**: 새 발사 준비
- **마우스 놓기**: 새 발사
- **다시 시작 버튼**: 게임 재시작
- **일시정지 버튼**: 게임 일시정지/재개

## 🔧 기술 스택

- **HTML5**: 게임 구조
- **CSS3**: 스타일링 및 애니메이션
- **JavaScript ES6+**: 게임 로직 및 물리 엔진
- **Canvas API**: 2D 그래픽 렌더링

## 🎯 게임 목표

- 모든 돼지를 파괴하여 레벨 클리어
- 최대한 높은 점수 획득
- 효율적으로 새를 사용하여 모든 돼지 파괴

---

**즐거운 게임 되세요! 🎮** 