package ch.vifian.tjchu;

import ch.taburett.tichu.game.Points;
import ch.taburett.tichu.game.Rejected;
import ch.taburett.tichu.game.ServerMessage;
import kotlin.reflect.KClass;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

public class ProxyPlayer {

    public final String name;
    // just a string?
    @Getter
    Player playerReference = null;

    Map<Class<? extends ServerMessage>, MessageWrapper> buffer = new HashMap<>();

    public ProxyPlayer(String a1) {
        this.name = a1;
    }

    public boolean unconnected() {
        return playerReference == null;
    }

    public boolean connected() {
        return !unconnected();
    }

    public void connect(Player ref) {
        playerReference = ref;
    }

//    @SneakyThrows
//    public void setDeck(List<HandCard> deck) {
//        this.deck = new ArrayList<>(deck);
//        playerReference.receiveServerMessage(deck);
//    }

    public void reconnected() {
        if (playerReference != null) {
            for (var message : buffer.values()) {
                playerReference.receiveServerMessage(message);
            }
        }
    }

    public void receiveServerMessage(MessageWrapper message) {
        if (message.message instanceof Points) {
            buffer.put(Points.class, message);
        } else if (message.message instanceof Rejected) {
            buffer.put(Rejected.class, message);
        } else {
            buffer.put(ServerMessage.class, message);
            // todo: document this logic
            // however assume a new correct message cleans out a rejection
            buffer.remove( Rejected.class);
        }
        playerReference.receiveServerMessage(message);
    }
}
