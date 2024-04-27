package ch.vifian.tjchu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class ScheduledTasks {

    @Autowired
    GameService gs;

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    @Scheduled(cron = "37 25,35,59 * * * *")
    public void reportCurrentTime(  ) {
        gs.createGame("Autogame " + LocalDateTime.now().format( DateTimeFormatter.ISO_LOCAL_DATE_TIME));
    }
}
