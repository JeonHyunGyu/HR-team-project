ㄷ# 평가 시스템 문서

## 목차
1. [시스템 개요](#시스템-개요)
2. [권한 체계](#권한-체계)
3. [평가 항목 관리](#평가-항목-관리)
4. [평가 입력](#평가-입력)
5. [평가 조회](#평가-조회)
6. [데이터베이스 구조](#데이터베이스-구조)
7. [API 엔드포인트](#api-엔드포인트)

---

## 시스템 개요

HR 시스템의 사원 평가 기능으로, 평가 항목 관리부터 평가 입력, 조회까지 전체 평가 프로세스를 지원합니다.

### 주요 기능
- **평가 항목 관리**: 평가에 사용될 항목과 가중치 설정
- **평가 입력**: 직급별 권한에 따라 하위 직원 평가
- **평가 조회**: 본인이 받은 평가 결과 확인
- **평가 관리**: 입력한 평가의 수정 및 삭제

### 기술 스택
- **백엔드**: Spring Boot, JPA
- **프론트엔드**: React, Axios
- **데이터베이스**: (프로젝트에서 사용 중인 DB)

---

## 권한 체계

### 평가 항목 관리 권한
- **접근 가능 직급**: `EVAL` (평가 관리자), `CEO`
- **기능**: 평가 항목 추가, 수정, 삭제
- **권한 없는 경우**: 조회만 가능, 수정 불가

### 평가 입력 권한
- **CEO**:
  - LEADER 평가 가능
  - 모든 LEADER 목록 조회

- **LEADER**:
  - 같은 부서의 EMP 평가 가능
  - 본인 부서의 EMP 목록만 조회

- **EMP**:
  - 평가 입력 불가
  - 본인이 받은 평가 조회만 가능

### 평가 관리 권한
- **본인이 입력한 평가만** 수정/삭제 가능
- 다른 사람의 평가는 조회 불가

---

## 평가 항목 관리

### 개요
평가에 사용될 항목을 정의하고 각 항목의 가중치를 설정합니다.

### 주요 기능

#### 1. 평가 항목 조회
```java
// 백엔드: EvaluationCriteriaService.java
public List<EvaluationCriteriaDTO> getAllCriteria()
```
- 모든 평가 항목 조회
- 권한과 관계없이 모든 사용자가 조회 가능

#### 2. 평가 항목 추가
```java
// 백엔드: EvaluationCriteriaController.java
@PostMapping
public ResponseEntity<Long> createCriteria(Authentication authentication,
                                          @RequestBody EvaluationCriteriaDTO dto)
```
- **권한**: EVAL 또는 CEO만 가능
- **필수 정보**: 항목명, 가중치, 설명
- **제약사항**: 가중치 합계가 100%가 되도록 권장

#### 3. 평가 항목 수정
```java
@PutMapping("/{id}")
public ResponseEntity<Void> updateCriteria(Authentication authentication,
                                          @PathVariable Long id,
                                          @RequestBody EvaluationCriteriaDTO dto)
```
- **권한**: EVAL 또는 CEO만 가능
- 기존 항목의 내용 수정

#### 4. 평가 항목 삭제
```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteCriteria(Authentication authentication,
                                          @PathVariable Long id)
```
- **권한**: EVAL 또는 CEO만 가능
- 해당 항목을 사용한 평가가 있어도 삭제 가능

### 프론트엔드 구조

**파일 위치**: `vite/src/features/evaluation/pages/Item.jsx`

#### 상태 관리
```javascript
const [currentUser, setCurrentUser] = useState(null);      // 현재 사용자
const [hasPermission, setHasPermission] = useState(false); // 권한 여부
const [criteriaList, setCriteriaList] = useState([]);      // 항목 목록
const [isModalOpen, setIsModalOpen] = useState(false);     // 모달 상태
const [editingCriteria, setEditingCriteria] = useState(null); // 수정 중인 항목
```

#### 권한 체크
```javascript
// empRole이 "EVAL" 또는 "CEO"인 경우만 관리 권한 부여
if (user.empRole === 'EVAL' || user.empRole === 'CEO') {
  setHasPermission(true);
  console.log('[평가항목관리] 평가 항목 관리 권한 있음');
}
```

#### UI 조건부 렌더링
- **권한 있음**: 평가 항목 추가/수정/삭제 버튼 표시
- **권한 없음**: "접근 권한이 없습니다" 메시지 표시, 항목 목록 숨김

### API 엔드포인트
- `GET /api/evaluation/criteria/current-user` - 현재 사용자 정보 조회
- `GET /api/evaluation/criteria` - 평가 항목 목록 조회
- `POST /api/evaluation/criteria` - 평가 항목 생성
- `PUT /api/evaluation/criteria/{id}` - 평가 항목 수정
- `DELETE /api/evaluation/criteria/{id}` - 평가 항목 삭제

---

## 평가 입력

### 개요
CEO와 LEADER가 하위 직원을 평가하는 기능입니다. 탭 구조로 "평가 입력"과 "입력한 평가 관리"로 나뉩니다.

### 주요 기능

#### 1. 평가 대상자 조회
```java
// 백엔드: EvaluationInputService.java
public List<EvaluationTargetDTO> getEvaluationTargets(String email)
```
- **CEO**: 모든 LEADER 조회
- **LEADER**: 같은 부서의 EMP만 조회

#### 2. 평가 입력
```java
@PostMapping
public ResponseEntity<Long> createEvaluation(Authentication authentication,
                                            @RequestBody EvaluationInputDTO inputDTO)
```
- **필수 정보**:
  - 평가 대상자 (empId)
  - 평가 기간 (evaluationPeriod)
  - 평가 항목별 점수 (scores)
  - 평가 의견 (comment) - 선택사항

- **점수 계산**:
  ```java
  총점 = Σ(각 항목 점수 × 가중치 / 100)
  ```

- **등급 산정**:
  - S등급: 90점 이상
  - A등급: 80점 이상
  - B등급: 70점 이상
  - C등급: 70점 미만

#### 3. 입력한 평가 목록 조회
```java
@GetMapping("/my-inputs")
public ResponseEntity<List<EvaluationResultDTO>> getMyInputEvaluations(Authentication authentication)
```
- 본인이 입력한 평가만 조회
- 평가 대상자, 기간, 총점, 등급, 평가일 표시

#### 4. 평가 수정
```java
@PutMapping("/{evaluationId}")
public ResponseEntity<Void> updateEvaluation(Authentication authentication,
                                            @PathVariable Long evaluationId,
                                            @RequestBody EvaluationInputDTO inputDTO)
```
- **권한 체크**: 본인이 작성한 평가만 수정 가능
- 평가 대상자는 변경 불가
- 평가 기간, 점수, 의견 수정 가능
- 총점 자동 재계산

#### 5. 평가 삭제
```java
@DeleteMapping("/{evaluationId}")
public ResponseEntity<Void> deleteEvaluation(Authentication authentication,
                                            @PathVariable Long evaluationId)
```
- **권한 체크**: 본인이 작성한 평가만 삭제 가능
- 평가 항목별 점수도 함께 삭제 (cascade)
- 삭제 확인 다이얼로그 표시

### 프론트엔드 구조

**파일 위치**: `vite/src/features/evaluation/pages/Input.jsx`

#### 탭 구조
1. **평가 입력 탭**:
   - 평가 대상자 선택
   - 평가 기간 입력
   - 평가 항목별 점수 입력 (0-100점)
   - 평가 의견 입력
   - 등록/수정 버튼

2. **입력한 평가 관리 탭**:
   - 입력한 평가 목록 테이블
   - 평가 대상, 기간, 총점, 등급, 평가일
   - 수정/삭제 버튼

#### 상태 관리
```javascript
const [activeTab, setActiveTab] = useState('input');         // 현재 탭
const [currentUser, setCurrentUser] = useState(null);        // 현재 사용자
const [targets, setTargets] = useState([]);                  // 평가 대상자 목록
const [criteriaList, setCriteriaList] = useState([]);        // 평가 항목 목록
const [myEvaluations, setMyEvaluations] = useState([]);      // 입력한 평가 목록
const [editingEvaluationId, setEditingEvaluationId] = useState(null); // 수정 중인 평가 ID
```

#### 평가 입력 프로세스
1. 평가 대상자 선택
2. 평가 기간 입력
3. 각 평가 항목에 대해 0-100점 입력
4. 평가 의견 작성 (선택)
5. "평가 등록" 버튼 클릭
6. 서버에서 총점 자동 계산 및 저장

#### 평가 수정 프로세스
1. "입력한 평가 관리" 탭에서 "수정" 버튼 클릭
2. "평가 입력" 탭으로 자동 전환
3. 기존 데이터 자동 입력 (평가 대상자는 비활성화)
4. 내용 수정 후 "평가 수정" 버튼 클릭
5. 총점 재계산 및 저장

### API 엔드포인트
- `GET /api/evaluation/input/current-user` - 현재 사용자 정보 조회
- `GET /api/evaluation/input/targets` - 평가 대상자 목록 조회
- `GET /api/evaluation/input/my-inputs` - 입력한 평가 목록 조회
- `GET /api/evaluation/input/{evaluationId}` - 평가 상세 조회 (수정용)
- `POST /api/evaluation/input` - 평가 입력
- `PUT /api/evaluation/input/{evaluationId}` - 평가 수정
- `DELETE /api/evaluation/input/{evaluationId}` - 평가 삭제

---

## 평가 조회

### 개요
사원이 자신이 받은 평가 결과를 조회하는 기능입니다.

### 주요 기능

#### 1. 내 평가 결과 조회
```java
// 백엔드: EvaluationResultService.java
@Transactional(readOnly = true)
public List<EvaluationResultDTO> getMyEvaluations(String email)
```
- 본인이 받은 평가만 조회
- 최신순 정렬

#### 2. 평가 결과 상세
- **총점 및 등급**: 큰 카드로 표시
- **평가 정보**: 평가 대상자, 평가자, 평가일
- **평가 항목별 점수**: 각 항목의 점수와 가중치 표시
- **평가 의견**: 평가자가 작성한 의견

### 프론트엔드 구조

**파일 위치**: `vite/src/features/evaluation/pages/View.jsx`

#### 상태 관리
```javascript
const [evaluations, setEvaluations] = useState([]);           // 평가 목록
const [selectedEvaluation, setSelectedEvaluation] = useState(null); // 선택된 평가
const [loading, setLoading] = useState(false);                // 로딩 상태
```

#### UI 구성
1. **평가 선택**: 여러 평가가 있는 경우 선택 가능
2. **점수 카드**: 총점과 등급을 크게 표시
3. **평가 정보 카드**: 평가 대상자, 평가자, 평가일
4. **평가 항목별 점수 카드**: 막대그래프로 시각화
5. **평가 의견 카드**: 평가자의 의견

#### 등급별 색상
- **S등급**: 골드 (탁월)
- **A등급**: 블루 (우수)
- **B등급**: 그린 (보통)
- **C등급**: 그레이 (개선필요)

### API 엔드포인트
- `GET /api/evaluation/results/my-evaluations` - 내 평가 결과 조회
- `GET /api/evaluation/results/{evaluationId}` - 특정 평가 결과 상세 조회
- `GET /api/evaluation/results/employee/{empId}` - 특정 직원의 평가 결과 조회
- `GET /api/evaluation/results/period/{period}` - 특정 기간의 평가 결과 조회

---

## 데이터베이스 구조

### 1. EvaluationCriteria (평가 항목)
```java
@Entity
public class EvaluationCriteria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long criteriaId;           // 항목 ID

    private String criteriaName;       // 항목명
    private Integer weight;            // 가중치 (%)
    private String description;        // 설명

    @CreationTimestamp
    private LocalDateTime createdAt;   // 생성일

    @UpdateTimestamp
    private LocalDateTime updatedAt;   // 수정일
}
```

### 2. EvaluationResult (평가 결과)
```java
@Entity
public class EvaluationResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long evaluationId;         // 평가 ID

    private String empId;              // 평가 대상자 사번
    private String evaluatorId;        // 평가자 사번
    private Integer totalScore;        // 총점
    private String evaluationPeriod;   // 평가 기간
    private String comment;            // 평가 의견

    @CreationTimestamp
    private LocalDateTime createdAt;   // 평가일

    @UpdateTimestamp
    private LocalDateTime updatedAt;   // 수정일
}
```

### 3. EvaluationScore (평가 항목별 점수)
```java
@Entity
public class EvaluationScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detailId;             // 상세 ID

    private Long evaluationId;         // 평가 ID (FK)
    private Long criteriaId;           // 평가 항목 ID (FK)
    private Integer score;             // 점수 (0-100)
}
```

### 관계도
```
Emp (직원)
  ↓ 1:N (평가 대상)
EvaluationResult (평가 결과)
  ↓ 1:N
EvaluationScore (항목별 점수)
  ↓ N:1
EvaluationCriteria (평가 항목)
```

---

## API 엔드포인트

### 평가 항목 관리 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/evaluation/criteria/current-user` | 현재 사용자 정보 조회 | 모두 |
| GET | `/api/evaluation/criteria` | 평가 항목 목록 조회 | 모두 |
| POST | `/api/evaluation/criteria` | 평가 항목 생성 | EVAL, CEO |
| PUT | `/api/evaluation/criteria/{id}` | 평가 항목 수정 | EVAL, CEO |
| DELETE | `/api/evaluation/criteria/{id}` | 평가 항목 삭제 | EVAL, CEO |

### 평가 입력 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/evaluation/input/current-user` | 현재 사용자 정보 조회 | CEO, LEADER |
| GET | `/api/evaluation/input/targets` | 평가 대상자 목록 조회 | CEO, LEADER |
| GET | `/api/evaluation/input/my-inputs` | 입력한 평가 목록 조회 | CEO, LEADER |
| GET | `/api/evaluation/input/{evaluationId}` | 평가 상세 조회 (수정용) | CEO, LEADER (본인 작성) |
| POST | `/api/evaluation/input` | 평가 입력 | CEO, LEADER |
| PUT | `/api/evaluation/input/{evaluationId}` | 평가 수정 | CEO, LEADER (본인 작성) |
| DELETE | `/api/evaluation/input/{evaluationId}` | 평가 삭제 | CEO, LEADER (본인 작성) |

### 평가 조회 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/evaluation/results/my-evaluations` | 내 평가 결과 조회 | 모두 |
| GET | `/api/evaluation/results/{evaluationId}` | 특정 평가 결과 상세 조회 | 모두 |
| GET | `/api/evaluation/results/employee/{empId}` | 특정 직원의 평가 결과 조회 | 모두 |
| GET | `/api/evaluation/results/period/{period}` | 특정 기간의 평가 결과 조회 | 모두 |

---

## 파일 구조

### 백엔드 (src/main/java/boot/team/hr/gyu)

```
gyu/
├── controller/
│   ├── EvaluationCriteriaController.java    # 평가 항목 관리 컨트롤러
│   ├── EvaluationInputController.java       # 평가 입력 컨트롤러
│   └── EvaluationResultController.java      # 평가 조회 컨트롤러
│
├── service/
│   ├── EvaluationCriteriaService.java       # 평가 항목 관리 서비스
│   ├── EvaluationInputService.java          # 평가 입력 서비스
│   └── EvaluationResultService.java         # 평가 조회 서비스
│
├── repository/
│   ├── EvaluationCriteriaRepository.java    # 평가 항목 리포지토리
│   ├── EvaluationResultRepository.java      # 평가 결과 리포지토리
│   └── EvaluationScoreRepository.java       # 평가 점수 리포지토리
│
├── entity/
│   ├── EvaluationCriteria.java              # 평가 항목 엔티티
│   ├── EvaluationResult.java                # 평가 결과 엔티티
│   └── EvaluationScore.java                 # 평가 점수 엔티티
│
└── dto/
    ├── CurrentUserDTO.java                   # 현재 사용자 DTO
    ├── EvaluationCriteriaDTO.java           # 평가 항목 DTO
    ├── EvaluationInputDTO.java              # 평가 입력 DTO
    ├── EvaluationResultDTO.java             # 평가 결과 DTO
    ├── EvaluationScoreDTO.java              # 평가 점수 DTO
    ├── EvaluationScoreInputDTO.java         # 평가 점수 입력 DTO
    └── EvaluationTargetDTO.java             # 평가 대상자 DTO
```

### 프론트엔드 (vite/src/features/evaluation)

```
evaluation/
├── pages/
│   ├── Item.jsx                # 평가 항목 관리 페이지
│   ├── Input.jsx               # 평가 입력 페이지
│   └── View.jsx                # 평가 조회 페이지
│
├── api/
│   ├── criteriaApi.js          # 평가 항목 API
│   ├── inputApi.js             # 평가 입력 API
│   └── resultApi.js            # 평가 조회 API
│
└── styles/
    ├── Item.css                # 평가 항목 관리 스타일
    ├── Input.css               # 평가 입력 스타일
    └── View.css                # 평가 조회 스타일
```

---

## 로깅 및 디버깅

### 백엔드 로그
모든 주요 작업에서 `System.out.println`을 사용하여 로그 출력:

```java
System.out.println("[평가항목관리] 권한 체크 - 사용자: " + emp.getEmpName() +
                   ", 직급: " + emp.getEmpRole() + ", 권한 여부: " + hasPermission);
```

### 프론트엔드 로그
모든 주요 작업에서 `console.log`를 사용하여 로그 출력:

```javascript
console.log('[평가입력] 평가 등록 요청');
console.log('[평가입력] 평가 수정 완료 - ID:', evaluationId);
```

### 로그 형식
```
[기능명] 작업내용 - 상세정보
```

예시:
- `[평가항목관리] 평가 항목 생성 - 항목명: 업무수행능력`
- `[평가입력] 평가 삭제 실패 - 권한 없음, 평가ID: 123`
- `[평가조회] 평가 목록 조회 - 사용자: 홍길동`

---

## 보안 고려사항

### 1. 인증 및 권한 체크
- 모든 API 엔드포인트에서 `Authentication` 객체를 통해 사용자 인증 확인
- 권한이 없는 경우 `401 Unauthorized` 또는 `403 Forbidden` 반환

### 2. 데이터 접근 제어
- **평가 항목**: EVAL, CEO만 수정 가능
- **평가 입력**: 직급별 평가 대상자 제한
- **평가 관리**: 본인이 작성한 평가만 수정/삭제 가능
- **평가 조회**: 본인이 받은 평가만 조회 가능

### 3. 입력 검증
- 평가 대상자 선택 필수
- 평가 기간 입력 필수
- 점수 범위 제한 (0-100)
- 가중치 범위 제한 (0-100)

---

## 개선 가능한 부분

### 1. 기능 확장
- 평가 승인 프로세스 추가
- 평가 통계 및 대시보드
- 평가 기간 자동 설정
- 평가 템플릿 기능
- 다면 평가 지원

### 2. UX 개선
- 평가 진행 상태 표시
- 평가 완료율 표시
- 평가 미완료 알림
- 엑셀 다운로드 기능

### 3. 성능 최적화
- 페이지네이션 적용
- 검색 및 필터링 기능
- 캐싱 적용
- 지연 로딩

---

## 문의 및 지원

시스템 사용 중 문제가 발생하거나 문의사항이 있는 경우:
- 백엔드 폴더: `src/main/java/boot/team/hr/gyu`
- 프론트엔드 폴더: `vite/src/features/evaluation`
- 로그 확인: 브라우저 콘솔 및 서버 로그

---

**작성일**: 2026-01-12
**버전**: 1.0.0