package ch.vifian.tjchu;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

import static ch.taburett.tichu.game.communication.Message.*;

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
