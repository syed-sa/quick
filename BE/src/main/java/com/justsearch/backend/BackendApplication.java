package com.justsearch.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.security.access.AccessDeniedException;

import com.justsearch.backend.config.JwtConfig;
@SpringBootApplication
@EnableConfigurationProperties(JwtConfig.class)
@EnableCaching
public class BackendApplication {

	public static void main(String[] args) {
		try {
   SpringApplication.run(BackendApplication.class, args);
	}
 catch (AccessDeniedException ace) {
    ace.printStackTrace();
    throw ace;

		

}
	}

}