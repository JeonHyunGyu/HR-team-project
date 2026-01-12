package boot.team.hr.hyun.emp.entity;

import boot.team.hr.hyun.dept.entity.Dept;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Emp {
    @Id
    @Column(name = "emp_id") // DB 컬럼명은 emp_id
    private String empId;    // Java 필드명은 empId a1001

    @Column(name = "emp_name")
    private String empName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "emp_role")
    private String empRole; // CEO, Manager, TeamLeader, Employee ( CEO -> 담당관 -> 팀장 -> 사원)

    private Integer managerId; // 직속상관 ( 사수 ) - 규호

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "dept_no",
            referencedColumnName = "dept_no"
    )
    private Dept dept;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}