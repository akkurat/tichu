package ch.vifian.tjchu;

import ch.taburett.tichu.cards.HandCard;
import ch.taburett.tichu.cards.Phoenix;
import ch.taburett.tichu.cards.PlayCard;
import ch.taburett.tichu.game.*;
import ch.taburett.tichu.patterns.LegalType;
import lombok.Data;
import lombok.SneakyThrows;

import java.util.Comparator;
import java.util.List;
import java.util.function.Consumer;

import static ch.taburett.tichu.cards.CardUtilsKt.pattern;

@Data
public class StupidPlayer implements Player {
    public final String name;
    public final Consumer<PlayerMessage> listener;

    @SneakyThrows
    @Override
    public void receiveServerMessage(MessageWrapper payload) {
        switch (payload.message) {
            case AckGameStage ack -> {
                switch (ack.getStage()) {
                    case EIGHT_CARDS -> listener.accept(new Ack.BigTichu());
                    case PRE_SCHUPF -> listener.accept(new Ack.TichuBeforeSchupf());
                    case SCHUPF -> {
                        var cards = ack.getCards();
                        listener.accept(new Schupf(cards.get(0), cards.get(1), cards.get(2)));
                    }
                    case POST_SCHUPF -> listener.accept(new Ack.TichuBeforePlay());
                }
            }
            case Schupf schupf -> listener.accept(new Ack.SchupfcardReceived());
            case MakeYourMove mm -> {
                List<Played> table = mm.getTable();
                if (!table.isEmpty()) {
                    var last = table.getLast();
                    var pat = pattern(last.getCards());
                    var all = pat.getType().patterns(mm.getHandcards());
                    if (all.isEmpty()) {
                        listener.accept(new Move(List.of()));
                    } else {
                        var mypat = all.iterator().next();
                        if (mypat.beats(pat).getType() == LegalType.OK) {
                            listener.accept(new Move(mypat.getCards()));
                        } else {
                            listener.accept(new Move(List.of()));
                        }
                    }

                    // pattern
                } else {
                    // play smallest card
                    var ocard = mm.getHandcards().stream()
                            .min(Comparator.comparingDouble(HandCard::getSort))
                            .orElse(null);

                    List<PlayCard> ret = switch (ocard) {
                        case Phoenix sc -> List.of(sc.asPlayCard(1));
                        case PlayCard pc -> List.of(pc);
                        case null, default -> List.of();
                    };
                    listener.accept(new Move(ret));
                }
            }
            case null, default -> {
            }
        }
    }
}
