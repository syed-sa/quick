package com.justsearch.backend.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "services", uniqueConstraints = @UniqueConstraint(columnNames = { "service_provider_id",
        "company_name" }))
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_provider_id", nullable = false)
    private User serviceProvider;

    @Column(name = "company_name")
    private String companyName;

    private String city;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_category_id", nullable = false)
    private BuisnessCategory businessCategory;

    private String phone;

    private String email;

    private String address;

    private String postalCode;
    @ElementCollection  
    private List<String> keywords;


    public List<String> getKeywords() {
        return keywords;
    }
    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }
    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public BuisnessCategory getBusinessCategory() {
        return businessCategory;
    }

    public void setBusinessCategory(BuisnessCategory businessCategory) {
        this.businessCategory = businessCategory;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public User getServiceProvider() {
        return serviceProvider;
    }

    public void setServiceProvider(User serviceProvider) {
        this.serviceProvider = serviceProvider;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public long getId() {
        return id;
    }
}
