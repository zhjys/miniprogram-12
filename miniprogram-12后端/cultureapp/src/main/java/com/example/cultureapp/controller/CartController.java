package com.example.cultureapp.controller;

import com.example.cultureapp.model.Cart;
import com.example.cultureapp.service.CartService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    private final CartService service;
    public CartController(CartService service){ this.service = service; }

    @GetMapping
    public List<Cart> list(@RequestParam Long userId){ return service.getByUserId(userId); }

    @PostMapping
    public Cart add(@RequestBody Cart cart){ return service.add(cart); }

    @PutMapping("/{id}")
    public Cart update(@PathVariable Long id, @RequestBody Cart cart){
        return service.updateQuantity(id, cart.getQuantity());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){ service.delete(id); }
}
