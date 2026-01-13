package boot.team.hr.min.project.entitiy;

import boot.team.hr.min.project.dto.ProjectDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="PROJECT")
@Getter
@Setter
@NoArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20)
    private String name;

    @Column(length = 200)
    private String description;

    @Column(length = 20)
    private String methodology;

    @Column(name="start_date")
    private LocalDateTime startDate;

    @Column(name="end_date")
    private LocalDateTime endDate;

    @Column(length = 20)
    private String status;

    //생성자
    public Project(String name, String description, String methodology, LocalDateTime startDate, LocalDateTime endDate, String status) {
        this.name = name;
        this.description = description;
        this.methodology = methodology;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
    //업데이트용
    public void update(String name, String description, String methodology, LocalDateTime startDate, LocalDateTime endDate, String status) {
        this.name = name;
        this.description = description;
        this.methodology = methodology;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}
