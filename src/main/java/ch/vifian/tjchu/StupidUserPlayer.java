package ch.vifian.tjchu;

import ch.taburett.tichu.game.Player;
import ch.taburett.tichu.game.protocol.*;
import lombok.Data;
import lombok.SneakyThrows;

import java.util.function.Consumer;

import static ch.taburett.tichu.game.StupidPlayerKt.stupidMove;


@Data
public class StupidUserPlayer implements UserPlayer {
    public final Player player;
    public final String name;
    public final Consumer<PlayerMessage> listener;

    @SneakyThrows
    @Override
    // todo: move to libtichu and convert to kotlin
    public void receiveServerMessage(MessageWrapper payload) {
        Thread.sleep(1500);
        ServerMessage message = payload.message;
        stupidMove(message, listener, player);
    }

}
