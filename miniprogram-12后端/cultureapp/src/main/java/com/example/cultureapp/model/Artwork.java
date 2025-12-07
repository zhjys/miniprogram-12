package com.example.cultureapp.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "artwork")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Artwork {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;      // 作品名称
    private String author;     // 作者
    private String era;        // 年代
    @Column(length = 2000)
    private String features;   // 工艺特点
    private String imageUrl;   // 封面图片 URL
    private LocalDateTime createdAt;
}
