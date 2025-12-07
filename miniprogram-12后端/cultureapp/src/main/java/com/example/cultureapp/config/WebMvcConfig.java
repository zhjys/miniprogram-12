package com.example.cultureapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.upload-url-path}")
    private String uploadUrlPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            String location = "file:" + uploadPath.toString().replace("\\", "/") + "/";
            // example: registry.addResourceHandler("/uploads/videos/**").addResourceLocations("file:C:/.../uploads/videos/");
            registry.addResourceHandler(uploadUrlPath + "/**")
                    .addResourceLocations(location);
        } catch (Exception e) {
            // fallback to project relative path
            String fallback = "file:" + System.getProperty("user.dir") + "/" + uploadDir + "/";
            registry.addResourceHandler(uploadUrlPath + "/**").addResourceLocations(fallback);
        }
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 开发环境放通，生产请收窄 origin
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
