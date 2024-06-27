package ch.vifian.tjchu;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class UserEndpoint {
    @GetMapping("/user")
    public Principal getCurrentUser(Principal user) {
        return user;
    }
}
