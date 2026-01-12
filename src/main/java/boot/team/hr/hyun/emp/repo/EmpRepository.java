package boot.team.hr.hyun.emp.repo;

import boot.team.hr.hyun.emp.entity.Emp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpRepository extends JpaRepository<Emp,String> {
    Optional<Emp> findByEmail(String email);
}