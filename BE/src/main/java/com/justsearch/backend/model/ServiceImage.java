package com.justsearch.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "service_images")
public class ServiceImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    private String publicId; // Needed to delete from Cloudinary

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    @JsonIgnore
    private Services service;

    public Long getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getPublicId() {
        return publicId;
    }

    public Services getService() {
        return service;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public void setService(Services service) {
        this.service = service;
    }
}
