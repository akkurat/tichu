package ch.vifian.tjchu;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collection;

@Controller
@CrossOrigin("*")
public class GamesControllerWs {

    @Autowired
    GameService gs;

    @MessageMapping("/games")
    public void list(@Payload String body, Principal p) {
        System.out.println(body);
        gs.publishGames();
    }

    @MessageMapping("/games/create")
    public void create(@Payload String caption) {
        System.out.println(caption);
    }



}
