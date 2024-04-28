package ch.vifian.tjchu;

import lombok.Data;

import javax.annotation.Nullable;
import java.util.UUID;

@Data
public class JoinResponse {
    @Nullable
    public final UUID id;
    public final String name;

    public static JoinResponse ofNull(UUID id) {
        return new JoinResponse(id, null);
    }
}
