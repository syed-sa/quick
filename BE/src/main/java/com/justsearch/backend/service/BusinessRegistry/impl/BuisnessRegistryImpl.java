package com.justsearch.backend.service.BusinessRegistry.impl;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.justsearch.backend.constants.AppConstants;
import com.justsearch.backend.dto.RegisterBusinessDto;
import com.justsearch.backend.dto.ServiceDto;
import com.justsearch.backend.mapper.ServiceMapper;
import com.justsearch.backend.model.BuisnessCategory;
import com.justsearch.backend.model.Services;
import com.justsearch.backend.model.User;
import com.justsearch.backend.repository.CategoryRepository;
import com.justsearch.backend.repository.ServicesRepository;
import com.justsearch.backend.repository.UserRepository;
import com.justsearch.backend.service.BusinessRegistry.BuisnessRegistry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class BuisnessRegistryImpl implements BuisnessRegistry {
    private ServicesRepository _servicesRepository;
    private CategoryRepository _categoryRepository;
    private UserRepository _userRepository;
    private final ServiceMapper serviceMapper;
    @Value("${basepath}")
    private String basePath;

    public BuisnessRegistryImpl(ServicesRepository servicesRepository, CategoryRepository categoryRepository,
            UserRepository userRepository, ServiceMapper serviceMapper) {
        _servicesRepository = servicesRepository;
        _categoryRepository = categoryRepository;
        _userRepository = userRepository;
        this.serviceMapper = serviceMapper;
    }

    /// Register a new business service
    /// @param registerServices The DTO containing business registration details
    /// @throws RuntimeException if registration fails
    /// @return void
    public void registerBusiness(RegisterBusinessDto registerServices) {
        try {
            if (_servicesRepository.existsByServiceProviderIdAndCompanyName(registerServices.getUserId(),
                    registerServices.getCompanyName())) {

                throw new IllegalStateException("Business has already been registered by this user.");
            }

            else {
                Services services = new Services();

                User serviceProvider = _userRepository.findById(registerServices.getUserId())
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));

                BuisnessCategory businessCategory = _categoryRepository
                        .findById(registerServices.getBusinessCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Business category not found"));

                services.setServiceProvider(serviceProvider);
                services.setCompanyName(registerServices.getCompanyName());
                services.setCity(registerServices.getCity());
                services.setBusinessCategory(businessCategory);
                services.setAddress(registerServices.getAddress());
                services.setEmail(registerServices.getEmail());
                services.setPhone(registerServices.getPhone());
                services.setPostalCode(registerServices.getPostalCode());

                List<String> keywords = generateKeywords(registerServices.getCompanyName(),
                        businessCategory.getName(),
                        registerServices.getAddress(), businessCategory.getKeywords());

                services.setKeywords(keywords);

                String folderPath = basePath + AppConstants.USER_DATA + AppConstants.IMAGE_FOLDER
                        + registerServices.getUserId();

                if (registerServices.getImages() != null && registerServices.getImages().length > 0) {

                    int counter = registerServices.getImages().length;

                    for (MultipartFile image : registerServices.getImages()) {
                        String fileName = String.format(AppConstants.IMAGE_TEMPLATE, counter);
                        Path filePath = Path.of(folderPath, fileName);
                        counter--;
                        Files.createDirectories(filePath.getParent());
                        Files.copy(image.getInputStream(), filePath);
                    }

                }

                _servicesRepository.save(services);
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    /// Get global keyword suggestions from both categories and services
    /// @param query The input query string for suggestions
    /// @return A list of up to 10 unique keyword suggestions

    public List<String> getGlobalSuggestions(String query) {

        String cleanQuery = query.trim().toLowerCase();

        // 2. Fetch from both sources with a strict limit (Top 10 from each)
        // We use Limit.of(10) to prevent deep database scanning
        List<String> catKeywords = _categoryRepository.findKeywordSuggestions(
                cleanQuery,
                PageRequest.of(0, 10));

        List<String> serviceKeywords = _servicesRepository.findKeywordSuggestions(
                cleanQuery,
                PageRequest.of(0, 10));

        // 3. Merge into a Set to remove duplicates
        // TreeSet with CASE_INSENSITIVE_ORDER keeps them alphabetical
        Set<String> combinedResults = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

        combinedResults.addAll(catKeywords);
        combinedResults.addAll(serviceKeywords);

        return combinedResults.stream()
                .limit(10)
                .toList();
    }

    public Page<ServiceDto> getResults(String selectedKeyword, String postalCode, int page, int size) {
        // Create the pageable object (sorted by company name by default)
        Pageable pageable = PageRequest.of(page, size, Sort.by("companyName").ascending());

        // Fetch the page of entities
        Page<Services> servicesPage = _servicesRepository.findByUnifiedKeyword(selectedKeyword, postalCode, pageable);

        // Map the Page of Entities to a Page of DTOs
        return servicesPage.map(service -> serviceMapper.toDto(service));
    }

    public List<String> getImages(long serviceId) {
        try {
            Path path = Path.of(basePath, AppConstants.USER_DATA, AppConstants.IMAGE_FOLDER, String.valueOf(serviceId));
            if (!Files.exists(path)) {
                throw new IllegalArgumentException("Folder does not exist for service ID: " + serviceId);
            }

            String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();

            List<Path> files = Files.list(path)
                    .filter(Files::isRegularFile)
                    .collect(Collectors.toList());

            List<String> imageUrls = files.stream()
                    .map(file -> baseUrl + "/images/" + serviceId + "/" + file.getFileName().toString())
                    .collect(Collectors.toList());

            return imageUrls;

        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve images for service ID: " + serviceId, e);
        }
    }

    public List<ServiceDto> getServiceByUserId(Long userId) {

        if (userId <= 0) {
            throw new IllegalArgumentException("User ID must be greater than zero");
        }

        List<Services> services = _servicesRepository.findAllByServiceProviderId(userId);

        List<ServiceDto> serviceDtos = serviceMapper.toDtoList(services);

        return serviceDtos;
    }

    public void updateService(ServiceDto service) {

        if (service == null || service.getId() == 0) {
            throw new IllegalArgumentException("Service and Service ID must not be null");
        }

        if (!_servicesRepository.existsById(service.getId())) {
            throw new IllegalArgumentException("Service with ID " + service.getId() + " does not exist");
        }

        _servicesRepository.save(serviceMapper.toEntity(service));
    }

    private static final Set<String> STOP_WORDS = Set.of(
            "in", "and", "the", "for", "of", "to", "with", "on");

    private List<String> generateKeywords(
            String companyName,
            String categoryName,
            String address,
            List<String> categoryExistingKeywords) { // Pass the keywords from the Category Entity

        Set<String> keywordSet = new HashSet<>();

        // Add the specific words from name/address
        String combined = (companyName + " " + categoryName + " " + address).toLowerCase();
        for (String word : combined.split("\\W+")) {
            if (word.length() > 2 && !STOP_WORDS.contains(word)) {
                keywordSet.add(word);
            }
        }

        // Add the broad keywords already associated with the category
        if (categoryExistingKeywords != null) {
            categoryExistingKeywords.forEach(k -> keywordSet.add(k.toLowerCase()));
        }

        return new ArrayList<>(keywordSet);
    }

}
