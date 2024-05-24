package ch.vifian.tjchu;

import ch.taburett.tichu.cards.CardsKt;
import ch.taburett.tichu.cards.PlayCard;
import ch.taburett.tichu.game.*;
import ch.taburett.tichu.game.Game;
import ch.taburett.tichu.game.Player;
import ch.taburett.tichu.game.protocol.*;
import com.google.common.collect.ImmutableMap;
import lombok.Getter;
import org.jetbrains.annotations.NotNull;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static ch.taburett.tichu.cards.CardsKt.getLookupByCode;

// todo: interface game
public class TichuGame {

    public final UUID id;
    @Nullable
    public final String caption;
    private final SimpMessagingTemplate simpMessagingTemplate;
    @Getter
    private final Map<String, ProxyPlayer> players;
    private Consumer<WrappedPlayerMessage> listener;
    private Map<String, String> userNameToPlayer;
    private final Map<String, ServerMessage> lastServerMsgBuffer = new HashMap<>();
    private Game game;

    // Log
    // ProxyUsers
    // Uuuid
    public TichuGame(@Nullable String caption, SimpMessagingTemplate simpMessagingTemplate) {
        this.caption = caption;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.id = UUID.randomUUID();
        this.players = ImmutableMap.of(
                "A1", new ProxyPlayer("A1"),
                "B1", new ProxyPlayer("B1"),
                "A2", new ProxyPlayer("A2"),
                "B2", new ProxyPlayer("B2"));
        // todo: interactive
        players.values().stream()
                .limit(3)
                .forEach(p -> p.connect(new StupidUserPlayer(Player.valueOf(p.name), p.name, msg -> receiveUserMsg(p.name, msg))));
    }


    // todo: desired teams
    // this should be made thread safe
    public JoinResponse join(String name) {
        var existingPlayer = players.values().stream()
                .filter(pp -> pp.userPlayerReference != null && pp.userPlayerReference.getName().equals(name))
                .findFirst();
        if (existingPlayer.isPresent()) {
            var proxyPlayer = existingPlayer.get();
            proxyPlayer.reconnected();
            return new JoinResponse(id, proxyPlayer.name, "Sucessfully reconnected", true);
        }

        var freeSeat = players.values().stream()
                .filter(ProxyPlayer::unconnected)
                .findFirst();

        if (freeSeat.isPresent()) {
            var proxyPlayer = freeSeat.get();
            var mp = new MessageUserPlayer(name, simpMessagingTemplate, id);
            proxyPlayer.connect(mp);

            if (players.values().stream().allMatch(ProxyPlayer::connected)) {
                // todo: started and start round and so on
                // here the reverse map can be built
                userNameToPlayer = players.entrySet().stream()
                        .collect(Collectors.toMap(v -> v.getValue().userPlayerReference.getName(), Map.Entry::getKey));
                startGame();
            }
            return new JoinResponse(id, proxyPlayer.name, "Welcome to the game", false);
        } else {
            return JoinResponse.ofNull(id);
        }
    }

    private void startGame() {
        // todo: ref
        game = new Game(this::receiveServerMessage);
        game.start(true);

    }

    public void receiveUserMsg(String user, Map<String, Object> payload) {

        if ("Ack".equals(payload.get("type"))) {
            if (payload.get("what") instanceof String what) {

                var msg = switch (what) {
                    case "BigTichu" -> new Ack.BigTichu();
                    case "TichuBeforeSchupf" -> new Ack.TichuBeforeSchupf();
                    case "TichuAfterSchupf" -> new Ack.TichuBeforePlay();
                    case "SchupfcardReceived" -> new Ack.SchupfcardReceived();
                    default -> throw new IllegalStateException("Unexpected value: " + what);
                };
                receiveUserMsg(user, msg);
            }
        } else if ("Schupf".equals(payload.get("type"))) {
            // todo: get cards
            Map<String, String> cards = (Map<String, String>) payload.get("what");
            var lUp = getLookupByCode();
            receiveUserMsg(user, new Schupf(
                    lUp.get(cards.get("re")),
                    lUp.get(cards.get("li")),
                    lUp.get(cards.get("partner"))
            ));
        } else if ("Move".equals(payload.get("type"))) {

            List<PlayCard> cards = ((List<String>) payload.get("cards"))
                    .stream().map(CardsKt::parsePlayCard)
                    .toList();
            receiveUserMsg(user, new Move(cards));
        }

    }

    public void receiveUserMsg(String user, PlayerMessage msg) {

        // map user -> player
        var playerString = userNameToPlayer.get(user);
        // todo: intercept and log

        var player = Player.valueOf(playerString);

        game.receiveUserMessage(new WrappedPlayerMessage(player, msg));
    }

    /// todo: make impl not public (wrap to listener obj)
    public void receiveServerMessage(@NotNull WrappedServerMessage wrappedServerMessage) {
        // forward to respective user
        // todo here: buffer last requiring ack message. or just laswt message?
        // let's try just last answer per user ffs
        var user = wrappedServerMessage.getU();

        var msg = new MessageWrapper(wrappedServerMessage.getMessage());

        try (var e = Executors.newCachedThreadPool()) {
            e.execute(() -> {
                try {
                    players.get(user.name()).receiveServerMessage(msg);
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            });
        }

    }

}
