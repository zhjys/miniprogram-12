package com.example.cultureapp.service;

import com.example.cultureapp.model.Artwork;
import com.example.cultureapp.model.Favorite;
import com.example.cultureapp.repository.ArtworkRepository;
import com.example.cultureapp.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository repo;

    @Autowired
    private ArtworkRepository artworkRepo;

    // 默认 user id（开发阶段无登录时）
    private static final Long DEFAULT_USER_ID = 1L;

    private Long resolveUserId(Long userId) {
        return (userId == null) ? DEFAULT_USER_ID : userId;
    }

    /**
     * 收藏（把 artwork 的基本字段复制到 favorites 表）
     * 返回 true 表示新增；false 表示已存在或 artwork 不存在
     */
    @Transactional
    public boolean addFavorite(Long userId, Long artworkId) {
        Long uid = resolveUserId(userId);
        if (repo.existsByUserIdAndArtworkId(uid, artworkId)) return false;

        Artwork art = artworkRepo.findById(artworkId).orElse(null);
        if (art == null) return false;

        Favorite fav = new Favorite();
        fav.setUserId(uid);
        fav.setArtworkId(artworkId);
        fav.setTitle(art.getTitle());
        fav.setAuthor(art.getAuthor());
        fav.setEra(art.getEra());
        fav.setFeatures(art.getFeatures());
        fav.setImageUrl(art.getImageUrl());

        repo.save(fav);
        return true;
    }

    /**
     * 取消收藏（按 user + artwork）
     */
    @Transactional
    public boolean removeFavorite(Long userId, Long artworkId) {
        Long uid = resolveUserId(userId);
        // 检查是否存在
        if (!repo.findByUserIdAndArtworkId(uid, artworkId).isPresent()) return false;
        repo.deleteByUserIdAndArtworkId(uid, artworkId);
        return true;
    }

    /**
     * 切换收藏（如果已收藏则删除并返回 removed=true；否则添加并返回 added=true）
     */
    @Transactional
    public ToggleResult toggleFavorite(Long userId, Long artworkId) {
        Long uid = resolveUserId(userId);
        boolean exists = repo.findByUserIdAndArtworkId(uid, artworkId).isPresent();
        if (exists) {
            repo.deleteByUserIdAndArtworkId(uid, artworkId);
            return new ToggleResult(false, true);
        } else {
            Artwork art = artworkRepo.findById(artworkId).orElse(null);
            if (art == null) return new ToggleResult(false, false);
            Favorite fav = new Favorite();
            fav.setUserId(uid);
            fav.setArtworkId(artworkId);
            fav.setTitle(art.getTitle());
            fav.setAuthor(art.getAuthor());
            fav.setEra(art.getEra());
            fav.setFeatures(art.getFeatures());
            fav.setImageUrl(art.getImageUrl());
            repo.save(fav);
            return new ToggleResult(true, false);
        }
    }

    public List<Favorite> getUserFavorites(Long userId) {
        Long uid = resolveUserId(userId);
        return repo.findByUserId(uid);
    }

    public List<Favorite> getAllFavorites() {
        return repo.findAll();
    }

    public static class ToggleResult {
        public final boolean added;
        public final boolean removed;
        public ToggleResult(boolean added, boolean removed) { this.added = added; this.removed = removed; }
    }
}
