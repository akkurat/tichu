package ch.vifian.tjchu;

import ch.taburett.tichu.cards.CardsKt;
import ch.taburett.tichu.cards.HandCard;
import lombok.Getter;

import javax.annotation.Nullable;
import java.util.List;
import java.util.UUID;

// todo: interface game
public class TichuGame {

    public final UUID id;
    private final List<HandCard> fulldeck;
    @Nullable
    public final String caption;
    private final ProxyPlayer proxyPlayerA1;
    private final ProxyPlayer proxyPlayerA2;
    private final ProxyPlayer proxyPlayerB1;
    private final ProxyPlayer proxyPlayerB2;
    @Getter
    private final List<ProxyPlayer> players;

    // Log
    // ProxyUsers
    // Uuuid
    public TichuGame(@Nullable String caption) {
        this.caption = caption;
        this.fulldeck = CardsKt.getFulldeck();
        this.id = UUID.randomUUID();
        this.proxyPlayerA1 = new ProxyPlayer("A1");
        this.proxyPlayerA2 = new ProxyPlayer("A2");
        this.proxyPlayerB1 = new ProxyPlayer("B1");
        this.proxyPlayerB2 = new ProxyPlayer("B2");
        this.players = List.of(proxyPlayerA1, proxyPlayerB1, proxyPlayerA2, proxyPlayerB2);
    }

    // todo: desired teams
    // this should be made thread safe
    public JoinResponse join(String name) {

        var existingPlayer = players.stream()
                .filter(pp -> pp.playerReference != null && pp.playerReference.name.equals(name))
                .findFirst();
        if (existingPlayer.isPresent()) {
            var proxyPlayer = existingPlayer.get();
            return new JoinResponse(id, proxyPlayer.name, "Sucessfully reconnected", true);
        }

        var player = players.stream()
                .filter(proxyPlayer -> proxyPlayer.unconnected())
                .findFirst();

        if (player.isPresent()) {
            var proxyPlayer = player.get();
            proxyPlayer.connect(name);
            return new JoinResponse(id, proxyPlayer.name, "Wellcome to the game", false);
        } else {
            return JoinResponse.ofNull(id);
        }
    }
}
