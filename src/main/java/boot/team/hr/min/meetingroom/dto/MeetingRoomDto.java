package boot.team.hr.min.meetingroom.dto;

import lombok.Data;

@Data
public class MeetingRoomDto {
    private String meetingRoomId;
    private String name;
    private String location;
    private Integer capacity;
}
