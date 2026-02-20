package com.justsearch.backend.mapper;

import com.justsearch.backend.dto.ServiceDto;
import com.justsearch.backend.model.ServiceImage;
import com.justsearch.backend.model.Services;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ServiceMapper {

    ServiceMapper INSTANCE = Mappers.getMapper(ServiceMapper.class);

    @Mapping(target = "userId", source = "serviceProvider.id")
    @Mapping(target = "businessCategoryId", source = "businessCategory.id")
    ServiceDto toDto(Services service);

    List<ServiceDto> toDtoList(List<Services> services);

    // Map single image to URL
    default String map(ServiceImage image) {
        return image.getImageUrl();
    }

    @Mapping(target = "serviceProvider", ignore = true)
    @Mapping(target = "businessCategory", ignore = true)
    @Mapping(target = "images", ignore = true) // 👈 ignore here
    Services toEntity(ServiceDto dto);

    List<Services> toEntityList(List<ServiceDto> serviceDtos);
}
