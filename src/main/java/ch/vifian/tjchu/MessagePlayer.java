package ch.vifian.tjchu;

import com.google.common.collect.ImmutableMap;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;

@Data
public class MessagePlayer implements Player {

    public final String name;
    @Getter(AccessLevel.NONE)
    private final SimpMessagingTemplate messagingTemplate;
    public final UUID gameId;


    @Override
    public final void receiveServerMessage(MessageWrapper payload) {
        messagingTemplate.convertAndSendToUser(name, "/queue/games/" + gameId,
                payload
        );
    }
}
