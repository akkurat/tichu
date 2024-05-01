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

    @SneakyThrows
    public void setDeck(List<HandCard> deck) {
        this.deck = new ArrayList<>(deck);
        playerReference.message("Cards", deck);
    }
}
