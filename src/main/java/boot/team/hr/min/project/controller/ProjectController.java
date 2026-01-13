package boot.team.hr.min.project.controller;

import boot.team.hr.min.project.dto.ProjectDto;
import boot.team.hr.min.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    public ProjectDto createProject(@RequestBody ProjectDto projectDto){
        return projectService.create(projectDto);
    }
    @GetMapping
    public List<ProjectDto> findAllProject(){
        return projectService.findAll();
    }
    @GetMapping("/{id}")
    public ProjectDto findProject(@PathVariable Long id){
        return projectService.findById(id);
    }
    @PutMapping("/{id}")
    public void updateProject(@PathVariable Long id,@RequestBody ProjectDto projectDto){
        projectService.update(id,projectDto);
    }
    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id){
        projectService.delete(id);
    }
}
