package ch.vifian.tjchu;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin("*")
public class GamesController {

    @Autowired
    GameService gs;

    @MessageMapping("/games")
    public void list(String body) {
        gs.publishGames();
    }

    @MessageMapping("/games/create")
    public void create(String caption) {
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
