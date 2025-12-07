// src/main/java/com/example/cultureapp/model/Video.java
package com.example.cultureapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "video")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 上传后保存的文件名（不含路径）
    private String filename;

    // 原始文件名（上传时）
    private String originalName;

    // 可访问的 URL（可选，服务端可以动态拼接）
    private String url;

    // 关联的 artwork id（如果上传视频与某作品关联）
    private Long artworkId;

    // 上传用户 id（可为空）
    private Long userId;

    private LocalDateTime createdAt;
}
