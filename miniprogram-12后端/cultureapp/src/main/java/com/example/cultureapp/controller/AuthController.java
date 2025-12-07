package com.example.cultureapp.controller;

import com.example.cultureapp.model.User;
import com.example.cultureapp.service.UserService;
import com.example.cultureapp.utils.TokenUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }

    /** 登录 */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body){

        String username = body.get("username");
        String password = body.get("password");

        var opt = userService.findByUsername(username);
        if (opt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "用户不存在"));
        }

        User u = opt.get();
        if (!u.getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "密码错误"));
        }

        // 使用 TokenUtil
        String token = TokenUtil.generateToken(u.getId());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", u
        ));
    }

    /** 注册 */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user){

        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error","用户名已存在"));
        }

        user.setRole("USER");
        userService.save(user);

        return ResponseEntity.ok(Map.of("msg", "注册成功"));
    }

    /** 获取用户信息 */
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id){
        var opt = userService.findById(id);
        if(opt.isEmpty()){
            return ResponseEntity.status(404).body(Map.of("error","用户不存在"));
        }
        return ResponseEntity.ok(opt.get());
    }

    /** 更新用户资料（头像 + 简介） */
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody User data){

        var opt = userService.findById(data.getId());
        if (opt.isEmpty()){
            return ResponseEntity.status(404).body(Map.of("error","用户不存在"));
        }

        User u = opt.get();

        if(data.getAvatarUrl() != null) u.setAvatarUrl(data.getAvatarUrl());
        if(data.getBio() != null) u.setBio(data.getBio());

        userService.save(u);

        return ResponseEntity.ok(Map.of("msg","更新成功", "user",u));
    }
}
