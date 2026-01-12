package boot.team.hr.min.meetingroombook.repository;

import boot.team.hr.min.meetingroombook.entitiy.MeetingRoomBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingRoomBookRepository extends JpaRepository<MeetingRoomBook, Long>{
}
