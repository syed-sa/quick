package com.justsearch.backend.dto;

public class CategorySuggestionDto {

    private Long id;
    private String name;

    public CategorySuggestionDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
