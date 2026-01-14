package boot.team.hr.hyun.emp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmpDto {
    private String empId;   // 사원번호
    private String empName; // 사원 이름

    private Integer deptNo;  // 외래키, Dept 테이블의 deptNo 컬럼과 매핑

    private String email;
    private String empRole;

//    private String managerId; // 직속 상관 ( 규호 )

    @JsonFormat(pattern = "yy년 MM월 dd일 HH시 mm분 ss초",locale = "ko")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yy년 MM월 dd일 HH시 mm분 ss초",locale = "ko")
    private LocalDateTime updatedAt;
}