package boot.team.hr.hyun.dept.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeptDto {
    private Integer deptNo;
    private String deptName;
    private String deptLoc;

    private Integer parentDeptNo;
    private Integer treeLevel;
    private Integer siblingOrder;

    @JsonFormat(pattern = "yy년 MM월 dd일 HH시 mm분 ss초", locale = "ko")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yy년 MM월 dd일 HH시 mm분 ss초", locale = "ko")
    private LocalDateTime updatedAt;
}
