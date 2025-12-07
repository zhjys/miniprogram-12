package com.example.cultureapp.controller;

import com.example.cultureapp.model.Video;
import com.example.cultureapp.service.VideoService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class UploadController {

    private final VideoService videoService;

    // 内存存储视频内容，key = filename
    private final Map<String, byte[]> videoMemory = new HashMap<>();

    public UploadController(VideoService videoService) {
        this.videoService = videoService;
    }

    // 上传视频
    @PostMapping("/video")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file,
                                         @RequestParam(value = "artworkId", required = false) Long artworkId,
                                         @RequestParam(value = "userId", required = false) Long userId) throws IOException {

        if (file == null || file.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "文件为空"));

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String ext = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) ext = originalFilename.substring(dotIndex);

        String uuid = UUID.randomUUID().toString().replace("-", "");
        String storedFileName = uuid + ext;

        // 读取文件到内存
        videoMemory.put(storedFileName, file.getBytes());

        // 构建访问 URL
        String url = "/api/upload/video/" + storedFileName;

        // 保存数据库元数据
        Video v = Video.builder()
                .filename(storedFileName)
                .originalName(originalFilename)
                .url(url)
                .artworkId(artworkId)
                .userId(userId)
                .createdAt(LocalDateTime.now())
                .build();

        Video saved = videoService.save(v);

        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "url", url,
                "filename", storedFileName,
                "originalName", originalFilename
        ));
    }

    // 获取视频列表
    @GetMapping("/videos")
    public ResponseEntity<?> listVideos() {
        List<Video> list = videoService.findAll();
        return ResponseEntity.ok(list);
    }

    // 通过 URL 流式返回视频内容（内存中）
    @GetMapping("/video/{filename}")
    public ResponseEntity<byte[]> serveVideo(@PathVariable String filename) {
        byte[] data = videoMemory.get(filename);
        if (data == null) return ResponseEntity.notFound().build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentLength(data.length);
        return ResponseEntity.ok().headers(headers).body(data);
    }

    // 删除视频
    @DeleteMapping("/video/{id}")
    public ResponseEntity<?> deleteVideo(@PathVariable Long id) {
        Optional<Video> opt = videoService.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Video v = opt.get();
        videoMemory.remove(v.getFilename()); // 删除内存视频
        videoService.deleteById(id);         // 删除数据库记录

        return ResponseEntity.ok(Map.of("msg", "已删除"));
    }

    // 编辑视频名称
    @PutMapping("/video/{id}")
    public ResponseEntity<?> updateVideoMeta(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<Video> opt = videoService.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Video v = opt.get();

        if (body.containsKey("originalName")) v.setOriginalName(body.get("originalName").toString());
        Video saved = videoService.save(v);

        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "originalName", saved.getOriginalName(),
                "url", saved.getUrl()
        ));
    }
}
