package boot.team.hr.min.meetingroom.dto;

import boot.team.hr.min.meetingroom.entity.MeetingRoom;
import lombok.Data;

@Data
public class MeetingRoomDto {
    private String meetingRoomId;
    private String name;
    private String location;
    private Integer capacity;

    public static MeetingRoomDto from(MeetingRoom entity) {
        MeetingRoomDto dto = new MeetingRoomDto();
        dto.meetingRoomId = entity.getMeetingRoomId();
        dto.name = entity.getName();
        dto.location = entity.getLocation();
        dto.capacity = entity.getCapacity();
        return dto;
    }


}
