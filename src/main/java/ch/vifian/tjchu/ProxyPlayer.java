package ch.vifian.tjchu;

import ch.taburett.tichu.game.Points;
import lombok.Getter;

public class ProxyPlayer {

    public final String name;
    // just a string?
    @Getter
    Player playerReference = null;

    private MessageWrapper lastServerMessage = null;
    private MessageWrapper lastPointMessage = null;

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
            if( lastPointMessage != null )  {
                playerReference.receiveServerMessage(lastPointMessage);
            }
        }
    }

    public void receiveServerMessage(MessageWrapper message) {
        if( message.message instanceof Points ) {
            lastPointMessage = message;
        } else {
            lastServerMessage = message;
        }
        playerReference.receiveServerMessage(message);
    }
}
