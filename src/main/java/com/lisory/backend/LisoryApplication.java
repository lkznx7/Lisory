package com.lisory.backend;

import com.lisory.backend.config.properties.CorsProperties;
import com.lisory.backend.config.properties.DatabaseProperties;
import com.lisory.backend.config.properties.InfinitePayProperties;
import com.lisory.backend.config.properties.JwtProperties;
import com.lisory.backend.config.properties.MelhorEnvioProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties({
    JwtProperties.class,
    DatabaseProperties.class,
    MelhorEnvioProperties.class,
    InfinitePayProperties.class,
    CorsProperties.class
})
public class LisoryApplication {
    public static void main(String[] args) {
        SpringApplication.run(LisoryApplication.class, args);
    }
}
