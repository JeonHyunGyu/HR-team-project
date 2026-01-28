# 포상 시스템 문서

## 목차
1. [시스템 개요](#시스템-개요)
2. [권한 체계](#권한-체계)
3. [포상 정책 관리](#포상-정책-관리)
4. [포상 후보 추천](#포상-후보-추천)
5. [AI 추천 기능](#ai-추천-기능)
6. [포상 이력 조회](#포상-이력-조회)
7. [데이터베이스 구조](#데이터베이스-구조)
8. [API 엔드포인트](#api-엔드포인트)

---

## 시스템 개요

HR 시스템의 사원 포상 기능으로, 포상 정책 관리부터 후보 추천, AI 기반 추천, 포상 이력 조회까지 전체 포상 프로세스를 지원합니다.

### 주요 기능
- **포상 정책 관리**: 포상 종류와 유형 설정
- **포상 후보 추천**: 직급별 권한에 따라 하위 직원 추천
- **AI 추천**: 평가 데이터 기반 자동 포상 후보 추천
- **포상 이력 조회**: 본인이 받은 포상 결과 확인

### 기술 스택
- **백엔드**: Spring Boot, JPA
- **프론트엔드**: React, Axios
- **AI 엔진**: Python (PyTorch BERT), OpenAI API
- **데이터베이스**: Oracle

---

## 권한 체계

### 포상 정책 관리 권한
- **접근 가능 직급**: `REWARD` (포상 관리자), `CEO`
- **기능**: 포상 정책 추가, 수정, 삭제
- **권한 없는 경우**: 조회만 가능, 수정 불가

### 포상 후보 추천 권한
- **CEO**:
  - LEADER 추천 가능
  - 모든 LEADER 목록 조회

- **LEADER**:
  - 같은 부서의 일반 사원 추천 가능
  - 본인 부서의 팀원 목록만 조회 (LEADER, CEO 제외)

- **일반 사원 (EMP)**:
  - 추천 불가
  - 본인이 받은 포상 이력 조회만 가능

### 포상 상태 관리
- **PENDING**: 추천 대기 중
- **APPROVED**: 승인됨
- **REJECTED**: 거절됨

---

## 포상 정책 관리

### 개요
포상에 사용될 정책을 정의하고 유형을 설정합니다.

### 주요 기능

#### 1. 포상 정책 조회
```java
// 백엔드: RewardPolicyService.java
public List<RewardPolicyDTO> getAllPolicies()
```
- 모든 포상 정책 조회
- 권한과 관계없이 모든 사용자가 조회 가능

#### 2. 포상 정책 추가
```java
// 백엔드: RewardPolicyController.java
@PostMapping
public ResponseEntity<Long> createPolicy(Authentication authentication,
                                         @RequestBody RewardPolicyDTO dto)
```
- **권한**: REWARD 또는 CEO만 가능
- **필수 정보**: 정책명, 포상 유형, 설명
- **기본값**: isActive = 'Y' (활성화)

#### 3. 포상 정책 수정
```java
@PutMapping("/{id}")
public ResponseEntity<Void> updatePolicy(Authentication authentication,
                                         @PathVariable Long id,
                                         @RequestBody RewardPolicyDTO dto)
```
- **권한**: REWARD 또는 CEO만 가능
- 기존 정책의 내용 수정

#### 4. 포상 정책 삭제
```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> deletePolicy(Authentication authentication,
                                         @PathVariable Long id)
```
- **권한**: REWARD 또는 CEO만 가능

### 기본 포상 유형
| 유형 | 설명 |
|------|------|
| 프로젝트 MVP | 프로젝트 성과 기여도 우수자 |
| 팀워크상 | 팀 협업 및 소통 우수자 |
| 기술 제안 채택 | 기술 개선 및 혁신 제안자 |
| 리더십상 | 조직 관리 및 멘토링 우수자 |
| 고객만족상 | 고객 서비스 우수자 |
| 분기 우수사원 | 분기별 최우수 성과자 |
| 장기 근속 포상 | 장기 근속 헌신자 |

### API 엔드포인트
- `GET /api/reward/policy/current-user` - 현재 사용자 정보 조회
- `GET /api/reward/policy` - 포상 정책 목록 조회
- `GET /api/reward/policy/{id}` - 특정 포상 정책 조회
- `POST /api/reward/policy` - 포상 정책 생성
- `PUT /api/reward/policy/{id}` - 포상 정책 수정
- `DELETE /api/reward/policy/{id}` - 포상 정책 삭제

---

## 포상 후보 추천

### 개요
CEO와 LEADER가 하위 직원을 포상 후보로 추천하는 기능입니다.

### 주요 기능

#### 1. 추천 가능 대상자 조회
```java
// 백엔드: RewardCandidateService.java
public List<NomineeDTO> getNominees(String email)
```
- **CEO**: 모든 LEADER 조회
- **LEADER**: 같은 부서의 일반 사원만 조회 (LEADER, CEO 제외)

#### 2. 포상 후보 추천
```java
@PostMapping
public ResponseEntity<Long> nominateCandidate(Authentication authentication,
                                              @RequestBody RewardCandidateDTO dto)
```
- **필수 정보**:
  - 포상 정책 (policyId)
  - 피추천자 (nomineeId)
  - 추천 사유 (reason)
  - 포상 금액 (rewardAmount) - 선택사항

- **자동 설정값**:
  - nominationType: 'MANUAL' (수동 추천)
  - status: 'PENDING' (대기 중)

#### 3. 내가 추천한 목록 조회
```java
@GetMapping("/my-nominations")
public ResponseEntity<List<RewardCandidateDTO>> getMyNominations(Authentication authentication)
```
- 본인이 추천한 후보만 조회
- 추천일, 상태, 피추천자 정보 표시

#### 4. 전체 추천 목록 조회
```java
@GetMapping("/all")
public ResponseEntity<List<RewardCandidateDTO>> getAllCandidates(Authentication authentication)
```
- 관리자용 전체 추천 목록 조회

### 추천 프로세스
1. 추천 가능 대상자 목록에서 선택
2. 적용할 포상 정책 선택
3. 추천 사유 작성
4. 포상 금액 입력 (선택)
5. "추천 등록" 버튼 클릭
6. 상태: PENDING으로 등록

### API 엔드포인트
- `GET /api/reward/candidate/current-user` - 현재 사용자 정보 조회
- `GET /api/reward/candidate/permission` - 추천 권한 체크
- `GET /api/reward/candidate/nominees` - 추천 가능 대상자 목록 조회
- `POST /api/reward/candidate` - 포상 후보 추천 등록
- `GET /api/reward/candidate/my-nominations` - 내가 추천한 목록 조회
- `GET /api/reward/candidate/all` - 전체 추천 목록 조회

---

## AI 추천 기능

### 개요
평가 시스템의 평가 데이터를 기반으로 AI가 포상 후보를 자동 추천하는 기능입니다.

### AI 엔진 구조

#### 1. Python AI 서비스 (Primary)
```java
// 백엔드: AiRecommendationService.java
private AiRecommendationDTO generateWithPython(Emp emp, List<RewardPolicy> policies,
                                                Double avgScore, List<String> comments)
```
- **기술**: PyTorch BERT 감성 분석
- **엔드포인트**: `http://localhost:5000/recommend`
- **기능**: 평가 코멘트 분석 및 포상 정책 매칭

#### 2. OpenAI API (Secondary)
```java
private AiRecommendationDTO generateWithOpenAI(Emp emp, List<RewardPolicy> policies,
                                                Double avgScore, List<String> comments)
```
- **기술**: GPT-4 기반 자연어 처리
- **기능**: 평가 코멘트 분석 및 추천 사유 생성

#### 3. Rule-based 추천 (Fallback)
```java
private AiRecommendationDTO generateWithRules(Emp emp, List<RewardPolicy> policies,
                                               Double avgScore, List<String> comments)
```
- **기술**: 키워드 매칭 규칙
- **기능**: AI 서비스 장애 시 대체 추천

### 키워드 매핑 규칙
```java
KEYWORD_MAPPING = {
  "프로젝트 MVP": ["프로젝트", "기여도", "성과", "완료", "목표달성", "주도", "핵심"],
  "팀워크상": ["팀원", "협업", "지원", "소통", "조화", "배려", "도움"],
  "기술 제안 채택": ["기술", "개선", "제안", "혁신", "효율", "자동화", "최적화"],
  "리더십상": ["리더십", "관리", "이끌", "조직", "방향", "멘토", "지도"],
  "고객만족상": ["고객", "서비스", "만족", "응대", "해결", "친절", "신속"],
  "분기 우수사원": ["우수", "뛰어남", "탁월", "모범", "최고", "훌륭", "인정"],
  "장기 근속 포상": ["근속", "헌신", "충성", "오랜", "꾸준", "성실"]
}
```

### 주요 기능

#### 1. AI 추천 목록 조회
```java
@GetMapping("/ai-recommendations")
public ResponseEntity<List<AiRecommendationDTO>> getAiRecommendations(Authentication authentication)
```
- 추천 가능한 모든 대상자에 대해 AI 분석 수행
- 평가 평균 점수, 코멘트, 추천 포상 표시
- **부정적 평가는 자동 제외**

#### 2. 특정 직원 AI 추천 상세
```java
@GetMapping("/ai-recommendations/{empId}")
public ResponseEntity<AiRecommendationDTO> getAiRecommendationDetail(
    Authentication authentication, @PathVariable String empId)
```
- 특정 직원에 대한 상세 AI 분석 결과
- 매칭 점수, 매칭 키워드, 추천 사유 표시

#### 3. AI 추천 기반 포상 등록
```java
@PostMapping("/ai-nominate")
public ResponseEntity<Long> nominateFromAiRecommendation(Authentication authentication,
                                                         @RequestBody RewardCandidateDTO dto)
```
- AI 추천을 승인하여 포상 후보로 등록
- nominationType: 'AI'로 설정

### AI 추천 응답 구조
```java
AiRecommendationDTO {
    // 직원 정보
    String empId;
    String empName;
    String empRole;
    String deptName;

    // 평가 정보
    Double avgScore;
    List<String> comments;
    String latestComment;

    // AI 추천 결과
    List<RecommendedReward> recommendedRewards;
    String newRewardSuggestion;      // 신규 포상 제안
    String overallRecommendReason;   // 전체 추천 사유
    Double recommendationScore;       // 추천 점수
}
```

### API 엔드포인트
- `GET /api/reward/candidate/ai-recommendations` - AI 추천 목록 조회
- `GET /api/reward/candidate/ai-recommendations/{empId}` - 특정 직원 AI 추천 상세
- `POST /api/reward/candidate/ai-nominate` - AI 추천 기반 포상 등록

---

## 포상 이력 조회

### 개요
사원이 자신이 받은 승인된 포상 결과를 조회하는 기능입니다.

### 주요 기능

#### 1. 내 포상 이력 조회
```java
// 백엔드: RewardCandidateService.java
public List<RewardCandidateDTO> getMyApprovedRewards(String email)
```
- 본인이 받은 승인된(APPROVED) 포상만 조회
- 포상 정책, 추천자, 추천 사유, 포상 금액 표시

### API 엔드포인트
- `GET /api/reward/candidate/my-rewards` - 본인의 승인된 포상 이력 조회

---

## 데이터베이스 구조

### 1. RewardPolicy (포상 정책)
```java
@Entity
@Table(name = "REWARD_POLICY")
public class RewardPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reward_policy_seq")
    @SequenceGenerator(name = "reward_policy_seq", sequenceName = "REWARD_POLICY_SEQ", allocationSize = 1)
    private Long policyId;             // 정책 ID

    @Column(length = 100)
    private String policyName;         // 정책명

    @Column(length = 50)
    private String rewardType;         // 포상 유형

    @Column(length = 255)
    private String description;        // 설명

    @Column(length = 1)
    private String isActive;           // 활성화 여부 (Y/N)

    @CreationTimestamp
    private LocalDateTime createdAt;   // 생성일
}
```

### 2. RewardCandidate (포상 후보)
```java
@Entity
@Table(name = "REWARD_CANDIDATE")
public class RewardCandidate {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reward_candidate_seq")
    @SequenceGenerator(name = "reward_candidate_seq", sequenceName = "REWARD_CANDIDATE_SEQ", allocationSize = 1)
    private Long candidateId;          // 후보 ID

    private Long policyId;             // 포상 정책 ID (FK)

    @Column(length = 20)
    private String nominatorId;        // 추천자 사번

    @Column(length = 20)
    private String nomineeId;          // 피추천자 사번

    @Column(length = 10)
    private String nominationType;     // 추천 유형 (MANUAL, AI)

    @Column(length = 500)
    private String reason;             // 추천 사유

    private Long rewardAmount;         // 포상 금액

    @Column(length = 20)
    private String status;             // 상태 (PENDING, APPROVED, REJECTED)

    @CreationTimestamp
    private LocalDateTime createdAt;   // 생성일

    @UpdateTimestamp
    private LocalDateTime updatedAt;   // 수정일
}
```

### 관계도
```
Emp (직원)
  ↓ 1:N (추천자/피추천자)
RewardCandidate (포상 후보)
  ↓ N:1
RewardPolicy (포상 정책)

EvaluationResult (평가 결과)
  ↓ (AI 분석 데이터)
AiRecommendationService
  ↓ (추천 생성)
RewardCandidate (포상 후보)
```

---

## API 엔드포인트

### 포상 정책 관리 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/reward/policy/current-user` | 현재 사용자 정보 조회 | 모두 |
| GET | `/api/reward/policy` | 포상 정책 목록 조회 | 모두 |
| GET | `/api/reward/policy/{id}` | 특정 포상 정책 조회 | 모두 |
| POST | `/api/reward/policy` | 포상 정책 생성 | REWARD, CEO |
| PUT | `/api/reward/policy/{id}` | 포상 정책 수정 | REWARD, CEO |
| DELETE | `/api/reward/policy/{id}` | 포상 정책 삭제 | REWARD, CEO |

### 포상 후보 추천 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/reward/candidate/current-user` | 현재 사용자 정보 조회 | 모두 |
| GET | `/api/reward/candidate/permission` | 추천 권한 체크 | 모두 |
| GET | `/api/reward/candidate/nominees` | 추천 가능 대상자 목록 조회 | CEO, LEADER |
| POST | `/api/reward/candidate` | 포상 후보 추천 등록 | CEO, LEADER |
| GET | `/api/reward/candidate/my-nominations` | 내가 추천한 목록 조회 | CEO, LEADER |
| GET | `/api/reward/candidate/all` | 전체 추천 목록 조회 | 모두 |
| GET | `/api/reward/candidate/my-rewards` | 본인의 승인된 포상 이력 조회 | 모두 |

### AI 추천 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/reward/candidate/ai-recommendations` | AI 추천 목록 조회 | CEO, LEADER |
| GET | `/api/reward/candidate/ai-recommendations/{empId}` | 특정 직원 AI 추천 상세 | CEO, LEADER |
| POST | `/api/reward/candidate/ai-nominate` | AI 추천 기반 포상 등록 | CEO, LEADER |

---

## 파일 구조

### 백엔드 (src/main/java/boot/team/hr/gyu)

```
gyu/
├── controller/
│   ├── RewardPolicyController.java       # 포상 정책 관리 컨트롤러
│   └── RewardCandidateController.java    # 포상 후보 추천 컨트롤러
│
├── service/
│   ├── RewardPolicyService.java          # 포상 정책 관리 서비스
│   ├── RewardCandidateService.java       # 포상 후보 추천 서비스
│   └── AiRecommendationService.java      # AI 추천 서비스
│
├── repository/
│   ├── RewardPolicyRepository.java       # 포상 정책 리포지토리
│   └── RewardCandidateRepository.java    # 포상 후보 리포지토리
│
├── entity/
│   ├── RewardPolicy.java                 # 포상 정책 엔티티
│   └── RewardCandidate.java              # 포상 후보 엔티티
│
└── dto/
    ├── RewardPolicyDTO.java              # 포상 정책 DTO
    ├── RewardCandidateDTO.java           # 포상 후보 DTO
    ├── NomineeDTO.java                   # 추천 대상자 DTO
    ├── AiRecommendationDTO.java          # AI 추천 DTO
    └── PythonRecommendResponse.java      # Python AI 응답 DTO
```

### 프론트엔드 (vite/src/features/reward)

```
reward/
├── pages/
│   ├── Policy.jsx             # 포상 정책 관리 페이지
│   ├── Nominate.jsx           # 포상 후보 추천 페이지
│   ├── AiRecommend.jsx        # AI 추천 페이지
│   └── MyRewards.jsx          # 나의 포상 이력 페이지
│
├── api/
│   ├── policyApi.js           # 포상 정책 API
│   ├── candidateApi.js        # 포상 후보 API
│   └── aiApi.js               # AI 추천 API
│
└── styles/
    ├── Policy.css             # 포상 정책 스타일
    ├── Nominate.css           # 포상 추천 스타일
    └── AiRecommend.css        # AI 추천 스타일
```

---

## 로깅 및 디버깅

### 백엔드 로그
모든 주요 작업에서 `System.out.println`을 사용하여 로그 출력:

```java
System.out.println("[포상정책관리] 권한 체크 - 사용자: " + emp.getEmpName() +
                   ", 직급: " + emp.getEmpRole() + ", 권한 여부: " + hasPermission);
System.out.println("[AI추천] Python AI 서비스 호출 - 직원: " + emp.getEmpName());
```

### 로그 형식
```
[기능명] 작업내용 - 상세정보
```

예시:
- `[포상정책관리] 포상 정책 생성 - 정책명: 프로젝트 MVP`
- `[포상추천] 후보 추천 등록 - 피추천자: 홍길동, 정책: 팀워크상`
- `[AI추천] 추천 생성 완료 - 매칭 포상: 3개`

---

## 보안 고려사항

### 1. 인증 및 권한 체크
- 모든 API 엔드포인트에서 `Authentication` 객체를 통해 사용자 인증 확인
- 권한이 없는 경우 `401 Unauthorized` 또는 `403 Forbidden` 반환

### 2. 데이터 접근 제어
- **포상 정책**: REWARD, CEO만 수정 가능
- **포상 추천**: CEO는 LEADER만, LEADER는 팀원만 추천 가능
- **AI 추천**: 추천 가능 대상자만 분석
- **포상 이력**: 본인이 받은 포상만 조회 가능

### 3. 입력 검증
- 피추천자 선택 필수
- 포상 정책 선택 필수
- 추천 사유 입력 필수
- 포상 금액 범위 제한

---

## 개선 가능한 부분

### 1. 기능 확장
- 포상 승인 워크플로우 추가
- 포상 통계 및 대시보드
- 포상 예산 관리
- 정기 포상 자동화
- 포상 알림 기능

### 2. AI 기능 강화
- 더 정교한 감성 분석
- 팀/부서별 추천 최적화
- 추천 정확도 피드백 학습
- 다국어 지원

### 3. UX 개선
- 포상 추천 현황 시각화
- 포상 이력 타임라인
- 엑셀 다운로드 기능
- 모바일 최적화

### 4. 성능 최적화
- 페이지네이션 적용
- 검색 및 필터링 기능
- AI 추천 캐싱
- 비동기 처리

---

## 문의 및 지원

시스템 사용 중 문제가 발생하거나 문의사항이 있는 경우:
- 백엔드 폴더: `src/main/java/boot/team/hr/gyu`
- 프론트엔드 폴더: `vite/src/features/reward`
- 로그 확인: 브라우저 콘솔 및 서버 로그

---

**작성일**: 2026-01-26
**버전**: 1.0.0