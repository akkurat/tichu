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

    // Log
    // ProxyUsers
    // Uuuid
    public TichuGame(@Nullable String caption) {
        this.caption = caption;
        this.fulldeck = CardsKt.getFulldeck();
        this.id = UUID.randomUUID();

    }
}
