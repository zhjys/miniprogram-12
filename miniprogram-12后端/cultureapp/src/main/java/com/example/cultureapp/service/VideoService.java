// src/main/java/com/example/cultureapp/service/VideoService.java
package com.example.cultureapp.service;

import com.example.cultureapp.model.Video;
import com.example.cultureapp.repository.VideoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VideoService {
    private final VideoRepository repo;

    public VideoService(VideoRepository repo) { this.repo = repo; }

    public Video save(Video v) { return repo.save(v); }
    public Optional<Video> findById(Long id) { return repo.findById(id); }
    public List<Video> findAll() { return repo.findAll(); }
    public List<Video> findByArtworkId(Long artworkId) { return repo.findByArtworkId(artworkId); }
    public List<Video> findByUserId(Long userId) { return repo.findByUserId(userId); }
    public void deleteById(Long id) { repo.deleteById(id); }
}
