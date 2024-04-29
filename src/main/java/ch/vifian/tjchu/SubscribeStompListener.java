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

import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

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

        if (destination.startsWith("/user")) {
//            this.messagingTemplate.convertAndSendToUser(user.getName(), destination.substring("/user".length()), "VERy prIVATE");
            this.messagingTemplate.convertAndSend( destination.substring("/user".length()), "FIIIIRST", headersToSend);
            this.messagingTemplate.convertAndSend( destination, "Second...", headersToSend);
        }
        if (destination.startsWith("/topic/games")) {
            this.messagingTemplate.convertAndSend(destination, gs.listGames(), headersToSend);
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
