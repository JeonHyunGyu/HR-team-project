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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "emp_id") // DB 컬럼명은 emp_id
    private Integer empId;    // Java 필드명은 empId

    @Column(name = "emp_name")
    private String empName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "dept_id",
            referencedColumnName = "id"
    )
    private Dept dept;

    @Column(nullable = false, unique = true)
    private String email;
    @Column(name = "emp_role")
    private String empRole; // CEO, Manager, TeamLeader, Employee ( CEO -> 담당관 -> 팀장 -> 사원)
    private Integer managerId; // 직속상관 ( 사수 ) - 규호

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}