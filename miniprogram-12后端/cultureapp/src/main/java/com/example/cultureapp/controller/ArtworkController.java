package com.example.cultureapp.controller;

import com.example.cultureapp.model.Artwork;
import com.example.cultureapp.service.ArtworkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = "*") // 微信小程序调试需要允许跨域
public class ArtworkController {
    private final ArtworkService service;
    public ArtworkController(ArtworkService service){ this.service = service; }

    @GetMapping
    public List<Artwork> list(){
        return service.listAll();
    }

    @GetMapping("/{id}")
    public Artwork get(@PathVariable Long id){
        return service.getById(id);
    }

    @PostMapping
    public Artwork create(@RequestBody Artwork artwork){
        return service.save(artwork);
    }

    @PutMapping("/{id}")
    public Artwork update(@PathVariable Long id, @RequestBody Artwork artwork){
        artwork.setId(id);
        return service.save(artwork);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}
