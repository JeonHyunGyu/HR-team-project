package boot.team.hr.min.meetingroom.repository;

import boot.team.hr.min.meetingroom.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, String> {
}
