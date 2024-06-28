FROM gradle:jdk21 as build
COPY . /home/app/
WORKDIR /home/app/
RUN gradle bootJar

FROM eclipse-temurin:21-jre-alpine
COPY --from=build /home/app/build/libs/tjchu-0.0.1-SNAPSHOT.jar /usr/local/lib/tjchu.jar
ENTRYPOINT ["java","-jar","/usr/local/lib/tjchu.jar"]