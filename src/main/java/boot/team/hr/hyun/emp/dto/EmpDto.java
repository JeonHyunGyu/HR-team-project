package boot.team.hr.hyun.emp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class EmpDto {
    private String empId;   // React의 empId와 매핑 ( A3003 이런식으로 문자열 형식 )
    private String empName; // React의 empName과 매핑
    private Integer deptId;  // 외래키, Dept 테이블의 deptId 컬럼과 매핑
    private String email;
    private String empRole;

//    private String managerId; // 직속 상관 ( 규호 )

    @JsonFormat(pattern = "yy년 MM월 dd일 HH시 mm분 ss초",locale = "ko")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yy년 MM월 dd일 HH시 mm분 ss초",locale = "ko")
    private LocalDateTime updatedAt;
}