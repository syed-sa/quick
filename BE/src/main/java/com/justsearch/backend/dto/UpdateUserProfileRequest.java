package com.justsearch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateUserProfileRequest {

    @NotBlank
    private String name;

    @Pattern(regexp = "^[0-9]{10}$", message = "Invalid phone number")
    private String phone;

    private String city;

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getCity() {
        return city;
    }
}
