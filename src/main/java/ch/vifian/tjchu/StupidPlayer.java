package ch.vifian.tjchu;

import ch.taburett.tichu.game.Ack;
import ch.taburett.tichu.game.AckGameStage;
import ch.taburett.tichu.game.PlayerMessage;
import ch.taburett.tichu.game.Schupf;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.SneakyThrows;

import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Consumer;

@Data
public class StupidPlayer implements Player {
    public final String name;
    public final Consumer<PlayerMessage> listener;

    @SneakyThrows
    @Override
    public void receiveServerMessage(String msg, Object payload) {
        if( payload instanceof AckGameStage ack) {

            if(ack.getStage() == AckGameStage.Stage.EIGHT_CARDS ) {
                listener.accept( new Ack.BigTichu());
            }
            if(ack.getStage() == AckGameStage.Stage.PRE_SCHUPF ) {
                listener.accept( new Ack.TichuBeforeSchupf());
            }
            if(ack.getStage() == AckGameStage.Stage.SCHUPF ) {
                var cards = ack.getCards();
                listener.accept( new Schupf( cards.get(0), cards.get(1), cards.get(2) ));
            }
            if(ack.getStage() == AckGameStage.Stage.PRE_SCHUPF ) {
                listener.accept( new Ack.TichuBeforePlay());
            }
        }
        System.out.println(msg);
        System.out.println(new ObjectMapper().writeValueAsString(payload));
        // impl belongs to libTichu
    }

}
