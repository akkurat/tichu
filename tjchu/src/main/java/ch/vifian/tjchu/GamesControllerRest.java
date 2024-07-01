package ch.vifian.tjchu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collection;
import java.util.UUID;

@RestController
public class GamesControllerRest {

    @Autowired
    GameService gs;

    @GetMapping("/games/{id}/resend")
    public TichuGameWeb resend(@PathVariable("id") String id) {
        return gs.games.get(UUID.fromString(id)).resend();
    }

    @GetMapping("/games")
    public Collection<TichuGameWeb> getList() {
        return gs.listGames();
    }

    @PostMapping("/games/create")
    @ResponseBody
    public TichuGameWeb createGame(@RequestParam(name = "caption") String caption) {
        return gs.createGame(caption);
    }

    @PutMapping("/games/join")
    @ResponseBody
    public JoinResponse joinGame(@RequestParam(name = "gameid") String gameid, @RequestParam(required = false, name = "group") String group, Principal user) {
        return gs.join(gameid, group, user.getName());
    }


}
