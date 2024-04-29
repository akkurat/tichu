package ch.vifian.tjchu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Controller
public class GamesControllerWs {

    @Autowired
    GameService gs;

    @SubscribeMapping("/games")
    public Collection<TichuGame> onSubscribeToGames() {
        return gs.listGames();
    }


    @SubscribeMapping("/test")
    public String onTest() {
        return "TEEEEST";
    }



}
