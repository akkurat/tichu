package ch.vifian.tjchu;

import ch.taburett.tichu.cards.HandCard;
import lombok.Getter;
import lombok.SneakyThrows;

import java.util.ArrayList;
import java.util.List;

public class ProxyPlayer {

    public final String name;
    // just a string?
    @Getter
    Player playerReference = null;

    private ArrayList<HandCard> deck;
    private MessageWrapper lastServerMessage = null;

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
            if (lastServerMessage != null) {
                playerReference.receiveServerMessage(lastServerMessage);
            }
        }
    }

    public void receiveServerMessage(MessageWrapper message) {

//        lastServerMsgBuffer.put(user.name(), wrappedServerMessage.getMessage());
        lastServerMessage = message;
        playerReference.receiveServerMessage(message);
    }
}
