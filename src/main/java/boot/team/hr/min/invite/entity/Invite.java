package boot.team.hr.min.invite.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "INVITE",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        }
)
@NoArgsConstructor
@Getter
@Setter
public class Invite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="emp_id",nullable = false, length = 30)
    private String empId;

    @Column(nullable = false, length = 255, unique = true)
    private String email;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name="created_at",nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // 초대 생성
    public Invite(String empId, String email) {
        this.empId = empId;
        this.email = email;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    // 초대 수락
    public void complete() {
        this.status = "COMPLETED";
        this.completedAt = LocalDateTime.now();
    }
}
