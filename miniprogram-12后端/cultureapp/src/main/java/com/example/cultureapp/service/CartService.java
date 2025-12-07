package com.example.cultureapp.service;

import com.example.cultureapp.model.Cart;
import com.example.cultureapp.repository.CartRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {
    private final CartRepository repo;

    public CartService(CartRepository repo){ this.repo = repo; }

    public List<Cart> getByUserId(Long userId){ return repo.findByUserId(userId); }

    public Cart add(Cart cart){ return repo.save(cart); }

    public Cart updateQuantity(Long id, Integer quantity){
        Cart c = repo.findById(id).orElseThrow();
        c.setQuantity(quantity);
        return repo.save(c);
    }

    public void delete(Long id){ repo.deleteById(id); }
}
