package ch.vifian.tjchu;

import ch.taburett.tichu.game.PlayerProxies;
import lombok.Getter;

public class ProxyPlayer {

    public final String name;
    // just a string?
    @Getter
    Player playerReference = null;

    public ProxyPlayer(String a1) {
       this.name = a1;
    }

    public boolean unconnected() {
        return playerReference == null;
    }


    public void connect(String name) {
       playerReference = new Player(name);
    }
}
