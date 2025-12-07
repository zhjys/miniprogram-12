// src/main/java/com/example/cultureapp/repository/VideoRepository.java
package com.example.cultureapp.repository;

import com.example.cultureapp.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByArtworkId(Long artworkId);
    List<Video> findByUserId(Long userId);
}
