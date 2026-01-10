package boot.team.hr.hyun.emp.service;

import boot.team.hr.hyun.dept.entity.Dept;
import boot.team.hr.hyun.dept.repo.DeptRepository;
import boot.team.hr.hyun.emp.dto.EmpDto;
import boot.team.hr.hyun.emp.entity.Emp;
import boot.team.hr.hyun.emp.repo.EmpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
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

        for (Emp emp : emps) {
            EmpDto dto = new EmpDto();
            // emp(엔티티)에서 꺼내서 dto에 담습니다.
            dto.setEmpId(emp.getEmpId());
            dto.setEmpName(emp.getEmpName());
            dto.setEmail(emp.getEmail());
            dto.setEmpRole(emp.getEmpRole());

//            dto.setDeptId(String.valueOf(emp.getDeptId()));
            if(emp.getDept() != null) { // 부서 배정이 안된 사원이면, NullPointerException 발생
                dto.setDeptId(emp.getDept().getDeptId());
            }

            // 날짜 변환 (null 체크 추가)
            if (emp.getCreatedAt() != null) {
                dto.setCreatedAt(emp.getCreatedAt());
            }
            if (emp.getUpdatedAt() != null) {
                dto.setUpdatedAt(emp.getUpdatedAt());
            }

            dtos.add(dto);
        };
        return dtos;
    }

    public void insertEmp(EmpDto empDto) {
        Emp emp = new Emp();
        // dto에서 꺼내서 emp(엔티티)에 담습니다.
        // String -> Integer 변환 시 발생할 수 있는 null 에러를 방지하려면 체크가 필요할 수 있습니다.
        emp.setEmpId(empDto.getEmpId());
        emp.setEmpName(empDto.getEmpName());
        emp.setEmail(empDto.getEmail());
        emp.setEmpRole(empDto.getEmpRole());
//        emp.getManagerId();

//        emp.setDeptId(Integer.valueOf(empDto.getDeptId()));
        if(empDto.getDeptId() != null) { // deptId 로 조회해서 Dept 객체 가져오기
            Dept dept = deptRepository.findByDeptId(empDto.getDeptId())
                    .orElseThrow(()-> new  RuntimeException("해당 사원의 부서가 없습니다. 혹은 아직 등록되지 않았습니다.")
            );

            emp.setDept(dept); // 하지만 dept 변수에는 해당 부서번호의 부서 정보 전체가 들어오지만, DB에는 엔티티를 보고 dept_id만 저장된다.
        }
        // 생성 시간 및 수정 시간 설정
        emp.setCreatedAt(LocalDateTime.now());
        emp.setUpdatedAt(LocalDateTime.now());

        empRepository.save(emp);
    }

    public void updateEmp(EmpDto empDto){
        Emp emp = empRepository.findByEmpId(empDto.getEmpId())
                .orElseThrow(()-> new RuntimeException("해당 사원 없음"));

        emp.setEmpId(empDto.getEmpId());
        emp.setEmpName(empDto.getEmpName());
        emp.setEmail(empDto.getEmail());
        emp.setEmpRole(empDto.getEmpRole());

        //        emp.setDeptId(empDto.getDeptId());
        if(empDto.getDeptId() != null) {
            Dept dept = deptRepository.findByDeptId(empDto.getDeptId())
                    .orElseThrow(()-> new RuntimeException("해당 사원의 부서 번호가 없습니다. 혹은 아직 등록되지 않았습니다."));

            emp.setDept(dept);
        }
        emp.setUpdatedAt(LocalDateTime.now());

        empRepository.save(emp);
    }

    @Transactional
    public void deleteEmp(String empId){
        empRepository.deleteEmpByEmpId(empId);
    }

}