package ch.vifian.tjchu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;

@Controller
public class GamesControllerWs {

    @Autowired
    GameService gs;

    @SubscribeMapping("/games")
    public Collection<TichuGameWeb> onSubscribeToGames() {
        return gs.listGames();
    }

    @MessageMapping("/games/{id}")
    public void writeToGame(@Payload Map<String,Object> payload, @DestinationVariable("id") String gameId, Principal user) {
       gs.games.get(UUID.fromString(gameId)).receiveUserMsg(user.getName(), payload);
    }

    @SubscribeMapping("/test")
    public String onTest() {
        return "TEEEEST";
    }

}
