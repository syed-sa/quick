package com.justsearch.backend.service.BusinessRegistry;
import java.util.List;
import com.justsearch.backend.dto.RegisterBusinessDto;
import com.justsearch.backend.dto.ServiceDto;   
import org.springframework.data.domain.Page;

public interface BuisnessRegistry {

    void registerBusiness(RegisterBusinessDto registerServices);

    Page<ServiceDto> getResults(String selectedKeyword, String postalCode, int page, int size);

    List<String> getImages(long service);

    List<ServiceDto> getServiceByUserId(Long userId);

    void updateService(ServiceDto service);

    List<String> getGlobalSuggestions(String q);

}