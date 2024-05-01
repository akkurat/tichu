package ch.vifian.tjchu;

import ch.taburett.tichu.cards.CardsKt;
import ch.taburett.tichu.cards.HandCard;
import lombok.Getter;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.annotation.Nullable;
import java.util.*;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.*;

// todo: interface game
public class TichuGame {

    public final UUID id;
    private final List<HandCard> fulldeck;
    @Nullable
    public final String caption;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ProxyPlayer proxyPlayerA1;
    private final ProxyPlayer proxyPlayerA2;
    private final ProxyPlayer proxyPlayerB1;
    private final ProxyPlayer proxyPlayerB2;
    @Getter
    private final List<ProxyPlayer> players;

    // Log
    // ProxyUsers
    // Uuuid
    public TichuGame(@Nullable String caption, SimpMessagingTemplate simpMessagingTemplate) {
        this.caption = caption;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.fulldeck = CardsKt.getFulldeck();
        this.id = UUID.randomUUID();
        this.proxyPlayerA1 = new ProxyPlayer("A1");
        this.proxyPlayerA2 = new ProxyPlayer("A2");
        this.proxyPlayerB1 = new ProxyPlayer("B1");
        this.proxyPlayerB2 = new ProxyPlayer("B2");
        this.players = List.of(proxyPlayerA1, proxyPlayerB1, proxyPlayerA2, proxyPlayerB2);
        for (var i = 0; i < 3; i++) {
            ProxyPlayer proxyPlayer = players.get(i);
            proxyPlayer.connect(new StupidPlayer(proxyPlayer.name));
        }
    }

    // todo: desired teams
    // this should be made thread safe
    public JoinResponse join(String name) {
        var existingPlayer = players.stream()
                .filter(pp -> pp.playerReference != null && pp.playerReference.getName().equals(name))
                .findFirst();
        if (existingPlayer.isPresent()) {
            var proxyPlayer = existingPlayer.get();
            return new JoinResponse(id, proxyPlayer.name, "Sucessfully reconnected", true);
        }

        var player = players.stream()
                .filter(ProxyPlayer::unconnected)
                .findFirst();

        if (player.isPresent()) {
            var proxyPlayer = player.get();
            var mp = new MessagePlayer(name, simpMessagingTemplate, id);
            proxyPlayer.connect(mp);

            if (players.stream().allMatch(ProxyPlayer::connected)) {
                // todo: started and start round and so on
                distributeCards();
                startGame();

            }

            return new JoinResponse(id, proxyPlayer.name, "Welcome to the game", false);
        } else {
            return JoinResponse.ofNull(id);
        }
    }

    private void startGame() {
//        this.players.connect
    }

    private void distributeCards() {
        List<Integer> indices = Arrays.stream(IntStream.range(0, fulldeck.size()).toArray())
                .boxed()
                .collect(toList());
        Collections.shuffle(indices);
        for (int i = 0; i < players.size(); i++) {
            ProxyPlayer p = players.get(i);
            var deck = indices.subList(i, i + 14).stream().map(fulldeck::get).toList();
            p.setDeck(deck);
        }
    }
}
