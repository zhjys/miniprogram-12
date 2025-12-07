package com.example.cultureapp.service;

import com.example.cultureapp.model.Artwork;
import com.example.cultureapp.repository.ArtworkRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ArtworkService {
    private final ArtworkRepository repo;
    public ArtworkService(ArtworkRepository repo) { this.repo = repo; }

    public List<Artwork> listAll() { return repo.findAll(); }
    public Artwork getById(Long id) { return repo.findById(id).orElse(null); }
    public Artwork save(Artwork a) { return repo.save(a); }
    public void delete(Long id) { repo.deleteById(id); }
}
