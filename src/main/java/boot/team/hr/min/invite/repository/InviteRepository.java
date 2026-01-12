package boot.team.hr.min.invite.repository;

import boot.team.hr.min.invite.entity.Invite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InviteRepository extends JpaRepository<Invite,Long> {

    Optional<Invite> findByEmailAndStatus(String email, String status);

}
