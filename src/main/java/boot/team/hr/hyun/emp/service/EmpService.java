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
public class EmpService {
    private final EmpRepository empRepository;
    private final DeptRepository deptRepository;

    @Transactional(readOnly = true)
    public List<EmpDto> selectAll() {
        List<Emp> emps = empRepository.findAll();
        List<EmpDto> dtos = new ArrayList<>();

        // 익숙한 for문 방식으로 작성했습니다.
        for (Emp emp : emps) {
                EmpDto dto = EmpDto.builder()
                        .empId(emp.getEmpId())
                        .empName(emp.getEmpName())
                        .email(emp.getEmail())
                        .empRole(emp.getEmpRole())
                        // 부서가 아직 없어도 null로 표시
                        .deptNo(emp.getDept() != null ? emp.getDept().getDeptNo() : null)
                        .createdAt(emp.getCreatedAt())
                        .updatedAt(emp.getUpdatedAt())
                        .build();
                dtos.add(dto);

        }
        return dtos;
    }

    public void insertEmp(EmpDto empDto) {
        Dept dept = deptRepository.findById(empDto.getDeptNo())
                .orElseThrow(() -> new RuntimeException("해당 부서가 없습니다."));

        Emp emp = Emp.builder()
                .empId(empDto.getEmpId())
                .empName(empDto.getEmpName())
                .email(empDto.getEmail())
                .empRole(empDto.getEmpRole())
                .dept(dept)
                .build();
        empRepository.save(emp);
    }

    @Transactional
    public void updateEmp(EmpDto empDto) {
        Emp emp = empRepository.findById(empDto.getEmpId())
                .orElseThrow(() -> new RuntimeException("해당 사원 없음"));
        Dept dept = deptRepository.findById(empDto.getDeptNo())
                    .orElseThrow(() -> new RuntimeException("부서 번호가 올바르지 않습니다."));
        // 사번은 기본키이므로 변경하지 않도록 함.
        // @Builder는 객체를 "생성"하기에 수정작업에는 사용하지 않는다.
        emp.update(empDto.getEmpName(), empDto.getEmail(), empDto.getEmpRole(), dept);
    }

    public void deleteEmp(String empId) {
        empRepository.deleteById(empId);
    }
}