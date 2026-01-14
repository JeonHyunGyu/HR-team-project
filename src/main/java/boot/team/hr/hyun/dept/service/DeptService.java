package boot.team.hr.hyun.dept.service;

import boot.team.hr.hyun.dept.dto.DeptDto;
import boot.team.hr.hyun.dept.entity.Dept;
import boot.team.hr.hyun.dept.repo.DeptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeptService {
    private final DeptRepository deptRepository;

    public List<DeptDto> selectAll(){
        List<Dept> depts = deptRepository.findAll();
        List<DeptDto> dtos = new ArrayList<>() ;
        for(Dept dept : depts){
            DeptDto deptDto = DeptDto.builder()
                    .deptNo(dept.getDeptNo())
                    .deptName(dept.getDeptName())
                    .deptLoc(dept.getDeptLoc())
                    .parentDeptNo(dept.getParent() != null ? dept.getParent().getDeptNo() : null)
                    .treeLevel(dept.getTreeLevel())
                    .siblingOrder(dept.getSiblingOrder())
                    .createdAt(dept.getCreatedAt())
                    .updatedAt(dept.getUpdatedAt())
                    .build();
            dtos.add(deptDto);
        }
        return dtos;
    }
    public void insertDept(DeptDto deptDto){
        Dept parent = deptRepository.findById(deptDto.getParentDeptNo())
                .orElseThrow(()-> new RuntimeException("해당 부서가 없습니다."));
        Dept dept = Dept.builder()
                .deptNo(deptDto.getDeptNo())
                .deptName(deptDto.getDeptName())
                .deptLoc(deptDto.getDeptLoc())
                .parent(deptDto.getParentDeptNo() != null ? parent : null)
                .treeLevel(deptDto.getParentDeptNo() != null ? parent.getTreeLevel() + 1 : 0)
                .siblingOrder(deptDto.getSiblingOrder())
                .createdAt(LocalDateTime.now())
                .updatedAt(null)
                .build();
        deptRepository.save(dept);
    }
    @Transactional
    public void updateDept(DeptDto deptDto){
        Dept dept = deptRepository.findById(deptDto.getDeptNo())
                .orElseThrow(()-> new RuntimeException("해당 부서 없음"));
        Dept parent = deptRepository.findById(deptDto.getParentDeptNo())
                .orElseThrow(()-> new RuntimeException("해당 상위부서 없음"));
       dept.update(
               deptDto.getDeptName(),
               deptDto.getDeptLoc(),
               parent,
               parent.getTreeLevel()+1,
               deptDto.getSiblingOrder());
    }
    @Transactional
    public void deleteDept(Integer deptId){
        deptRepository.deleteById(deptId);
    }
}
