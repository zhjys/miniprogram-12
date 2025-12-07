package com.example.cultureapp.utils;

import java.util.UUID;

public class TokenUtil {
    public static String generateToken(Long userId){
        return "TOKEN-" + userId + "-" + UUID.randomUUID();
    }
}
