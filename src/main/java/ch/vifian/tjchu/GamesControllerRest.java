package ch.vifian.tjchu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
    public JoinResponse joinGame(@RequestParam(name = "gameid") String gameid, Principal user) {
        return gs.join( gameid, user.getName() );
    }



}
