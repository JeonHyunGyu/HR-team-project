package boot.team.hr.hyun.outsourcing.service;

import boot.team.hr.hyun.emp.entity.Emp;
import boot.team.hr.hyun.emp.repo.EmpRepository;
import boot.team.hr.hyun.outsourcing.dto.OutsourcingAssignmentDto;
import boot.team.hr.hyun.outsourcing.dto.OutsourcingCompanyDto;
import boot.team.hr.hyun.outsourcing.entity.OutsourcingAssignment;
import boot.team.hr.hyun.outsourcing.entity.OutsourcingCompany;
import boot.team.hr.hyun.outsourcing.repo.OutsourcingAssignmentRepository;
import boot.team.hr.hyun.outsourcing.repo.OutsourcingCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OutsourcingService {
    private final OutsourcingCompanyRepository outsourcingCompanyRepository;
    private final OutsourcingAssignmentRepository outsourcingAssignmentRepository;
    private final EmpRepository empRepository;

    public List<OutsourcingCompanyDto> selectAllOutsourcingCompany(){
        List<OutsourcingCompany> outsourcingCompanies = outsourcingCompanyRepository.findAll();
        List<OutsourcingCompanyDto> outsourcingCompanyDtos = new ArrayList<>();
        for(OutsourcingCompany outsourcingCompany : outsourcingCompanies){
            OutsourcingCompanyDto outsourcingCompanyDto = OutsourcingCompanyDto.builder()
                    .companyId(outsourcingCompany.getCompanyId())
                    .companyName(outsourcingCompany.getCompanyName())
                    .createdAt(outsourcingCompany.getCreatedAt())
                    .updatedAt(outsourcingCompany.getUpdatedAt())
                    .build();
            outsourcingCompanyDtos.add(outsourcingCompanyDto);
        }
        return outsourcingCompanyDtos;
    }
    public void insertOutsourcingCompany(OutsourcingCompanyDto outsourcingCompanyDto){
        OutsourcingCompany outsourcingCompany = OutsourcingCompany.builder()
                    .companyName(outsourcingCompanyDto.getCompanyName())
                    .build();
        outsourcingCompanyRepository.save(outsourcingCompany);
    }
    @Transactional
    public void updateOutsourcingCompany(OutsourcingCompanyDto outsourcingCompanyDto){
        OutsourcingCompany outsourcingCompany = outsourcingCompanyRepository.findById(outsourcingCompanyDto.getCompanyId())
                .orElseThrow(()->new RuntimeException("해당하는 파견업체가 없습니다."));
        outsourcingCompany.update(outsourcingCompanyDto.getCompanyName());
    }
    @Transactional
    public void deleteOutsourcingCompany(String companyName){
        outsourcingCompanyRepository.deleteByCompanyName(companyName);
    }

    public List<OutsourcingAssignmentDto> selectAllOutsourcingAssignment(){
        List<OutsourcingAssignment> outsourcingAssignments = outsourcingAssignmentRepository.findAll();
        List<OutsourcingAssignmentDto> outsourcingAssignmentDtos = new ArrayList<>();
        for(OutsourcingAssignment outsourcingAssignment : outsourcingAssignments){
            OutsourcingAssignmentDto outsourcingAssignmentDto = OutsourcingAssignmentDto.builder()
                            .assignmentId(outsourcingAssignment.getAssignmentId())
                            .empId(outsourcingAssignment.getEmp().getEmpId())
                            .companyId(outsourcingAssignment.getCompany().getCompanyId())
                            .projectName(outsourcingAssignment.getProjectName())
                            .status(outsourcingAssignment.getStatus())
                            .startDate(outsourcingAssignment.getStartDate())
                            .endDate(outsourcingAssignment.getEndDate())
                            .build();
            outsourcingAssignmentDtos.add(outsourcingAssignmentDto);
        }
        return outsourcingAssignmentDtos;
    }
    public void insertOutsourcingAssignment(OutsourcingAssignmentDto outsourcingAssignmentDto){
        Emp emp = empRepository.findById(outsourcingAssignmentDto.getEmpId())
                .orElseThrow(()->new RuntimeException("해당 사원이 없습니다."));
        OutsourcingCompany outsourcingCompany = outsourcingCompanyRepository.findById(outsourcingAssignmentDto.getCompanyId())
                .orElseThrow(()->new RuntimeException("해당 업체가 없습니다."));

        OutsourcingAssignment outsourcingAssignment = OutsourcingAssignment.builder()
                .emp(emp)
                .company(outsourcingCompany)
                .projectName(outsourcingAssignmentDto.getProjectName())
                .status(outsourcingAssignmentDto.getStatus())
                .startDate(outsourcingAssignmentDto.getStartDate())
                .endDate(outsourcingAssignmentDto.getEndDate())
                .build();

        outsourcingAssignmentRepository.save(outsourcingAssignment);
    }
    @Transactional
    public void updateOutsourcingAssignment(OutsourcingAssignmentDto outsourcingAssignmentDto){
        OutsourcingAssignment outsourcingAssignment = outsourcingAssignmentRepository.findById(outsourcingAssignmentDto.getAssignmentId())
                .orElseThrow(()->new RuntimeException("해당하는 파견 배치정보가 없습니다."));
        Emp emp = empRepository.findById(outsourcingAssignmentDto.getEmpId()).orElseThrow(()-> new RuntimeException("해당 사원 없음"));
        OutsourcingCompany outsourcingCompany = outsourcingCompanyRepository.findById(outsourcingAssignmentDto.getCompanyId()).orElseThrow(()->new RuntimeException("해당 업체 없음"));
        outsourcingAssignment.update(emp, outsourcingCompany, outsourcingAssignmentDto.getProjectName(), outsourcingAssignmentDto.getStatus(), outsourcingAssignmentDto.getStartDate(), outsourcingAssignmentDto.getEndDate());
    }
    public void deleteOutsourcingAssignment(Long assignmentId){
        outsourcingAssignmentRepository.deleteById(assignmentId);
    }
}
