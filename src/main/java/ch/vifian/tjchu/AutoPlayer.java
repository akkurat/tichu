package ch.vifian.tjchu;

import ch.taburett.tichu.game.Player;
import ch.taburett.tichu.game.player.BattleRound;
import ch.taburett.tichu.game.player.StupidPlayer;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.SneakyThrows;
import lombok.ToString;

import java.util.function.Consumer;

import static ch.taburett.tichu.game.protocol.Message.PlayerMessage;
import static ch.taburett.tichu.game.protocol.Message.ServerMessage;


@Getter
@EqualsAndHashCode
@ToString
public class AutoPlayer implements UserPlayer {
    public final Player player;
    public final String name;
    public final Consumer<PlayerMessage> listener;
    private final BattleRound.AutoPlayer autoplayer;

    public AutoPlayer(Player player, String name, Consumer<PlayerMessage> listener) {
        this.player = player;
        this.name = name;
        this.listener = listener;
//        todo: make selectable via web ui
        autoplayer = new StupidPlayer(listener);
    }

    @SneakyThrows
    @Override
    public void receiveServerMessage(MessageWrapper payload) {
        Thread.sleep(500);
        ServerMessage message = payload.message;
        autoplayer.receiveMessage(message, player);
    }

}
