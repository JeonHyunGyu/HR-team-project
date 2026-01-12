package boot.team.hr.min.meetingroom.service;

import boot.team.hr.min.meetingroom.dto.MeetingRoomDto;
import boot.team.hr.min.meetingroom.entity.MeetingRoom;
import boot.team.hr.min.meetingroom.repository.MeetingRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MeetingRoomService {

    private final MeetingRoomRepository meetingRoomRepository;
    //c
    private final MeetingRoomRepository repository;
    @Transactional
    public void createRoom(MeetingRoomDto dto) {
        repository.save(MeetingRoom.from(dto));
    }
    //r
    @Transactional(readOnly = true)
    public List<MeetingRoomDto> findAllRoom() {
        return repository.findAll()
                .stream()
                .map(MeetingRoomDto::from)
                .toList();
    }
    //u
    @Transactional
    public void updateRoom(String id, MeetingRoomDto dto) {
        MeetingRoom room = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("회의실 없음: " + id));

        room.update(dto);
    }
    //d
    @Transactional
    public void deleteRoom(String id){
        meetingRoomRepository.deleteById(id);
    }
}
