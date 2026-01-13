package boot.team.hr.min.project.dto;

import boot.team.hr.min.project.entitiy.Project;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProjectDto {
    private Long id;
    private String name;
    private String description;
    private String methodology;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;

    public static ProjectDto from(Project project) {
        ProjectDto dto=new ProjectDto();
        dto.id=project.getId();
        dto.name=project.getName();
        dto.description=project.getDescription();
        dto.methodology=project.getMethodology();
        dto.startDate=project.getStartDate();
        dto.endDate=project.getEndDate();
        dto.status=project.getStatus();
        return dto;
    }
}
