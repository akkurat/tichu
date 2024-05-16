package ch.vifian.tjchu;

import org.apache.commons.logging.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.MethodParameter;
import org.springframework.lang.Nullable;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.core.AbstractMessageSendingTemplate;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.messaging.simp.SimpLogging;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.support.SubscriptionMethodReturnValueHandler;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

import static java.util.concurrent.Executors.newCachedThreadPool;

@Component
public class SubscribeStompListener implements ApplicationListener<SessionSubscribeEvent> {
    private static final Log logger = SimpLogging.forLogName(SubscribeStompListener.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private GameService gs;


    @Override
    public void onApplicationEvent(SessionSubscribeEvent sessionSubscribeEvent) {


        var user = sessionSubscribeEvent.getUser();

        var message = sessionSubscribeEvent.getMessage();

        MessageHeaders headers = message.getHeaders();
        String sessionId = SimpMessageHeaderAccessor.getSessionId(headers);
        String subscriptionId = SimpMessageHeaderAccessor.getSubscriptionId(headers);
        String destination = SimpMessageHeaderAccessor.getDestination(headers);

//        if (subscriptionId == null) {
//            throw new IllegalStateException("No simpSubscriptionId in " + message +
//                    " returned by: " + returnType.getMethod());
//        }
//        if (destination == null) {
//            throw new IllegalStateException("No simpDestination in " + message +
//                    " returned by: " + returnType.getMethod());
//        }
//
//        if (logger.isDebugEnabled()) {
//            logger.debug("Reply to @SubscribeMapping: " + returnValue);
//        }

        MessageHeaders headersToSend = createHeaders(sessionId, subscriptionId);

        try (var pool = newCachedThreadPool()) {
            pool.execute(() -> {
                // ugly but no chance to solve otherwise so far
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }

                if (destination.startsWith("/user")) {
//            this.messagingTemplate.convertAndSendToUser(user.getName(), destination.substring("/user".length()), "VERy prIVATE");
//                todo: check if user is part of game
                    var gameid = destination.substring("/user/queue/games/".length());

                    System.out.println(gameid);
                    var game = gs.games.get(UUID.fromString(gameid));

                    var response = game.join(user.getName());

                    this.messagingTemplate.convertAndSendToUser(user.getName(), destination.substring("/user".length()),
                            response, headersToSend);
                }
                if (destination.startsWith("/topic/games")) {
                    this.messagingTemplate.convertAndSend(destination, gs.listGames(), headersToSend);
                }
            });
        }
    }

    private MessageHeaders createHeaders(@Nullable String sessionId, String subscriptionId) {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
//        if (getHeaderInitializer() != null) {
//            getHeaderInitializer().initHeaders(accessor);
//        }
        if (sessionId != null) {
            accessor.setSessionId(sessionId);
        }
        accessor.setSubscriptionId(subscriptionId);
//        accessor.setHeader(AbstractMessageSendingTemplate.CONVERSION_HINT_HEADER, returnType);
        accessor.setLeaveMutable(true);
        return accessor.getMessageHeaders();
    }

}
