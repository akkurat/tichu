package ch.vifian.tjchu;

import ch.taburett.tichu.game.protocol.Message;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import static ch.taburett.tichu.game.protocol.Message.*;

public class MessageWrapper {

    @JsonTypeInfo(
            use = JsonTypeInfo.Id.NAME,
            include = JsonTypeInfo.As.EXTERNAL_PROPERTY,
            property = "type")
    public final ServerMessage message;


    public MessageWrapper(ServerMessage message) {
        this.message = message;
    }
}
