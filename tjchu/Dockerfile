# Example of custom Java runtime using jlink in a multi-stage container build
FROM gradle:jdk21 as jre-build

# Build small JRE image
RUN $JAVA_HOME/bin/jlink \
         --verbose \
         --add-modules ALL-MODULE-PATH \
         --strip-debug \
         --no-man-pages \
         --no-header-files \
         --compress=2 \
         --output /customjre


FROM debian:buster-slim
ENV JAVA_HOME=/jre
ENV PATH="${JAVA_HOME}/bin:${PATH}"

COPY --from=jre-build /customjre $JAVA_HOME

COPY build/libs/tjchu-0.0.1-SNAPSHOT.jar /usr/local/lib/tjchu.jar
RUN /jre/bin/java -version
ENTRYPOINT ["java","-jar","/usr/local/lib/tjchu.jar"]
EXPOSE 8080
