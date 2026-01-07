package com.justsearch.backend.service.User.Impl;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.justsearch.backend.dto.RoleDto;
import com.justsearch.backend.dto.UpdateUserProfileRequest;
import com.justsearch.backend.dto.UserDto;
import com.justsearch.backend.model.User;
import com.justsearch.backend.repository.UserRepository;
import com.justsearch.backend.service.User.UserService;
@Service
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRoles().stream()
                                .map(role -> new RoleDto(role.getName(),role.getId()))
                                .collect(Collectors.toSet())))
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getCurrentUserProfile() {
        User user = getLoggedInUser();
        return mapToDto(user);
    }

    @Override
    public UserDto updateCurrentUserProfile(UpdateUserProfileRequest request) {
        User user = getLoggedInUser();

        user.setName(request.getName());
        user.setPhone(request.getPhone());

        userRepository.save(user);
        return mapToDto(user);
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserDto mapToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRoles()
                        .stream()
                        .map(role -> new RoleDto(role.getName(), role.getId()))
                        .collect(Collectors.toSet())
        );
    }
}