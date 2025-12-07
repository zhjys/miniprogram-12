package com.example.cultureapp.service;

import com.example.cultureapp.model.User;
import com.example.cultureapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo){
        this.repo = repo;
    }

    public Optional<User> findByUsername(String username){
        return repo.findByUsername(username);
    }

    public Optional<User> findById(Long id){
        return repo.findById(id);
    }

    public User save(User user){
        return repo.save(user);
    }
}
