package com.justsearch.backend.service.BusinessRegistry.impl;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.justsearch.backend.dto.RegisterBusinessDto;
import com.justsearch.backend.dto.ServiceDto;
import com.justsearch.backend.mapper.ServiceMapper;
import com.justsearch.backend.model.BuisnessCategory;
import com.justsearch.backend.model.ServiceImage;
import com.justsearch.backend.model.Services;
import com.justsearch.backend.model.User;
import com.justsearch.backend.repository.CategoryRepository;
import com.justsearch.backend.repository.ServiceImageRepository;
import com.justsearch.backend.repository.ServicesRepository;
import com.justsearch.backend.repository.UserRepository;
import com.justsearch.backend.service.BusinessRegistry.BuisnessRegistry;

@Service
public class BuisnessRegistryImpl implements BuisnessRegistry {
    private final ServicesRepository servicesRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;
    private final ServiceImageRepository serviceImageRepository;
    private static final Logger log = LoggerFactory.getLogger(BuisnessRegistryImpl.class);

    private final ServiceMapper serviceMapper;

    public BuisnessRegistryImpl(ServicesRepository servicesRepository, CategoryRepository categoryRepository,
            UserRepository userRepository, ServiceMapper serviceMapper, Cloudinary cloudinary, ServiceImageRepository serviceImageRepository) {
        this.servicesRepository = servicesRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.serviceMapper = serviceMapper;
        this.cloudinary = cloudinary;
        this.serviceImageRepository = serviceImageRepository;

    }

    /// Register a new business service
    /// @param registerServices The DTO containing business registration details
    /// @throws RuntimeException if registration fails
    /// @return void
    @CacheEvict(value = "service-search", allEntries = true)

    public void registerBusiness(RegisterBusinessDto registerServices) {
        try {
            log.info("Register business request received userId={}, companyName={}",
                    registerServices.getUserId(), registerServices.getCompanyName());

            if (servicesRepository.existsByServiceProviderIdAndCompanyName(registerServices.getUserId(),
                    registerServices.getCompanyName())) {

                log.warn("Duplicate business registration attempt userId={}, companyName={}",
                        registerServices.getUserId(), registerServices.getCompanyName());

                throw new IllegalStateException("Business has already been registered by this user.");
            }

            Services services = new Services();

            User serviceProvider = userRepository.findById(registerServices.getUserId())
                    .orElseThrow(() -> {
                        log.warn("User not found userId={}", registerServices.getUserId());
                        return new IllegalArgumentException("User not found");
                    });
            BuisnessCategory businessCategory = categoryRepository
                    .findById(registerServices.getBusinessCategoryId())
                    .orElseThrow(() -> {
                        log.warn("Category not found categoryId={}",
                                registerServices.getBusinessCategoryId());
                        return new IllegalArgumentException("Business category not found");
                    });

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

            servicesRepository.save(services);
            services = servicesRepository.findById(services.getId()).orElseThrow();
            log.info("Business registered successfully serviceId={}, userId={}",
                    services.getId(), serviceProvider.getId());

            uploadImagesAsync(
                    services,
                    registerServices.getImages());

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

   

    public List<ServiceDto> getServiceByUserId(Long userId) {
        log.debug("Fetching services for userId={}", userId);

        if (userId <= 0) {
            log.warn("Invalid userId={}", userId);

            throw new IllegalArgumentException("User ID must be greater than zero");
        }

        List<Services> services = servicesRepository.findAllByServiceProviderId(userId);

        List<ServiceDto> serviceDtos = serviceMapper.toDtoList(services);
        log.debug("Services fetched count={} userId={}", serviceDtos.size(), userId);

        return serviceDtos;
    }

    @CacheEvict(value = "service-search", allEntries = true)
    public void updateService(ServiceDto service) {
        log.info("Update service request serviceId={}", service != null ? service.getId() : null);

        if (service == null || service.getId() == 0) {
            log.warn("Invalid service update request");

            throw new IllegalArgumentException("Service and Service ID must not be null");
        }

        if (!servicesRepository.existsById(service.getId())) {
            log.warn("Service not found serviceId={}", service.getId());

            throw new IllegalArgumentException("Service with ID " + service.getId() + " does not exist");
        }

        servicesRepository.save(serviceMapper.toEntity(service));
        log.info("Service updated successfully serviceId={}", service.getId());

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

    @Async
    public void uploadImagesAsync(Services service, MultipartFile[] images) {

        if (images == null || images.length == 0) {
            log.debug("No images to upload serviceId={}", service.getId());
            return;
        }

        log.info("Async Cloudinary upload started serviceId={}, imageCount={}",
                service.getId(), images.length);

        try {

            for (MultipartFile image : images) {

                Map uploadResult = cloudinary.uploader().upload(
                        image.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "justsearch/services/" + service.getId()));

                String imageUrl = uploadResult.get("secure_url").toString();
                String publicId = uploadResult.get("public_id").toString();

                ServiceImage serviceImage = new ServiceImage();
                serviceImage.setImageUrl(imageUrl);
                serviceImage.setPublicId(publicId);
                serviceImage.setService(service);

                serviceImageRepository.save(serviceImage);

            }

            log.info("Cloudinary upload completed serviceId={}", service.getId());

        } catch (Exception e) {
            log.error("Cloudinary upload failed for service {}", service.getId(), e);
        }
    }

}
