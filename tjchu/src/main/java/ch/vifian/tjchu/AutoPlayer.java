package ch.vifian.tjchu;

import ch.taburett.tichu.botplayer.implementations.StrategicPlayer;
import ch.taburett.tichu.game.core.common.EPlayer;
import ch.taburett.tichu.botplayer.helpers.BattleRound;
import ch.taburett.tichu.botplayer.implementations.StupidPlayer;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.SneakyThrows;
import lombok.ToString;

import java.util.function.Consumer;

import static ch.taburett.tichu.game.communication.Message.PlayerMessage;
import static ch.taburett.tichu.game.communication.Message.ServerMessage;


@Getter
@EqualsAndHashCode
@ToString
public class AutoPlayer implements UserPlayer {
    public final EPlayer player;
    public final String name;
    public final Consumer<PlayerMessage> listener;
    private final BattleRound.AutoPlayer autoplayer;

    public AutoPlayer(EPlayer player, String name, Consumer<PlayerMessage> listener, String type) {
        this.player = player;
        this.name = name;
        this.listener = listener;
//        todo: make selectable via web ui
        if ("Strategic".equals(type)) {
            autoplayer = new StrategicPlayer(listener);
        } else {
            autoplayer = new StupidPlayer(listener);
        }
    }

    @SneakyThrows
    @Override
    public void receiveServerMessage(MessageWrapper payload) {
        Thread.sleep(200);
        ServerMessage message = payload.message;
        autoplayer.receiveMessage(message, player);
    }

}
