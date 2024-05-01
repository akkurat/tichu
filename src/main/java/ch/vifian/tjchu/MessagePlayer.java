package ch.vifian.tjchu;

import com.google.common.collect.ImmutableMap;
import lombok.Data;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;

@Data
public class MessagePlayer implements Player {
    public final String name;
    public final SimpMessagingTemplate messagingTemplate;
    public final UUID id;

    @Override
    public final void message(String msg, Object payload) throws Exception {
        messagingTemplate.convertAndSendToUser(name, "/queue/games/" + id,
                ImmutableMap.of("message", msg, "payload", payload)
        );
    }
}
