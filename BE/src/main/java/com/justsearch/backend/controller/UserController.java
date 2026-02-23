package com.justsearch.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.justsearch.backend.dto.UpdateUserProfileRequest;
import com.justsearch.backend.dto.UserDto;
import com.justsearch.backend.service.User.UserService;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/user")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 🔹 Get all users (admin only)
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDto>> getUsers(
            @RequestParam(required = false) String role) {

        List<UserDto> users;

        if (role != null && !role.isBlank()) {
            users = userService.getUsersByRole(role);
        } else {
            users = userService.getAllUsers();
        }

        return ResponseEntity.ok(users);
    }

    // 🔹 Get current user profile
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
