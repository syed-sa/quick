package com.justsearch.backend.service.BusinessRegistry.impl;

import com.justsearch.backend.dto.CategorySuggestionDto;
import com.justsearch.backend.repository.CategoryRepository;
import com.justsearch.backend.service.BusinessRegistry.BusinessCategoryService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessCategoryServiceImpl implements BusinessCategoryService {

    private final CategoryRepository categoryRepository;

    public BusinessCategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategorySuggestionDto> getSuggestions(String query) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }

        return categoryRepository.findMatchingCategories(query.trim())
                .stream()
                .map(c -> new CategorySuggestionDto(c.getId(), c.getName()))
                .toList();
    }
}
