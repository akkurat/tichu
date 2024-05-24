package ch.vifian.tjchu;

import ch.taburett.tichu.game.Points;
import ch.taburett.tichu.game.Rejected;
import ch.taburett.tichu.game.ServerMessage;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

public class ProxyPlayer {

    public final String name;
    // just a string?
    @Getter
    UserPlayer userPlayerReference = null;

    Map<Class<? extends ServerMessage>, MessageWrapper> buffer = new HashMap<>();

    public ProxyPlayer(String a1) {
        this.name = a1;
    }

    public boolean unconnected() {
        return userPlayerReference == null;
    }

    public boolean connected() {
        return !unconnected();
    }

    public void connect(UserPlayer ref) {
        userPlayerReference = ref;
    }

//    @SneakyThrows
//    public void setDeck(List<HandCard> deck) {
//        this.deck = new ArrayList<>(deck);
//        playerReference.receiveServerMessage(deck);
//    }

    public void reconnected() {
        if (userPlayerReference != null) {
            for (var message : buffer.values()) {
                userPlayerReference.receiveServerMessage(message);
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
        userPlayerReference.receiveServerMessage(message);
    }
}
