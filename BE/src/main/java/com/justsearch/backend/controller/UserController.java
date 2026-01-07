package com.justsearch.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.justsearch.backend.dto.UpdateUserProfileRequest;
import com.justsearch.backend.dto.UserDto;
import com.justsearch.backend.service.User.UserService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/user")
public class UserController {

    private  UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/myProfile")
    public ResponseEntity<UserDto> getMyProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    // 🔹 Update current user profile
    @PutMapping("/updateMyProfile")
    public ResponseEntity<UserDto> updateMyProfile(
            @Valid @RequestBody UpdateUserProfileRequest request) {

        return ResponseEntity.ok(userService.updateCurrentUserProfile(request));
    }
}
