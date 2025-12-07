package com.example.cultureapp.repository;

import com.example.cultureapp.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    boolean existsByUserIdAndArtworkId(Long userId, Long artworkId);

    void deleteByUserIdAndArtworkId(Long userId, Long artworkId);

    // 为了 admin/清理方便，按 artworkId 删除
    void deleteByArtworkId(Long artworkId);

    List<Favorite> findByUserId(Long userId);

    Optional<Favorite> findByUserIdAndArtworkId(Long userId, Long artworkId);
}
