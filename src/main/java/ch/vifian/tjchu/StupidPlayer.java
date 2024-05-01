package ch.vifian.tjchu;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.Getter;

@Data
public class StupidPlayer implements Player {
    public final String name;

    @Override
    public void message(String msg, Object payload) throws Exception {
        System.out.println(msg);
        System.out.println(new ObjectMapper().writeValueAsString(payload));
    }

}
