package boot.team.hr.hyun.dept.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Dept {
    @Id
    @Column(name = "dept_no")
    private Integer deptNo;     // 부서 번호

    private String deptName;    // 부서명
    private String deptLoc;     // 부서 위치

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_dept_no")
    private Dept parent;    // 상위 부서 객체
    private Integer treeLevel;      //조직도용 트리 계층(depth)
    private Integer siblingOrder;   //같은 부모(형제) 내 정렬 순서

    private LocalDateTime createdAt;    //생성일자
    private LocalDateTime updatedAt;    //수정일자
}
