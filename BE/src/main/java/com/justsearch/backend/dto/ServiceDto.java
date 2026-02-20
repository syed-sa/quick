package com.justsearch.backend.dto;

import java.util.List;

    
public class ServiceDto implements java.io.Serializable {
    private long id;
    private long userId;
    private String companyName;
    private String city;
    private long businessCategoryId;
    private String phone;
    private String email;
    private String address;
    private String postalCode;
    private List<String> keywords;
    private List<String> images;

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

    public long getBusinessCategoryId() {
        return businessCategoryId;
    }

    public void setBusinessCategoryId(long businessCategoryId) {
        this.businessCategoryId = businessCategoryId;
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

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
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
    public void setId(long id) {
        this.id = id;
    }
    public List<String> getImages() {
        return images;
    }
    public void setImages(List<String> images) {
        this.images = images;
    }

}
