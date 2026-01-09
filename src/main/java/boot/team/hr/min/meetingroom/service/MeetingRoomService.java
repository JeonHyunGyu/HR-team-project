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
@Transactional
public class MeetingRoomService {

    private final MeetingRoomRepository meetingRoomRepository;
    //c
    public void createRoom(MeetingRoomDto dto){
        MeetingRoom meetingRoom=new MeetingRoom(dto.getMeetingRoomId(),dto.getName(),dto.getLocation(),dto.getCapacity());
        meetingRoomRepository.save(meetingRoom);
    }
    //r
    public MeetingRoom findRoom(String meetingRoomId){
        return meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(()->new RuntimeException("회의실 없음"+meetingRoomId));
    }
    public List<MeetingRoomDto> findAllRoom() {
        return meetingRoomRepository.findAll()
                .stream()
                .map(room -> {
                    MeetingRoomDto dto = new MeetingRoomDto();
                    dto.setMeetingRoomId(room.getMeetingRoomId());
                    dto.setName(room.getName());
                    dto.setLocation(room.getLocation());
                    dto.setCapacity(room.getCapacity());
                    return dto;
                })
                .toList(); // Java 17+
    }
    //u
    @Transactional
    public void updateRoom(String id, MeetingRoomDto dto){
        MeetingRoom meetingRoom = meetingRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회의실 없음: " + id));

        meetingRoom.setName(dto.getName());
        meetingRoom.setLocation(dto.getLocation());
        meetingRoom.setCapacity(dto.getCapacity());
    }

    @Transactional
    public void deleteRoom(String id){
        meetingRoomRepository.deleteById(id);
    }
}
