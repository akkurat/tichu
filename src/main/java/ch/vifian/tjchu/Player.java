package ch.vifian.tjchu;

public interface Player {
    void message(String msg, Object payload) throws Exception;

    String getName();
}
