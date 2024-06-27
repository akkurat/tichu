/*
 * Copyright 2020-2021 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ch.vifian.tjchu.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

/**
 * Security configuration for the main application.
 *
 * @author Josh Cummings
 */
@Configuration
public class SecurityConfig {

    @Value("${jwt.public.key}")
    RSAPublicKey key;

    @Value("${jwt.private.key}")
    RSAPrivateKey priv;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authorize) -> {
//                    authorize.anyRequest().permitAll();
                    authorize.requestMatchers("/login").permitAll()
                            .anyRequest().authenticated();
                })
//                .httpBasic(Customizer.withDefaults())
                .formLogin(form -> {
                    form.successHandler((req, res, auth) -> {
                        res.resetBuffer();
                        res.setStatus(HttpStatus.OK.value());
                        res.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
                        new ObjectMapper().writeValue(res.getWriter(), auth.getPrincipal());
                    });
                    form.failureHandler((req, res, auth) -> {
                        res.resetBuffer();
                        res.setStatus(HttpStatus.UNAUTHORIZED.value());
                        res.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
                        new ObjectMapper().writeValue(res.getWriter(), auth.getMessage());
                    });
                })
                .logout(logout -> {
                    logout.logoutSuccessHandler((req, res, auth) -> {
                        res.resetBuffer();
                        res.setStatus(HttpStatus.OK.value());
                        res.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
                        new ObjectMapper().writeValue(res.getWriter(), auth.getPrincipal());
                    });
                })
                .exceptionHandling(exc -> {
                    exc.accessDeniedHandler((req, res, ae) -> {
                        res.resetBuffer();
                        res.setStatus(HttpStatus.FORBIDDEN.value());
                        res.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
                        new ObjectMapper().writeValue(res.getWriter(), ae.getMessage());
                    });
                })
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.ALWAYS))
                .csrf(csrf -> {
                    csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
                    csrf.csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler());
                })
                .addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class);
        ;
        return http.build();
    }

    @Bean
    UserDetailsService users() {
        return new InMemoryUserDetailsManager(
                User.withUsername("user")
                        .password("{noop}password")
                        .authorities("app")
                        .build(),
                User.withUsername("puser")
                        .password("{noop}password")
                        .authorities("app")
                        .build()
        );
    }

}
