package ch.vifian.tjchu;

import ch.taburett.tichu.game.Player;
import ch.taburett.tichu.game.protocol.PlayerMessage;
import ch.taburett.tichu.game.protocol.ServerMessage;
import lombok.Data;
import lombok.SneakyThrows;

import java.util.function.Consumer;

import static ch.taburett.tichu.game.player.LessStupidPlayerKt.lessStupidMove;


@Data
public class StupidUserPlayer implements UserPlayer {
    public final Player player;
    public final String name;
    public final Consumer<PlayerMessage> listener;

    @SneakyThrows
    @Override
    // todo: move to libtichu and convert to kotlin
    public void receiveServerMessage(MessageWrapper payload) {
        Thread.sleep(500);
        ServerMessage message = payload.message;
        lessStupidMove(message, listener, player);
    }

}
