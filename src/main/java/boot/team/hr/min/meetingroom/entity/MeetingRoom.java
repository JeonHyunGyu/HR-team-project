package boot.team.hr.min.meetingroom.entity;

import boot.team.hr.min.meetingroom.dto.MeetingRoomDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="MEETING_ROOM")
@Getter
@Setter
@NoArgsConstructor
public class MeetingRoom {
    @Id
    @Column(name="meeting_room_id",length = 20)
    private String meetingRoomId;

    @Column(nullable = false,length = 20)
    private String name;

    @Column(nullable = false,length = 20)
    private String location;

    @Column(nullable = false)
    private Integer capacity;

    public MeetingRoom(String meetingRoomId, String name, String location, Integer capacity){
        this.meetingRoomId = meetingRoomId;
        this.name = name;
        this.location = location;
        this.capacity = capacity;
    }

    // DTO → Entity
    public static MeetingRoom from(MeetingRoomDto dto) {
        return new MeetingRoom(
                dto.getMeetingRoomId(),
                dto.getName(),
                dto.getLocation(),
                dto.getCapacity()
        );
    }
    public void update(MeetingRoomDto dto) {
        this.name = dto.getName();
        this.location = dto.getLocation();
        this.capacity = dto.getCapacity();
    }
}
