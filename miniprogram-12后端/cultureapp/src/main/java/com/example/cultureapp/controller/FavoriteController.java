package com.example.cultureapp.controller;

import com.example.cultureapp.model.Favorite;
import com.example.cultureapp.service.FavoriteService;
import com.example.cultureapp.service.FavoriteService.ToggleResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService service;

    // GET /api/favorites?userId=
    @GetMapping
    public ResponseEntity<List<Favorite>> listFavorites(@RequestParam(required = false) Long userId) {
        List<Favorite> list = service.getUserFavorites(userId);
        return ResponseEntity.ok(list);
    }

    // POST /api/favorites/{artworkId}/toggle?userId=
    @PostMapping("/{artworkId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @PathVariable Long artworkId,
            @RequestParam(required = false) Long userId
    ) {
        try {
            ToggleResult r = service.toggleFavorite(userId, artworkId);
            return ResponseEntity.ok(Map.of(
                    "added", r.added,
                    "removed", r.removed
            ));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "操作失败", "message", ex.getMessage()));
        }
    }

    // DELETE /api/favorites/{artworkId}?userId=
    @DeleteMapping("/{artworkId}")
    public ResponseEntity<Map<String, Object>> removeFavorite(
            @PathVariable Long artworkId,
            @RequestParam(required = false) Long userId
    ) {
        try {
            boolean removed = service.removeFavorite(userId, artworkId);
            return ResponseEntity.ok(Map.of("removed", removed));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "删除失败", "message", ex.getMessage()));
        }
    }

    // POST /api/favorites/{artworkId} -> 强制添加
    @PostMapping("/{artworkId}")
    public ResponseEntity<Map<String, Object>> addFavorite(
            @PathVariable Long artworkId,
            @RequestParam(required = false) Long userId
    ) {
        try {
            boolean added = service.addFavorite(userId, artworkId);
            return ResponseEntity.ok(Map.of("added", added));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "添加失败", "message", ex.getMessage()));
        }
    }
}
