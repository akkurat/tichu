package ch.vifian.tjchu;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@CrossOrigin("*")
@RestController
public class GamesControllerRest {

    @Autowired
    GameService gs;

    @GetMapping("/games")
    public Collection<TichuGame> getList() {
        return gs.listGames();
    }

    @PostMapping("/games/create")
    @ResponseBody
    public TichuGame createGame( @RequestParam(name = "caption") String caption) {
        return gs.createGame(caption);
    }

    @PutMapping("/games/join")
    @ResponseBody
    public String joinGame(@RequestParam(name = "gameid") String gameid, HttpSession session) {
        System.out.println(session.getId());
        return "joined";
//        todo get session info.. .somehow
//        return gs.join(gameid);
    }



}
