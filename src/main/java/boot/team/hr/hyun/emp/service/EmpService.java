package boot.team.hr.hyun.emp.service;

import boot.team.hr.hyun.dept.entity.Dept;
import boot.team.hr.hyun.dept.repo.DeptRepository;
import boot.team.hr.hyun.emp.dto.EmpDto;
import boot.team.hr.hyun.emp.entity.Emp;
import boot.team.hr.hyun.emp.repo.EmpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional // 서비스의 모든 작업은 트랜잭션 안에서 실행됩니다.
public class EmpService {
    private final EmpRepository empRepository;
    private final DeptRepository deptRepository;

    @Transactional(readOnly = true)
    public List<EmpDto> selectAll() {
        List<Emp> emps = empRepository.findAll();
        List<EmpDto> dtos = new ArrayList<>();

        // 익숙한 for문 방식으로 작성했습니다.
        for (Emp emp : emps) {
            EmpDto dto = new EmpDto();
            dto.setEmpId(emp.getEmpId());
            dto.setEmpName(emp.getEmpName());
            dto.setEmail(emp.getEmail());
            dto.setEmpRole(emp.getEmpRole());

            if (emp.getDept() != null) {
                dto.setDeptNo(emp.getDept().getDeptNo());
            }

            // 날짜는 엔티티에서 관리되므로 null 체크 후 바로 담습니다.
            dto.setCreatedAt(emp.getCreatedAt());
            dto.setUpdatedAt(emp.getUpdatedAt());

            dtos.add(dto);
        }
        return dtos;
    }

    public void insertEmp(EmpDto empDto) {
        Emp emp = new Emp();
        emp.setEmpId(empDto.getEmpId());

        Dept dept = null;
        if (empDto.getDeptNo() != null) {
            dept = deptRepository.findById(empDto.getDeptNo())
                    .orElseThrow(() -> new RuntimeException("해당 부서가 없습니다."));
        }

        // 엔티티의 update 메서드 호출 (시간 세팅은 @PrePersist가 담당)
        emp.update(empDto.getEmpName(), empDto.getEmail(), empDto.getEmpRole(), dept);

        empRepository.save(emp);
    }

    public void updateEmp(EmpDto empDto) {
        Emp emp = empRepository.findById(empDto.getEmpId())
                .orElseThrow(() -> new RuntimeException("해당 사원 없음"));

        Dept dept = null;
        if (empDto.getDeptNo() != null) {
            dept = deptRepository.findById(empDto.getDeptNo())
                    .orElseThrow(() -> new RuntimeException("부서 번호가 올바르지 않습니다."));
        }

        // 엔티티의 update 메서드 호출 (시간 세팅은 @PreUpdate가 담당)
        // @Transactional 덕분에 save() 없이도 자동 업데이트(Dirty Checking)됩니다.
        emp.update(empDto.getEmpName(), empDto.getEmail(), empDto.getEmpRole(), dept);
    }

    public void deleteEmp(String empId) {
        empRepository.deleteById(empId);
    }
}