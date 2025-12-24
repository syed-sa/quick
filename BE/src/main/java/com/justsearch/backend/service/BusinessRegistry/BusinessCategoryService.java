package com.justsearch.backend.service.BusinessRegistry;
import java.util.List;

import com.justsearch.backend.dto.CategorySuggestionDto;
public interface BusinessCategoryService {
    List<CategorySuggestionDto> getSuggestions(String query);
}
